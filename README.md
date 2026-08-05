# Property Basis Record

A single-page site (`index.html`) backed by serverless API functions
(`/api`) and Postgres.

## Data storage

Property records live in a Postgres `properties` table (one row per
property, tagged with a `category` of `basis`, `not_relevant`, or
`not_included` — matching the three tabs in the UI). See `lib/schema.js`
for the column definitions.

The API (`api/properties.js`, `api/properties/[id].js`) reads the
connection string from environment variables only — `DATABASE_URL` (or
`POSTGRES_URL`, as set automatically by the Vercel Postgres/Neon storage
integration). Nothing is hard-coded.

### Self-healing setup

The site does **not** depend on anyone running a migration or seed script
against production. Every data-access call goes through
`lib/ensureSeeded.js`, which:

1. Creates the `properties` table if it doesn't exist yet.
2. Only if the table is completely empty, loads the original seed data
   (`lib/seedData.js`, extracted from the site's original hard-coded
   records).

Because the seed only ever runs against an empty table, it can never
overwrite real edits once real data exists — and a fresh deploy against a
brand-new database heals itself on the very first request instead of
looking like all the data disappeared.

### Manual/local scripts

For local development or provisioning a database ahead of time by hand:

```bash
cp .env.example .env   # fill in DATABASE_URL for your local Postgres
npm install
npm run migrate        # create the table (idempotent)
npm run seed           # seed it, but only if it's empty
```

These are optional — the live site never requires them to have been run.

## API

- `GET    /api/properties` — `{ basis: [...], not_relevant: [...], not_included: [...] }`
- `POST   /api/properties` — create a record: `{ category, name, land?, building?, accdep?, address?, extra? }`
- `PUT    /api/properties/:id` — update one or more fields
- `DELETE /api/properties/:id` — remove a record

## Front end

`index.html` fetches from the API on load and writes every add/edit/delete
back through it, so changes persist across reloads and are visible to
everyone. The "+ Add period" / CSV-import / snapshot-export/import features
remain session-only comparison tools, same as before — only the primary
"May 2026" period is backed by the database.
