// Self-healing setup: every data-access path calls ensureReady() before doing
// anything else. It creates the table if it doesn't exist yet, and — only
// when the table is completely empty — loads the original seed data.
//
// This means the live site never depends on a human remembering to run a
// migration/seed script against the real database: the first request after
// a deploy (to a fresh database) creates the table and seeds it itself.
// Because seeding only ever happens when the table has zero rows, it can
// never clobber real edits once real data exists.
//
// A Postgres advisory lock guards the empty-check + insert so that several
// concurrent cold-start requests can't race each other into double-seeding.

const { getPool } = require('./db');
const { createTableIfMissing } = require('./schema');
const { SEED_ROWS } = require('./seedData');

// Arbitrary fixed key for the advisory lock — only needs to be unique within
// this database.
const SEED_LOCK_KEY = 727271;

// Memoize per warm serverless instance so repeat requests on the same
// instance skip straight through without re-checking anything.
let readyPromise = null;

async function seedIfEmpty(client) {
  await client.query('SELECT pg_advisory_lock($1)', [SEED_LOCK_KEY]);
  try {
    const { rows } = await client.query('SELECT COUNT(*)::int AS count FROM properties');
    if (rows[0].count > 0) return { seeded: false, count: rows[0].count };

    await client.query('BEGIN');
    try {
      for (const row of SEED_ROWS) {
        await client.query(
          `INSERT INTO properties (category, name, land, building, accdep, address, extra, sort_order)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [row.category, row.name, row.land, row.building, row.accdep, row.address, row.extra, row.sort_order]
        );
      }
      await client.query('COMMIT');
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    }
    return { seeded: true, count: SEED_ROWS.length };
  } finally {
    await client.query('SELECT pg_advisory_unlock($1)', [SEED_LOCK_KEY]);
  }
}

async function ensureReady() {
  if (!readyPromise) {
    readyPromise = (async () => {
      const pool = getPool();
      const client = await pool.connect();
      try {
        await createTableIfMissing(client);
        await seedIfEmpty(client);
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

module.exports = { ensureReady };
