import { query } from '../../db/pg-connection.js';

const mapJob = (row) =>
  row && {
    id: row.id,
    type: row.type,
    status: row.status,
    progress: row.progress,
    input: row.input,
    result: row.result,
    error: row.error,
    provider: row.provider,
    model: row.model,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };

/** Mark jobs that were running when the server stopped as failed. Call once at startup. */
export async function failInterruptedJobs() {
  await query(
    `UPDATE ai_jobs SET status = 'failed', error = 'Interrupted by a server restart', updated_at = CURRENT_TIMESTAMP
     WHERE status = 'running'`
  );
}

/**
 * Create a job row and run `work(progress)` in the background.
 * `work` returns the result object; thrown errors mark the job failed.
 */
export async function startJob({ type, input, provider, model, userId }, work) {
  const { rows } = await query(
    `INSERT INTO ai_jobs (type, input, provider, model, created_by, progress)
     VALUES ($1, $2, $3, $4, $5, 'Starting…') RETURNING *`,
    [type, input, provider, model, userId || null]
  );
  const job = mapJob(rows[0]);

  const progress = (text) =>
    query(`UPDATE ai_jobs SET progress = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $1`, [job.id, text]).catch(
      () => {}
    );

  // Not awaited: the HTTP request returns the job id immediately.
  (async () => {
    try {
      const result = await work(progress);
      await query(
        `UPDATE ai_jobs SET status = 'done', progress = 'Done', result = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $1`,
        [job.id, result]
      );
    } catch (error) {
      console.error(`ai job ${job.id} (${type}) failed:`, error.message);
      await query(
        `UPDATE ai_jobs SET status = 'failed', error = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $1`,
        [job.id, String(error.message || error).slice(0, 1000)]
      ).catch(() => {});
    }
  })();

  return job;
}

export async function getJob(id) {
  const { rows } = await query(`SELECT * FROM ai_jobs WHERE id = $1`, [id]);
  return mapJob(rows[0]);
}

export async function listJobs(limit = 20) {
  const { rows } = await query(`SELECT * FROM ai_jobs ORDER BY created_at DESC LIMIT $1`, [limit]);
  return rows.map(mapJob);
}
