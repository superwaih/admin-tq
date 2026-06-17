import { Pool, PoolClient } from 'pg';

declare global {
  // eslint-disable-next-line no-var
  var __admitiqPool: Pool | undefined;
  // eslint-disable-next-line no-var
  var __admitiqTablesReady: Promise<void> | undefined;
}

function getPool(): Pool {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set');
  }
  if (!global.__admitiqPool) {
    global.__admitiqPool = new Pool({ connectionString: process.env.DATABASE_URL });
  }
  return global.__admitiqPool;
}

async function ensureTables(): Promise<void> {
  const pool = getPool();
  await pool.query(`
    CREATE TABLE IF NOT EXISTS student_assessments_responses (
      user_id TEXT PRIMARY KEY,
      responses JSONB NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
    CREATE TABLE IF NOT EXISTS student_assessments_results (
      user_id TEXT PRIMARY KEY,
      results JSONB NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
    CREATE TABLE IF NOT EXISTS student_assessment_profiles (
      user_id TEXT PRIMARY KEY,
      assessment_completed BOOLEAN NOT NULL DEFAULT false,
      assessment_completed_at TIMESTAMPTZ
    );
  `);
}

async function ready(): Promise<void> {
  if (!global.__admitiqTablesReady) {
    global.__admitiqTablesReady = ensureTables();
  }
  await global.__admitiqTablesReady;
}

export async function query<T = any>(text: string, params?: any[]): Promise<{ rows: T[] }> {
  await ready();
  const res = await getPool().query(text, params);
  return { rows: res.rows as T[] };
}

/** Run a set of writes inside a single transaction (BEGIN/COMMIT/ROLLBACK). */
export async function withTransaction<T>(fn: (client: PoolClient) => Promise<T>): Promise<T> {
  await ready();
  const client = await getPool().connect();
  try {
    await client.query('BEGIN');
    const out = await fn(client);
    await client.query('COMMIT');
    return out;
  } catch (err) {
    try { await client.query('ROLLBACK'); } catch { /* ignore rollback error */ }
    throw err;
  } finally {
    client.release();
  }
}
