-- Kingy Blue becomes the default brand palette (replaces Sunset Orange).
INSERT INTO site_settings (key, value, updated_at)
VALUES ('theme', '{"paletteId":"kingy-blue"}'::jsonb, CURRENT_TIMESTAMP)
ON CONFLICT (key) DO UPDATE
  SET value = '{"paletteId":"kingy-blue"}'::jsonb, updated_at = CURRENT_TIMESTAMP
  WHERE site_settings.value->>'paletteId' = 'orange';
