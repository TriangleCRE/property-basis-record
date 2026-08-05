// Table definition for property records.
//
// The data here is uniform and clearly relational (a small, known set of
// optional numeric/text fields shared across three categories), so this uses
// normal typed columns rather than a JSONB blob.

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

const CREATE_INDEX_SQL = `
  CREATE INDEX IF NOT EXISTS properties_category_sort_idx
    ON properties (category, sort_order);
`;

async function createTableIfMissing(client) {
  await client.query(CREATE_TABLE_SQL);
  await client.query(CREATE_INDEX_SQL);
}

module.exports = { CREATE_TABLE_SQL, CREATE_INDEX_SQL, createTableIfMissing };
