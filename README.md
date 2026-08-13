# Property Basis Record

A single-page site (`index.html`) backed by serverless API functions
(`/api`) and Postgres.

## Data storage

Two Postgres tables:

- `periods` — one row per basis-calculation period ("May 2026", a
  CSV-loaded "June 2026", a Claude-JSON-loaded "Q3 2026", etc.). Exactly one
  row has `is_live = true` — the original, permanent period, seeded from
  `lib/seedData.js` and never deletable.
- `properties` — one row per property, tagged with a `category` of `basis`,
  `not_relevant`, or `not_included` (matching the three tabs in the UI).
  `basis` rows carry a `period_id` tying them to one row in `periods`;
  `not_relevant`/`not_included` rows are global (not period-scoped —
  every period shows the same two lists), so their `period_id` is `NULL`.

See `lib/schema.js` for the column definitions.

The API (`api/properties.js`, `api/properties/[id].js`, `api/periods.js`,
`api/periods/[label].js`) reads the connection string from environment
variables only — `DATABASE_URL` (or `POSTGRES_URL`, as set automatically by
the Vercel Postgres/Neon storage integration). Nothing is hard-coded.

### Self-healing setup

The site does **not** depend on anyone running a migration or seed script
against production. Every data-access call goes through
`lib/ensureSeeded.js`, which:

1. Creates the `periods`/`properties` tables (or adds the `period_id`
   column) if they don't exist yet.
2. Makes sure exactly one `is_live` period exists, creating it if needed.
3. Backfills `period_id` onto any legacy `basis` row that predates the
   `periods` table, pointing it at that live period — so upgrading an
   existing production database (with real data already in it) is just as
   safe as bootstrapping a brand-new one.
4. Only if the `properties` table is completely empty, loads the original
   seed data (`lib/seedData.js`) onto the live period.

Because the seed only ever runs against an empty table, and the backfill
only ever touches rows that don't already have a `period_id`, none of this
can ever overwrite real edits once real data exists — and a fresh deploy
against a brand-new database heals itself on the very first request instead
of looking like all the data disappeared.

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

- `GET    /api/properties` — `{ periods: [{ id, label, asOf, isLive, basis: [...] }], not_relevant: [...], not_included: [...] }`
- `POST   /api/properties` — create a record: `{ category, name, land?, building?, accdep?, address?, extra?, periodId? }`
  (`periodId` is required when `category` is `basis`; ignored for the global categories)
- `PUT    /api/properties/:id` — update one or more fields
- `DELETE /api/properties/:id` — remove a record
- `POST   /api/periods` — create a new period, or replace an existing
  non-live one in place: `{ label, asOf?, properties: [{name, land?, building?, accdep?, address?}] }`
- `DELETE /api/periods/:label` — delete a period and every basis row on it
  (exact label match; the live period can't be deleted this way)

All require a valid session (see below) and respond `401` without one.

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
everyone — for **every** period, not just the live "May 2026" one. Loading
a period via "+ Add period" (CSV) or "Add Period with Claude" (JSON) saves
it to the database the moment it loads, so it's still there the next time
anyone (on any browser) opens the dashboard. Uploading a period whose label
matches one already saved replaces its saved values in place — with a
confirmation prompt first, since it overwrites data other people can see —
rather than creating a duplicate tab. Any non-live period can be removed
again with the × on its tab, which deletes it (and every property on it)
from the database (exact label match only — deleting "June 2026" never
touches a separately-loaded "Jun 2026"); the live period can't be removed
or overwritten this way.

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

### Add Period with Claude

"Add Period with Claude" opens a two-step modal.

**Step 1 — build the prompt.** Pick one or more months, quarters, or years
(individually or as a range); the modal produces a copyable prompt for a
*separate* Claude session — one with Yardi Breeze open and logged in in its
own browser, since this dashboard's own session can't reach it. The prompt:

- Has that session confirm it can actually reach Yardi Breeze before doing
  anything else.
- Bakes in the exact list of properties currently tracked on this dashboard
  (the live period's property names) and asks it to pull Land, Building, and
  Accumulated Depreciation for precisely that list from Yardi Breeze's
  **Balance Sheet** report (not the Trial Balance), as of each selected
  period's last day — matching Yardi's naming loosely (typos, curly
  apostrophes, etc.) but keeping this dashboard's spelling in the output.
- Asks for a single JSON object (shape shown in the modal) covering every
  requested period.

**Step 2 — load the response back in.** Paste that JSON straight into the
text box, or attach it as a `.json` file, and click "Load into dashboard."
Each period in the response is saved to the database and added as its own
new tab; a label that matches a period already saved is replaced in place
(after a confirmation prompt) rather than duplicated.

### Trends tab

One small line chart per property, plotting Land, Building, Accumulated
Depreciation, and Basis across every loaded period (chronological order is a
best-effort guess: it uses `asOf` when a period has one, otherwise it parses
the label itself — "May 2026", "Q3 2026", a bare "2026" — falling back to
load order for anything it can't parse). A property that isn't on a given
period's Balance Sheet shows as a real gap in that period's line, not a
false zero.

Click a card to open the expanded chart: hover any point for a tooltip with
the exact period and all four values, a flag chip per period (the same
✓/◇/B/✕ marks as the Basis Calculation tab), an auto-generated "Notable
changes" callout (flags a ≥10%-and-≥$1,000 swing between any two consecutive
periods, a status change, or a property appearing/disappearing from a
period), and a full data table underneath with every recorded value.

Nothing here is cached — every chart, tooltip, and table cell is computed
fresh from the live `periods` state each time it renders, straight from the
same data the Basis Calculation tab reads and writes. Edit a value there (or
add/remove a property or period) and the Trends tab reflects it the next
time you view it, with no separate sync step.
