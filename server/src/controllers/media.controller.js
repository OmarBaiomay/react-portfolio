import { query } from '../db/pg-connection.js';

// SVG is excluded on purpose: it can carry scripts and is served from our own origin.
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']);
export const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Admin: upload one image as the raw request body (Content-Type = image type). */
export async function uploadMedia(req, res) {
  try {
    const mime = (req.headers['content-type'] || '').split(';')[0].trim().toLowerCase();
    if (!ALLOWED_TYPES.has(mime)) {
      return res.status(415).json({ message: 'Only JPG, PNG, WebP, GIF or AVIF images are allowed' });
    }
    if (!Buffer.isBuffer(req.body) || req.body.length === 0) {
      return res.status(400).json({ message: 'Empty upload' });
    }
    let filename = String(req.headers['x-filename'] || '').slice(0, 300);
    try {
      filename = decodeURIComponent(filename);
    } catch {
      // keep the raw header value
    }
    const result = await query(
      `INSERT INTO media (filename, mime, size, data) VALUES ($1, $2, $3, $4)
       RETURNING id, filename, mime, size`,
      [filename.slice(0, 200), mime, req.body.length, req.body]
    );
    const row = result.rows[0];
    res.status(201).json({ ...row, url: `/api/media/${row.id}` });
  } catch (error) {
    console.error('uploadMedia:', error.message);
    res.status(500).json({ message: 'Upload failed' });
  }
}

/** Public: serve an uploaded image. An id never changes content, so cache it forever. */
export async function getMedia(req, res) {
  try {
    if (!UUID_RE.test(req.params.id)) return res.status(404).end();
    const result = await query(`SELECT mime, data FROM media WHERE id = $1`, [req.params.id]);
    const row = result.rows[0];
    if (!row) return res.status(404).end();
    res.set({
      'Content-Type': row.mime,
      'Cache-Control': 'public, max-age=31536000, immutable',
      'X-Content-Type-Options': 'nosniff',
    });
    res.send(row.data);
  } catch (error) {
    console.error('getMedia:', error.message);
    res.status(500).end();
  }
}

export async function listMedia(req, res) {
  try {
    const result = await query(
      `SELECT id, filename, mime, size, created_at FROM media ORDER BY created_at DESC LIMIT 200`
    );
    res.json(result.rows.map((r) => ({ ...r, url: `/api/media/${r.id}` })));
  } catch (error) {
    console.error('listMedia:', error.message);
    res.status(500).json({ message: 'Failed to list media' });
  }
}

export async function deleteMedia(req, res) {
  try {
    if (!UUID_RE.test(req.params.id)) return res.status(404).json({ message: 'Not found' });
    await query(`DELETE FROM media WHERE id = $1`, [req.params.id]);
    res.json({ message: 'Deleted' });
  } catch (error) {
    console.error('deleteMedia:', error.message);
    res.status(500).json({ message: 'Failed to delete' });
  }
}
