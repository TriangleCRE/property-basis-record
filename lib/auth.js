// Server-side passcode gate.
//
// The passcode itself is read only from the PASSCODE environment variable
// and is never sent to, or embedded in, front-end code. On successful
// login we hand the browser a signed, expiring session token (as an
// HttpOnly cookie) instead of the passcode itself — the token proves the
// visitor logged in without ever revealing what the passcode was.
//
// The signing key is derived from the passcode, so if the passcode is ever
// rotated, every previously-issued session token stops verifying.

const crypto = require('crypto');

const COOKIE_NAME = 'pbr_session';
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

function getPasscode() {
  const passcode = process.env.PASSCODE;
  if (!passcode) {
    throw Object.assign(new Error('PASSCODE environment variable is not set'), { status: 500 });
  }
  return passcode;
}

function signingKey() {
  return crypto.createHash('sha256').update('pbr-session-v1:' + getPasscode()).digest();
}

function createSessionToken() {
  const payload = JSON.stringify({ exp: Date.now() + SESSION_TTL_MS });
  const payloadB64 = Buffer.from(payload).toString('base64url');
  const sig = crypto.createHmac('sha256', signingKey()).update(payloadB64).digest('base64url');
  return `${payloadB64}.${sig}`;
}

function verifySessionToken(token) {
  if (!token || typeof token !== 'string') return false;
  const parts = token.split('.');
  if (parts.length !== 2) return false;
  const [payloadB64, sig] = parts;

  let expectedSig;
  try {
    expectedSig = crypto.createHmac('sha256', signingKey()).update(payloadB64).digest('base64url');
  } catch (e) {
    return false; // e.g. PASSCODE not configured
  }
  const sigBuf = Buffer.from(sig);
  const expectedBuf = Buffer.from(expectedSig);
  if (sigBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(sigBuf, expectedBuf)) {
    return false;
  }

  let payload;
  try {
    payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf8'));
  } catch (e) {
    return false;
  }
  return typeof payload.exp === 'number' && Date.now() <= payload.exp;
}

function verifyPasscode(candidate) {
  const passcode = getPasscode();
  const a = Buffer.from(String(candidate ?? ''));
  const b = Buffer.from(passcode);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

function parseCookies(req) {
  const header = req.headers.cookie;
  const cookies = {};
  if (!header) return cookies;
  header.split(';').forEach((part) => {
    const idx = part.indexOf('=');
    if (idx === -1) return;
    const k = part.slice(0, idx).trim();
    const v = part.slice(idx + 1).trim();
    if (k) cookies[k] = decodeURIComponent(v);
  });
  return cookies;
}

function isAuthenticated(req) {
  const cookies = parseCookies(req);
  return verifySessionToken(cookies[COOKIE_NAME]);
}

function setSessionCookie(req, res) {
  const token = createSessionToken();
  const isHttps = req.headers['x-forwarded-proto'] === 'https';
  const parts = [
    `${COOKIE_NAME}=${token}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    `Max-Age=${Math.floor(SESSION_TTL_MS / 1000)}`,
  ];
  if (isHttps) parts.push('Secure');
  res.setHeader('Set-Cookie', parts.join('; '));
}

function clearSessionCookie(req, res) {
  const isHttps = req.headers['x-forwarded-proto'] === 'https';
  const parts = [`${COOKIE_NAME}=`, 'Path=/', 'HttpOnly', 'SameSite=Lax', 'Max-Age=0'];
  if (isHttps) parts.push('Secure');
  res.setHeader('Set-Cookie', parts.join('; '));
}

// Call at the top of any /api handler that should sit behind the passcode
// gate. Returns false (and has already written a 401 response) if the
// visitor isn't logged in — callers should return immediately in that case.
function requireAuth(req, res) {
  if (!isAuthenticated(req)) {
    res.status(401).json({ error: 'Not authenticated' });
    return false;
  }
  return true;
}

module.exports = {
  COOKIE_NAME,
  isAuthenticated,
  setSessionCookie,
  clearSessionCookie,
  requireAuth,
  verifyPasscode,
};
