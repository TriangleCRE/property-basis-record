// DELETE /api/periods/:label -> delete a period and every basis row on it.
// The live, original period can never be deleted this way. Matching is by
// exact label only (deleting "June 2026" never touches a separately-loaded
// "Jun 2026").

const { deletePeriod } = require('../../lib/properties');
const { requireAuth } = require('../../lib/auth');

module.exports = async function handler(req, res) {
  if (!requireAuth(req, res)) return;
  const label = decodeURIComponent(req.query.label || '');
  if (!label) {
    res.status(400).json({ error: 'label is required' });
    return;
  }

  try {
    if (req.method === 'DELETE') {
      const result = await deletePeriod(label);
      res.status(200).json(result);
      return;
    }

    res.setHeader('Allow', 'DELETE');
    res.status(405).json({ error: `Method ${req.method} not allowed` });
  } catch (err) {
    console.error(err);
    res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
  }
};
