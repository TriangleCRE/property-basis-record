// Data-access layer for property records. Every exported function calls
// ensureReady() first, so the table-exists/seed-if-empty check happens
// automatically before any real query runs — callers never have to think
// about it.

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
  };
}

async function listAll() {
  await ensureReady();
  const pool = getPool();
  const { rows } = await pool.query(
    'SELECT * FROM properties ORDER BY category, sort_order, id'
  );
  const grouped = { basis: [], not_relevant: [], not_included: [] };
  for (const r of rows) {
    const row = toRow(r);
    if (grouped[row.category]) grouped[row.category].push(row);
  }
  return grouped;
}

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
  const { rows } = await pool.query(
    `INSERT INTO properties (category, name, land, building, accdep, address, extra, sort_order)
     VALUES (
       $1, $2, $3, $4, $5, $6, $7,
       COALESCE((SELECT MAX(sort_order) + 1 FROM properties WHERE category = $1), 0)
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

function numOrNull(v) {
  if (v === undefined || v === null || v === '') return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

module.exports = { CATEGORIES, listAll, create, update, remove };
