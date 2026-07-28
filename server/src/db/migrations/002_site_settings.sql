CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO site_settings (key, value)
VALUES ('theme', '{"paletteId":"orange"}'::jsonb)
ON CONFLICT (key) DO NOTHING;
