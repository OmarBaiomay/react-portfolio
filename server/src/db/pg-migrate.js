import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { getPool, isPostgres } from './pg-connection.js';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MIGRATIONS_DIR = path.join(__dirname, 'migrations');

function listSqlFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith('.sql'))
    .sort();
}

async function ensureMigrationsTable(client) {
  await client.query(`
    CREATE TABLE IF NOT EXISTS _migrations (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

async function getAppliedMigrations(client) {
  await ensureMigrationsTable(client);
  const result = await client.query('SELECT name FROM _migrations ORDER BY id');
  return new Set(result.rows.map((row) => row.name));
}

export async function runMigrations() {
  if (!isPostgres()) {
    throw new Error('DATABASE_URL is required');
  }

  const pool = getPool();
  const client = await pool.connect();

  try {
    await client.query('SELECT 1');
    console.log('[pg-migrate] PostgreSQL connection ready');

    const applied = await getAppliedMigrations(client);
    const files = listSqlFiles(MIGRATIONS_DIR);

    for (const file of files) {
      const name = path.basename(file, '.sql');
      if (applied.has(name)) continue;

      const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, file), 'utf8');

      await client.query('BEGIN');
      try {
        await client.query(sql);
        await client.query('INSERT INTO _migrations (name) VALUES ($1)', [name]);
        await client.query('COMMIT');
        console.log(`[pg-migrate] Applied: ${name}`);
      } catch (err) {
        await client.query('ROLLBACK');
        throw err;
      }
    }

    console.log('[pg-migrate] Migrations complete');
  } finally {
    client.release();
  }
}

const isDirectRun = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isDirectRun) {
  runMigrations()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('[pg-migrate] Failed:', err);
      process.exit(1);
    });
}
