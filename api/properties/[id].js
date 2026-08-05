// PUT    /api/properties/:id  -> update one or more fields, body: { name?, land?, building?, accdep?, address?, extra? }
// DELETE /api/properties/:id  -> remove the record

const { update, remove } = require('../../lib/properties');

module.exports = async function handler(req, res) {
  const id = Number(req.query.id);
  if (!Number.isInteger(id)) {
    res.status(400).json({ error: 'id must be an integer' });
    return;
  }

  try {
    if (req.method === 'PUT' || req.method === 'PATCH') {
      const body = req.body || {};
      const row = await update(id, body);
      res.status(200).json(row);
      return;
    }

    if (req.method === 'DELETE') {
      const row = await remove(id);
      res.status(200).json(row);
      return;
    }

    res.setHeader('Allow', 'PUT, PATCH, DELETE');
    res.status(405).json({ error: `Method ${req.method} not allowed` });
  } catch (err) {
    console.error(err);
    res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
  }
};
