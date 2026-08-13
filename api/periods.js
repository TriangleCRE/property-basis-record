// POST /api/periods -> create a new period (or replace an existing
// non-live one in place), body: { label, asOf?, properties: [{name, land?, building?, accdep?, address?}] }
// Used by "+ Add period" (CSV) and "Add Period with Claude" (JSON) so those
// periods are saved permanently instead of living only in the browser tab.

const { createOrReplacePeriod } = require('../lib/properties');
const { requireAuth } = require('../lib/auth');

module.exports = async function handler(req, res) {
  if (!requireAuth(req, res)) return;
  try {
    if (req.method === 'POST') {
      const body = req.body || {};
      const period = await createOrReplacePeriod(body);
      res.status(201).json(period);
      return;
    }

    res.setHeader('Allow', 'POST');
    res.status(405).json({ error: `Method ${req.method} not allowed` });
  } catch (err) {
    console.error(err);
    res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
  }
};
