import pg from 'pg';

const { Pool } = pg;

let pool = null;

export function isPostgres() {
  return Boolean(process.env.DATABASE_URL);
}

export function getPool() {
  if (!isPostgres()) {
    throw new Error('DATABASE_URL is not configured');
  }

  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: parseInt(process.env.PG_POOL_MAX || '20', 10),
    });

    pool.on('error', (err) => {
      console.error('[pg] Unexpected pool error:', err);
    });
  }

  return pool;
}

export async function query(text, params) {
  return getPool().query(text, params);
}

export async function closePool() {
  if (pool) {
    await pool.end();
    pool = null;
  }
}
