// Data-access layer for property records. Every exported function calls
// ensureReady() first, so the table-exists/seed-if-empty/live-period/backfill
// checks happen automatically before any real query runs — callers never
// have to think about it.

const { getPool } = require('./db');
const { ensureReady } = require('./ensureSeeded');

const CATEGORIES = ['basis', 'not_relevant', 'not_included'];

function toRow(r) {
  return {
    id: r.id,
    category: r.category,
    name: r.name,
    land: r.land !== null ? Number(r.land) : null,
    building: r.building !== null ? Number(r.building) : null,
    accdep: r.accdep !== null ? Number(r.accdep) : null,
    address: r.address,
    extra: r.extra,
    sort_order: r.sort_order,
    period_id: r.period_id !== undefined ? r.period_id : undefined,
  };
}

function numOrNull(v) {
  if (v === undefined || v === null || v === '') return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

// Returns every period (in display order) with its 'basis' rows attached,
// plus the global 'not_relevant' / 'not_included' lists (those aren't
// period-scoped — every period shows the same two lists).
async function listAll() {
  await ensureReady();
  const pool = getPool();
  const { rows: periodRows } = await pool.query(
    'SELECT id, label, as_of, is_live FROM periods ORDER BY sort_order, id'
  );
  const { rows: basisRows } = await pool.query(
    `SELECT * FROM properties WHERE category = 'basis' ORDER BY period_id, sort_order, id`
  );
  const basisByPeriod = new Map();
  for (const r of basisRows) {
    const list = basisByPeriod.get(r.period_id) || [];
    list.push(toRow(r));
    basisByPeriod.set(r.period_id, list);
  }
  const periods = periodRows.map((p) => ({
    id: p.id,
    label: p.label,
    asOf: p.as_of,
    isLive: p.is_live,
    basis: basisByPeriod.get(p.id) || [],
  }));

  const { rows: globalRows } = await pool.query(
    `SELECT * FROM properties WHERE category IN ('not_relevant', 'not_included') ORDER BY category, sort_order, id`
  );
  const not_relevant = [];
  const not_included = [];
  for (const r of globalRows) {
    const row = toRow(r);
    (row.category === 'not_relevant' ? not_relevant : not_included).push(row);
  }

  return { periods, not_relevant, not_included };
}

// Adds one property. 'basis' rows must specify which period they belong to
// (input.periodId); 'not_relevant'/'not_included' rows are global and ignore
// it.
async function create(input) {
  await ensureReady();
  const { category, name } = input;
  if (!CATEGORIES.includes(category)) {
    throw Object.assign(new Error(`category must be one of: ${CATEGORIES.join(', ')}`), { status: 400 });
  }
  if (!name || !String(name).trim()) {
    throw Object.assign(new Error('name is required'), { status: 400 });
  }
  const pool = getPool();

  let periodId = null;
  if (category === 'basis') {
    periodId = Number(input.periodId);
    if (!Number.isInteger(periodId)) {
      throw Object.assign(new Error('periodId is required for basis properties'), { status: 400 });
    }
    const { rows } = await pool.query('SELECT id FROM periods WHERE id = $1', [periodId]);
    if (!rows.length) {
      throw Object.assign(new Error('period not found'), { status: 404 });
    }
  }

  const { rows } = await pool.query(
    `INSERT INTO properties (category, name, land, building, accdep, address, extra, sort_order, period_id)
     VALUES (
       $1, $2, $3, $4, $5, $6, $7,
       COALESCE((SELECT MAX(sort_order) + 1 FROM properties WHERE category = $1 AND period_id IS NOT DISTINCT FROM $8), 0),
       $8
     )
     RETURNING *`,
    [
      category,
      String(name).trim(),
      numOrNull(input.land),
      numOrNull(input.building),
      numOrNull(input.accdep),
      input.address ?? null,
      input.extra ?? null,
      periodId,
    ]
  );
  return toRow(rows[0]);
}

const UPDATABLE_FIELDS = ['name', 'land', 'building', 'accdep', 'address', 'extra'];

async function update(id, fields) {
  await ensureReady();
  const sets = [];
  const values = [];
  let i = 1;
  for (const key of UPDATABLE_FIELDS) {
    if (!Object.prototype.hasOwnProperty.call(fields, key)) continue;
    let val = fields[key];
    if (key === 'land' || key === 'building' || key === 'accdep') val = numOrNull(val);
    if (key === 'name') {
      if (!val || !String(val).trim()) {
        throw Object.assign(new Error('name cannot be empty'), { status: 400 });
      }
      val = String(val).trim();
    }
    sets.push(`${key} = $${i++}`);
    values.push(val);
  }
  if (sets.length === 0) {
    throw Object.assign(new Error('no updatable fields provided'), { status: 400 });
  }
  sets.push('updated_at = now()');
  values.push(id);
  const pool = getPool();
  const { rows } = await pool.query(
    `UPDATE properties SET ${sets.join(', ')} WHERE id = $${i} RETURNING *`,
    values
  );
  if (rows.length === 0) {
    throw Object.assign(new Error('property not found'), { status: 404 });
  }
  return toRow(rows[0]);
}

async function remove(id) {
  await ensureReady();
  const pool = getPool();
  const { rows } = await pool.query('DELETE FROM properties WHERE id = $1 RETURNING *', [id]);
  if (rows.length === 0) {
    throw Object.assign(new Error('property not found'), { status: 404 });
  }
  return toRow(rows[0]);
}

// Creates a new period with its basis rows, or — if a period with this
// label already exists and isn't the live period — replaces that period's
// basis rows in place (same period id, same tab position) rather than
// creating a duplicate. Used by both the "+ Add period" CSV upload and the
// "Add Period with Claude" JSON load.
async function createOrReplacePeriod({ label, asOf, properties }) {
  await ensureReady();
  const cleanLabel = label && String(label).trim();
  if (!cleanLabel) {
    throw Object.assign(new Error('label is required'), { status: 400 });
  }
  if (!Array.isArray(properties) || properties.length === 0) {
    throw Object.assign(new Error('properties must be a non-empty array'), { status: 400 });
  }

  const pool = getPool();
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Address stickiness: if an incoming property's address is null/missing,
    // fall back to whatever non-null address that same property already has
    // elsewhere on the dashboard, rather than overwriting a known address
    // with null. Captured up front, before this period's own rows are
    // touched, so overwriting a period with address-less data doesn't wipe
    // out an address it already had (live period preferred, then most
    // recently added).
    const { rows: addressRows } = await client.query(
      `SELECT p.name, p.address
       FROM properties p
       JOIN periods per ON per.id = p.period_id
       WHERE p.category = 'basis' AND p.address IS NOT NULL AND p.address <> ''
       ORDER BY per.is_live DESC, p.id DESC`
    );
    const knownAddress = new Map();
    for (const r of addressRows) {
      if (!knownAddress.has(r.name)) knownAddress.set(r.name, r.address);
    }

    const existing = await client.query('SELECT id, is_live FROM periods WHERE label = $1', [cleanLabel]);
    let periodId;
    let replaced = false;
    if (existing.rows.length) {
      const row = existing.rows[0];
      if (row.is_live) {
        throw Object.assign(new Error(`"${cleanLabel}" is the live period and can't be overwritten this way.`), { status: 400 });
      }
      periodId = row.id;
      replaced = true;
      await client.query('UPDATE periods SET as_of = $2 WHERE id = $1', [periodId, asOf || null]);
      await client.query(`DELETE FROM properties WHERE period_id = $1 AND category = 'basis'`, [periodId]);
    } else {
      const { rows } = await client.query(
        `INSERT INTO periods (label, as_of, is_live, sort_order)
         VALUES ($1, $2, false, COALESCE((SELECT MAX(sort_order) + 1 FROM periods), 0))
         RETURNING id`,
        [cleanLabel, asOf || null]
      );
      periodId = rows[0].id;
    }

    const basis = [];
    let sortOrder = 0;
    for (const p of properties) {
      if (!p || !p.name || !String(p.name).trim()) continue;
      const name = String(p.name).trim();
      const hasAddress = typeof p.address === 'string' && p.address.trim() !== '';
      const address = hasAddress ? p.address : (knownAddress.get(name) || null);
      const { rows } = await client.query(
        `INSERT INTO properties (category, name, land, building, accdep, address, sort_order, period_id)
         VALUES ('basis', $1, $2, $3, $4, $5, $6, $7)
         RETURNING *`,
        [name, numOrNull(p.land), numOrNull(p.building), numOrNull(p.accdep), address, sortOrder++, periodId]
      );
      basis.push(toRow(rows[0]));
    }
    if (basis.length === 0) {
      throw Object.assign(new Error('no named properties were provided'), { status: 400 });
    }

    await client.query('COMMIT');
    return { id: periodId, label: cleanLabel, asOf: asOf || null, isLive: false, basis, replaced };
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

// Deletes a period and every basis row attached to it (ON DELETE CASCADE).
// The live period can never be deleted this way. Exact label match only.
async function deletePeriod(label) {
  await ensureReady();
  const pool = getPool();
  const { rows } = await pool.query('SELECT id, is_live FROM periods WHERE label = $1', [label]);
  if (!rows.length) {
    throw Object.assign(new Error('period not found'), { status: 404 });
  }
  if (rows[0].is_live) {
    throw Object.assign(new Error(`"${label}" is the live period and can't be deleted.`), { status: 400 });
  }
  await pool.query('DELETE FROM periods WHERE id = $1', [rows[0].id]);
  return { ok: true };
}

module.exports = { CATEGORIES, listAll, create, update, remove, createOrReplacePeriod, deletePeriod };
