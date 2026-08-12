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

All four require a valid session (see below) and respond `401` without one.

## Passcode gate

The site sits behind a single shared passcode, read from the `PASSCODE`
environment variable:

- `POST /api/login` — body `{ passcode }`. On a match it sets an `HttpOnly`
  session cookie (`pbr_session`) and responds `{ ok: true }`; on a mismatch
  it responds `401` with a generic error. The passcode is only ever compared
  server-side (`lib/auth.js`, timing-safe comparison) — it's never sent to
  or embedded in the front end.
- `POST /api/logout` — clears the session cookie.
- The session cookie is a signed, expiring token (7 days) — not a random ID
  stored server-side — so it needs no database table. Its signing key is
  derived from `PASSCODE` itself, so rotating the passcode instantly
  invalidates every outstanding session.
- `index.html` shows a passcode entry screen and only loads the dashboard
  after `GET /api/properties` succeeds; a `401` sends it back to the
  passcode screen instead.

## Front end

`index.html` fetches from the API on load and writes every add/edit/delete
back through it, so changes persist across reloads and are visible to
everyone. The "+ Add period" / CSV-import / snapshot-import features
remain session-only comparison tools, same as before — only the primary
"May 2026" period is backed by the database.

### Excel snapshot export

"Export snapshot" downloads a formatted `.xlsx` workbook (built client-side
with [ExcelJS](https://github.com/exceljs/exceljs), loaded from a CDN) that
mirrors the whole dashboard:

- **Overview** — generated timestamp, as-of period, and the same stats shown
  in the stat strip (properties recorded, total basis, land-only/building-only
  counts, flagged-for-review count, not relevant/not included counts).
- **One "Basis" sheet per period** — every property with land, building,
  accumulated depreciation, a live `=SUM(...)` basis formula, status, and
  notes, with a totals row, autofilter, and a frozen header.
- **Not Relevant** and **Not Included** — the same lists shown in those tabs.
- **Compare Periods** — included whenever more than one period is loaded,
  matching the Compare Periods tab.

This is separate from "Import snapshot", which still reads back the JSON
format used for session-only comparison periods.

### Generate Yardi Pull Prompt

"Generate Yardi Pull Prompt" opens a modal for picking one or more months,
quarters, or years (individually or as a range) and produces a copyable
prompt for a *separate* Claude session — one with Yardi Breeze open and
logged in in its own browser, since this dashboard's own Claude session
can't reach it. The prompt asks that session to:

- Pull each selected period from Yardi Breeze's **Balance Sheet** report
  (not the Trial Balance), as of that period's last day.
- Record Land, Building, and Accumulated Depreciation per property, plus
  address where available, and separately flag properties with none of
  those three accounts as "not relevant."
- Reply with a single JSON object (shape shown in the modal) covering every
  requested period, so it can be pasted back into the dashboard's Claude
  session to load in.
