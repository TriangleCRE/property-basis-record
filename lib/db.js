// Shared Postgres connection pool.
//
// Reads the connection string ONLY from environment variables — never
// hard-code credentials here. Works with whatever the Vercel Postgres/Neon
// storage integration sets (DATABASE_URL, POSTGRES_URL, etc.) as well as a
// plain local Postgres URL for local development/testing.

const { Pool } = require('pg');

let pool = null;

function getConnectionString() {
  const connectionString =
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.POSTGRES_PRISMA_URL ||
    process.env.POSTGRES_URL_NON_POOLING;

  if (!connectionString) {
    throw new Error(
      'No database connection string found. Set DATABASE_URL (or POSTGRES_URL) in the environment.'
    );
  }
  return connectionString;
}

function getPool() {
  if (!pool) {
    const connectionString = getConnectionString();
    // Local Postgres (used for testing) typically has no SSL listener;
    // Neon/hosted Postgres requires SSL. Detect and configure accordingly.
    const isLocal = /(^|@)(localhost|127\.0\.0\.1)/.test(connectionString);
    pool = new Pool({
      connectionString,
      ssl: isLocal ? false : { rejectUnauthorized: false },
      max: 5,
    });
  }
  return pool;
}

module.exports = { getPool };
