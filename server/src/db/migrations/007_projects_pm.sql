-- Projects, milestones, tasks
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'planned'
    CHECK (status IN ('planned', 'active', 'on_hold', 'done', 'cancelled')),
  lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
  client_name TEXT NOT NULL DEFAULT '',
  client_email TEXT NOT NULL DEFAULT '',
  client_phone TEXT NOT NULL DEFAULT '',
  start_date DATE,
  due_date DATE,
  budget NUMERIC(14, 2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'in_progress', 'done')),
  due_date DATE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  milestone_id UUID REFERENCES milestones(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'todo'
    CHECK (status IN ('todo', 'doing', 'done')),
  assignee_id UUID REFERENCES users(id) ON DELETE SET NULL,
  due_date DATE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_projects_status ON projects (status);
CREATE INDEX IF NOT EXISTS idx_projects_lead ON projects (lead_id);
CREATE INDEX IF NOT EXISTS idx_milestones_project ON milestones (project_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_tasks_project ON tasks (project_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_tasks_milestone ON tasks (milestone_id);

-- Link leads.converted_project_id now that projects exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'leads_converted_project_id_fkey'
  ) THEN
    ALTER TABLE leads
      ADD CONSTRAINT leads_converted_project_id_fkey
      FOREIGN KEY (converted_project_id) REFERENCES projects(id) ON DELETE SET NULL;
  END IF;
END $$;
