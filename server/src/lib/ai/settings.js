import crypto from 'crypto';
import { query } from '../../db/pg-connection.js';
import { PROVIDERS } from './providers.js';

const KEY = 'ai';
const EFFORTS = ['low', 'medium', 'high', 'xhigh', 'max'];

// API keys are encrypted at rest with a key derived from JWT_SECRET.
const secretKey = () =>
  crypto.createHash('sha256').update(`${process.env.JWT_SECRET || ''}:ai-keys`).digest();

function encrypt(plain) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', secretKey(), iv);
  const data = Buffer.concat([cipher.update(String(plain), 'utf8'), cipher.final()]);
  return `v1:${iv.toString('base64')}:${cipher.getAuthTag().toString('base64')}:${data.toString('base64')}`;
}

function decrypt(blob) {
  try {
    const [, iv, tag, data] = String(blob).split(':');
    const decipher = crypto.createDecipheriv('aes-256-gcm', secretKey(), Buffer.from(iv, 'base64'));
    decipher.setAuthTag(Buffer.from(tag, 'base64'));
    return Buffer.concat([decipher.update(Buffer.from(data, 'base64')), decipher.final()]).toString('utf8');
  } catch {
    return ''; // JWT_SECRET changed — the key must be entered again
  }
}

const mask = (key) => (key ? `${key.slice(0, 4)}…${key.slice(-4)}` : '');

async function readRaw() {
  const result = await query(`SELECT value FROM site_settings WHERE key = $1`, [KEY]);
  return result.rows[0]?.value || {};
}

/** Settings with decrypted keys — server-side use only. */
export async function getAISettings() {
  const raw = await readRaw();
  const providers = {};
  for (const [id, meta] of Object.entries(PROVIDERS)) {
    const saved = raw.providers?.[id] || {};
    const storedKey = saved.apiKey ? decrypt(saved.apiKey) : '';
    providers[id] = {
      apiKey: storedKey || process.env[meta.envKey] || '',
      keySource: storedKey ? 'dashboard' : process.env[meta.envKey] ? 'env' : '',
      model: saved.model || meta.defaultModel,
      baseURL: saved.baseURL || (id === 'compatible' ? process.env.AI_COMPATIBLE_BASE_URL || '' : ''),
    };
  }
  return {
    defaultProvider: PROVIDERS[raw.defaultProvider] ? raw.defaultProvider : 'anthropic',
    effort: EFFORTS.includes(raw.effort) ? raw.effort : 'medium',
    providers,
  };
}

/** Settings safe to send to the dashboard: keys masked. */
export async function getPublicAISettings() {
  const s = await getAISettings();
  return {
    defaultProvider: s.defaultProvider,
    effort: s.effort,
    efforts: EFFORTS,
    providers: Object.fromEntries(
      Object.entries(s.providers).map(([id, p]) => [
        id,
        {
          label: PROVIDERS[id].label,
          model: p.model,
          defaultModel: PROVIDERS[id].defaultModel,
          baseURL: p.baseURL,
          hasKey: Boolean(p.apiKey),
          keySource: p.keySource,
          keyPreview: mask(p.apiKey),
        },
      ])
    ),
  };
}

/**
 * Update settings. For each provider, `apiKey` is only changed when a non-empty
 * string is sent; send `clearKey: true` to remove a stored key.
 */
export async function saveAISettings(input = {}) {
  const raw = await readRaw();
  const next = {
    defaultProvider: PROVIDERS[input.defaultProvider] ? input.defaultProvider : raw.defaultProvider || 'anthropic',
    effort: EFFORTS.includes(input.effort) ? input.effort : raw.effort || 'medium',
    providers: { ...(raw.providers || {}) },
  };
  for (const id of Object.keys(PROVIDERS)) {
    const patch = input.providers?.[id];
    if (!patch) continue;
    const current = { ...(next.providers[id] || {}) };
    if (typeof patch.model === 'string') current.model = patch.model.trim();
    if (typeof patch.baseURL === 'string') current.baseURL = patch.baseURL.trim();
    if (patch.clearKey) delete current.apiKey;
    else if (typeof patch.apiKey === 'string' && patch.apiKey.trim()) current.apiKey = encrypt(patch.apiKey.trim());
    next.providers[id] = current;
  }
  await query(
    `INSERT INTO site_settings (key, value, updated_at) VALUES ($1, $2::jsonb, CURRENT_TIMESTAMP)
     ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = CURRENT_TIMESTAMP`,
    [KEY, JSON.stringify(next)]
  );
  return getPublicAISettings();
}

/** Resolve which provider/model/key a job should use (optional per-job override). */
export async function resolveProvider(override) {
  const s = await getAISettings();
  const provider = PROVIDERS[override] ? override : s.defaultProvider;
  return { provider, effort: s.effort, ...s.providers[provider] };
}
