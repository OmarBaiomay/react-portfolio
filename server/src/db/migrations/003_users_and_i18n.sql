-- Account details + bilingual content for packages / maintenance plans

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS details TEXT NOT NULL DEFAULT '';

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'packages'
      AND column_name = 'name'
      AND data_type = 'text'
  ) THEN
    ALTER TABLE packages
      ALTER COLUMN name TYPE JSONB USING jsonb_build_object('en', name, 'ar', COALESCE(name, '')),
      ALTER COLUMN title TYPE JSONB USING jsonb_build_object('en', title, 'ar', COALESCE(title, '')),
      ALTER COLUMN subtitle TYPE JSONB USING jsonb_build_object('en', subtitle, 'ar', COALESCE(subtitle, '')),
      ALTER COLUMN delivery TYPE JSONB USING jsonb_build_object('en', delivery, 'ar', COALESCE(delivery, ''));
  END IF;

  IF EXISTS (
    SELECT 1
    FROM packages
    WHERE jsonb_typeof(features) = 'array'
    LIMIT 1
  ) THEN
    UPDATE packages
    SET features = jsonb_build_object('en', features, 'ar', features)
    WHERE jsonb_typeof(features) = 'array';
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'maintenance_plans'
      AND column_name = 'name'
      AND data_type = 'text'
  ) THEN
    ALTER TABLE maintenance_plans
      ALTER COLUMN name TYPE JSONB USING jsonb_build_object('en', name, 'ar', COALESCE(name, ''));
  END IF;

  IF EXISTS (
    SELECT 1
    FROM maintenance_plans
    WHERE jsonb_typeof(features) = 'array'
    LIMIT 1
  ) THEN
    UPDATE maintenance_plans
    SET features = jsonb_build_object('en', features, 'ar', features)
    WHERE jsonb_typeof(features) = 'array';
  END IF;
END $$;
