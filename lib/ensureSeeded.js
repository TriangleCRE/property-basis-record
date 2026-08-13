// Self-healing setup: every data-access path calls ensureReady() before doing
// anything else. It creates the tables if they don't exist yet, makes sure
// exactly one "live" period exists, backfills any legacy 'basis' rows onto
// that live period (for databases that predate the periods table), and —
// only when the properties table is completely empty — loads the original
// seed data onto that same live period.
//
// This means the live site never depends on a human remembering to run a
// migration/seed script against the real database: the first request after
// a deploy (whether against a fresh database or the existing production one)
// brings the schema up to date itself. Because seeding only ever happens
// when the table has zero rows, and the backfill only ever touches rows that
// don't already have a period_id, this can never clobber real edits once
// real data exists.
//
// A Postgres advisory lock guards the whole live-period-bootstrap + backfill
// + seed sequence so that several concurrent cold-start requests can't race
// each other into double-seeding or double-creating the live period.

const { getPool } = require('./db');
const { createTableIfMissing } = require('./schema');
const { SEED_ROWS } = require('./seedData');

// The original, permanent period — matches the label this dashboard has
// always shown for its database-backed data.
const LIVE_PERIOD_LABEL = 'May 2026';

// Arbitrary fixed key for the advisory lock — only needs to be unique within
// this database.
const SEED_LOCK_KEY = 727271;

// Memoize per warm serverless instance so repeat requests on the same
// instance skip straight through without re-checking anything.
let readyPromise = null;

async function ensureLivePeriod(client) {
  await client.query(
    `INSERT INTO periods (label, is_live, sort_order)
     VALUES ($1, true, 0)
     ON CONFLICT (label) DO NOTHING`,
    [LIVE_PERIOD_LABEL]
  );
  const { rows } = await client.query('SELECT id FROM periods WHERE is_live = true ORDER BY id LIMIT 1');
  return rows[0].id;
}

async function backfillLegacyBasisRows(client, livePeriodId) {
  await client.query(
    `UPDATE properties SET period_id = $1 WHERE category = 'basis' AND period_id IS NULL`,
    [livePeriodId]
  );
}

async function seedIfEmpty(client, livePeriodId) {
  const { rows } = await client.query('SELECT COUNT(*)::int AS count FROM properties');
  if (rows[0].count > 0) return { seeded: false, count: rows[0].count };

  await client.query('BEGIN');
  try {
    for (const row of SEED_ROWS) {
      const periodId = row.category === 'basis' ? livePeriodId : null;
      await client.query(
        `INSERT INTO properties (category, name, land, building, accdep, address, extra, sort_order, period_id)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [row.category, row.name, row.land, row.building, row.accdep, row.address, row.extra, row.sort_order, periodId]
      );
    }
    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  }
  return { seeded: true, count: SEED_ROWS.length };
}

async function ensureReady() {
  if (!readyPromise) {
    readyPromise = (async () => {
      const pool = getPool();
      const client = await pool.connect();
      try {
        await createTableIfMissing(client);
        await client.query('SELECT pg_advisory_lock($1)', [SEED_LOCK_KEY]);
        try {
          const livePeriodId = await ensureLivePeriod(client);
          await backfillLegacyBasisRows(client, livePeriodId);
          await seedIfEmpty(client, livePeriodId);
        } finally {
          await client.query('SELECT pg_advisory_unlock($1)', [SEED_LOCK_KEY]);
        }
      } finally {
        client.release();
      }
    })().catch((err) => {
      // Don't cache a failed attempt — let the next request retry.
      readyPromise = null;
      throw err;
    });
  }
  return readyPromise;
}

module.exports = { ensureReady, LIVE_PERIOD_LABEL };
