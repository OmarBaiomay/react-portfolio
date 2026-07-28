INSERT INTO site_settings (key, value)
VALUES ('heroScene', '{"sceneId":"helix"}'::jsonb)
ON CONFLICT (key) DO NOTHING;
