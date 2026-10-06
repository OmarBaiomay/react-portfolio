import { query } from '../db/pg-connection.js';

/** Store an image in the media table and return its public URL. */
export async function saveMedia(buffer, mime, filename = '') {
  const result = await query(
    `INSERT INTO media (filename, mime, size, data) VALUES ($1, $2, $3, $4) RETURNING id`,
    [filename.slice(0, 200), mime, buffer.length, buffer]
  );
  return `/api/media/${result.rows[0].id}`;
}
