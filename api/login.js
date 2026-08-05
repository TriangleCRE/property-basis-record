// POST /api/login  body: { passcode } -> { ok: true } + sets an HttpOnly session cookie
//
// The passcode is compared against the PASSCODE environment variable on the
// server only. Nothing about the passcode itself is ever sent back to the
// browser — success responds with a signed session token in an HttpOnly
// cookie, failure reveals nothing beyond "incorrect".

const { setSessionCookie, verifyPasscode } = require('../lib/auth');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).json({ error: `Method ${req.method} not allowed` });
    return;
  }

  try {
    const { passcode } = req.body || {};
    if (!passcode || typeof passcode !== 'string') {
      res.status(400).json({ error: 'Passcode is required' });
      return;
    }
    if (!verifyPasscode(passcode)) {
      res.status(401).json({ error: 'Incorrect passcode' });
      return;
    }
    setSessionCookie(req, res);
    res.status(200).json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
  }
};
