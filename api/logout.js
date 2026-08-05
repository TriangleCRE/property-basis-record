// POST /api/logout -> clears the session cookie

const { clearSessionCookie } = require('../lib/auth');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).json({ error: `Method ${req.method} not allowed` });
    return;
  }
  clearSessionCookie(req, res);
  res.status(200).json({ ok: true });
};
