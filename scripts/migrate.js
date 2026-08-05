#!/usr/bin/env node
// Standalone migration script for manual/local use.
//
// The live site does NOT depend on this being run — api/ code creates the
// table itself on first use (see lib/ensureSeeded.js). This script exists
// for local development and for anyone who wants to provision the schema
// by hand ahead of time.
//
// Usage:
//   DATABASE_URL=postgres://... node scripts/migrate.js

const { getPool } = require('../lib/db');
const { createTableIfMissing } = require('../lib/schema');

async function main() {
  const pool = getPool();
  const client = await pool.connect();
  try {
    await createTableIfMissing(client);
    console.log('✓ properties table is present (created if it was missing).');
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((err) => {
  console.error('Migration failed:', err);
  process.exitCode = 1;
});
