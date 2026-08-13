#!/usr/bin/env node
// Standalone seed script for manual/local use.
//
// The live site does NOT depend on this being run — api/ code seeds itself
// automatically the first time it's used against an empty table (see
// lib/ensureSeeded.js). This script exists for local development, and as a
// manual way to provision a brand-new database ahead of a deploy.
//
// It only ever inserts when the table is completely empty — it will never
// overwrite real edits once real data exists.
//
// Usage:
//   DATABASE_URL=postgres://... node scripts/seed.js

const { getPool } = require('../lib/db');
const { createTableIfMissing } = require('../lib/schema');
const { SEED_ROWS } = require('../lib/seedData');
const { LIVE_PERIOD_LABEL } = require('../lib/ensureSeeded');

async function main() {
  const pool = getPool();
  const client = await pool.connect();
  try {
    await createTableIfMissing(client);

    await client.query(
      `INSERT INTO periods (label, is_live, sort_order) VALUES ($1, true, 0) ON CONFLICT (label) DO NOTHING`,
      [LIVE_PERIOD_LABEL]
    );
    const { rows: liveRows } = await client.query('SELECT id FROM periods WHERE is_live = true ORDER BY id LIMIT 1');
    const livePeriodId = liveRows[0].id;

    const { rows } = await client.query('SELECT COUNT(*)::int AS count FROM properties');
    if (rows[0].count > 0) {
      console.log(`Table already has ${rows[0].count} row(s) — leaving it untouched.`);
      return;
    }

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
      console.log(`✓ Seeded ${SEED_ROWS.length} rows.`);
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    }
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((err) => {
  console.error('Seed failed:', err);
  process.exitCode = 1;
});
