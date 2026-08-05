// GET  /api/properties  -> { basis: [...], not_relevant: [...], not_included: [...] }
// POST /api/properties  -> create a new record, body: { category, name, land?, building?, accdep?, address?, extra? }

const { listAll, create } = require('../lib/properties');
const { requireAuth } = require('../lib/auth');

module.exports = async function handler(req, res) {
  if (!requireAuth(req, res)) return;
  try {
    if (req.method === 'GET') {
      const data = await listAll();
      res.status(200).json(data);
      return;
    }

    if (req.method === 'POST') {
      const body = req.body || {};
      const row = await create(body);
      res.status(201).json(row);
      return;
    }

    res.setHeader('Allow', 'GET, POST');
    res.status(405).json({ error: `Method ${req.method} not allowed` });
  } catch (err) {
    console.error(err);
    res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
  }
};
