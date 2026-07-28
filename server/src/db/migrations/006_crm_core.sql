-- CRM leads
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  whatsapp_same_as_phone BOOLEAN NOT NULL DEFAULT FALSE,
  service TEXT NOT NULL DEFAULT 'web',
  message TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'new'
    CHECK (status IN ('new', 'contacted', 'qualified', 'proposal', 'won', 'lost')),
  source TEXT NOT NULL DEFAULT 'website',
  notes TEXT NOT NULL DEFAULT '',
  assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
  converted_project_id UUID,
  is_archived BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_leads_status ON leads (status);
CREATE INDEX IF NOT EXISTS idx_leads_created ON leads (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads (email);
CREATE INDEX IF NOT EXISTS idx_leads_archived ON leads (is_archived);
