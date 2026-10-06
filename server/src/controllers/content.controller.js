import { query } from '../db/pg-connection.js';
import {
  CONTENT_PARTS,
  DEFAULT_CONTENT,
  mergeContent,
} from '../../../shared/content/index.js';

const KEY_PREFIX = 'content.';

/** Parts stored as arrays; everything else is an object. */
const ARRAY_PARTS = new Set(
  CONTENT_PARTS.filter((part) => Array.isArray(DEFAULT_CONTENT[part]))
);

async function readStoredContent() {
  const result = await query(
    `SELECT key, value, updated_at FROM site_settings WHERE key LIKE $1`,
    [`${KEY_PREFIX}%`]
  );
  const stored = {};
  let updatedAt = null;
  for (const row of result.rows) {
    const part = row.key.slice(KEY_PREFIX.length);
    if (!CONTENT_PARTS.includes(part)) continue;
    stored[part] = row.value;
    if (!updatedAt || row.updated_at > updatedAt) updatedAt = row.updated_at;
  }
  return { stored, updatedAt };
}

function validPart(part, value) {
  if (!CONTENT_PARTS.includes(part)) return 'Unknown content part';
  if (ARRAY_PARTS.has(part) ? !Array.isArray(value) : (value === null || typeof value !== 'object' || Array.isArray(value))) {
    return `${part} must be ${ARRAY_PARTS.has(part) ? 'an array' : 'an object'}`;
  }
  return null;
}

/** Public: full website content (defaults with saved edits merged on top). */
export async function getContent(req, res) {
  try {
    const { stored, updatedAt } = await readStoredContent();
    res.set('Cache-Control', 'no-cache');
    res.json({ ...mergeContent(stored), updatedAt });
  } catch (error) {
    console.error('getContent:', error.message);
    res.status(500).json({ message: 'Failed to load content' });
  }
}

/** Admin: built-in defaults, plus which parts have saved edits. */
export async function getContentDefaults(req, res) {
  try {
    const { stored } = await readStoredContent();
    res.json({ defaults: DEFAULT_CONTENT, edited: Object.keys(stored) });
  } catch (error) {
    console.error('getContentDefaults:', error.message);
    res.status(500).json({ message: 'Failed to load defaults' });
  }
}

export async function updateContentPart(req, res) {
  try {
    const { part } = req.params;
    const value = req.body?.value;
    const invalid = validPart(part, value);
    if (invalid) return res.status(400).json({ message: invalid });

    await query(
      `INSERT INTO site_settings (key, value, updated_at)
       VALUES ($1, $2::jsonb, CURRENT_TIMESTAMP)
       ON CONFLICT (key)
       DO UPDATE SET value = EXCLUDED.value, updated_at = CURRENT_TIMESTAMP`,
      [`${KEY_PREFIX}${part}`, JSON.stringify(value)]
    );
    const { stored, updatedAt } = await readStoredContent();
    res.json({ message: 'Saved', part, value: mergeContent(stored)[part], updatedAt });
  } catch (error) {
    console.error('updateContentPart:', error.message);
    res.status(500).json({ message: 'Failed to save content' });
  }
}

/** Admin: drop saved edits for a part so the built-in default shows again. */
export async function resetContentPart(req, res) {
  try {
    const { part } = req.params;
    if (!CONTENT_PARTS.includes(part)) return res.status(400).json({ message: 'Unknown content part' });
    await query(`DELETE FROM site_settings WHERE key = $1`, [`${KEY_PREFIX}${part}`]);
    res.json({ message: 'Reset', part, value: DEFAULT_CONTENT[part] });
  } catch (error) {
    console.error('resetContentPart:', error.message);
    res.status(500).json({ message: 'Failed to reset content' });
  }
}
