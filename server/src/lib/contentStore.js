import { query } from '../db/pg-connection.js';
import { mergeContent } from '../../../shared/content/index.js';

/** Current value of one content part (saved edits merged over the defaults). */
export async function readContentPart(part) {
  const { rows } = await query(`SELECT value FROM site_settings WHERE key = $1`, [`content.${part}`]);
  return mergeContent({ [part]: rows[0]?.value })[part];
}

export async function writeContentPart(part, value) {
  await query(
    `INSERT INTO site_settings (key, value, updated_at) VALUES ($1, $2::jsonb, CURRENT_TIMESTAMP)
     ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = CURRENT_TIMESTAMP`,
    [`content.${part}`, JSON.stringify(value)]
  );
}
