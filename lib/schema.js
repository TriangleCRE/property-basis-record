// Table definitions for property records.
//
// Two tables:
//   - `periods` — one row per basis-calculation period ("May 2026", a
//     CSV-loaded "June 2026", a Claude-JSON-loaded "Q3 2026", etc.). Exactly
//     one row has is_live = true — that's the original, permanent period;
//     every other period is deletable/overwritable by label.
//   - `properties` — unchanged in spirit, but 'basis' category rows now carry
//     a period_id tying them to one row in `periods`. 'not_relevant' and
//     'not_included' rows are global (not period-scoped), so period_id stays
//     NULL for them — those tabs show the same list no matter which period
//     is selected, same as before.
//
// Both statements are additive (CREATE TABLE IF NOT EXISTS / ADD COLUMN IF
// NOT EXISTS), so running this against the existing production database is
// safe — it never touches already-stored rows. The one-time backfill that
// gives legacy 'basis' rows a period_id lives in ensureSeeded.js, guarded by
// the same advisory lock used for seeding.

const CREATE_PERIODS_TABLE_SQL = `
  CREATE TABLE IF NOT EXISTS periods (
    id SERIAL PRIMARY KEY,
    label TEXT NOT NULL UNIQUE,
    as_of DATE,
    is_live BOOLEAN NOT NULL DEFAULT false,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  );
`;

const CREATE_TABLE_SQL = `
  CREATE TABLE IF NOT EXISTS properties (
    id SERIAL PRIMARY KEY,
    category TEXT NOT NULL CHECK (category IN ('basis', 'not_relevant', 'not_included')),
    name TEXT NOT NULL,
    land NUMERIC,
    building NUMERIC,
    accdep NUMERIC,
    address TEXT,
    extra TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
  );
`;

const ADD_PERIOD_ID_COLUMN_SQL = `
  ALTER TABLE properties
    ADD COLUMN IF NOT EXISTS period_id INTEGER REFERENCES periods (id) ON DELETE CASCADE;
`;

const CREATE_INDEX_SQL = `
  CREATE INDEX IF NOT EXISTS properties_category_sort_idx
    ON properties (category, sort_order);
`;

const CREATE_PERIOD_INDEX_SQL = `
  CREATE INDEX IF NOT EXISTS properties_period_idx
    ON properties (period_id);
`;

async function createTableIfMissing(client) {
  // periods must exist before the FK in ADD_PERIOD_ID_COLUMN_SQL can be added.
  await client.query(CREATE_PERIODS_TABLE_SQL);
  await client.query(CREATE_TABLE_SQL);
  await client.query(ADD_PERIOD_ID_COLUMN_SQL);
  await client.query(CREATE_INDEX_SQL);
  await client.query(CREATE_PERIOD_INDEX_SQL);
}

module.exports = {
  CREATE_PERIODS_TABLE_SQL,
  CREATE_TABLE_SQL,
  ADD_PERIOD_ID_COLUMN_SQL,
  CREATE_INDEX_SQL,
  CREATE_PERIOD_INDEX_SQL,
  createTableIfMissing,
};
