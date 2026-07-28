-- Sales: quotes, contracts, invoices
CREATE TABLE IF NOT EXISTS quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  number TEXT NOT NULL UNIQUE,
  lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'sent', 'accepted', 'rejected', 'expired')),
  currency TEXT NOT NULL DEFAULT 'EGP',
  subtotal NUMERIC(14, 2) NOT NULL DEFAULT 0,
  tax NUMERIC(14, 2) NOT NULL DEFAULT 0,
  total NUMERIC(14, 2) NOT NULL DEFAULT 0,
  issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
  valid_until DATE,
  notes TEXT NOT NULL DEFAULT '',
  line_items JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  number TEXT NOT NULL UNIQUE,
  lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  quote_id UUID REFERENCES quotes(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'sent', 'signed', 'cancelled')),
  currency TEXT NOT NULL DEFAULT 'EGP',
  subtotal NUMERIC(14, 2) NOT NULL DEFAULT 0,
  tax NUMERIC(14, 2) NOT NULL DEFAULT 0,
  total NUMERIC(14, 2) NOT NULL DEFAULT 0,
  issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
  valid_until DATE,
  notes TEXT NOT NULL DEFAULT '',
  line_items JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  number TEXT NOT NULL UNIQUE,
  lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  quote_id UUID REFERENCES quotes(id) ON DELETE SET NULL,
  contract_id UUID REFERENCES contracts(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'sent', 'paid', 'overdue', 'cancelled')),
  currency TEXT NOT NULL DEFAULT 'EGP',
  subtotal NUMERIC(14, 2) NOT NULL DEFAULT 0,
  tax NUMERIC(14, 2) NOT NULL DEFAULT 0,
  total NUMERIC(14, 2) NOT NULL DEFAULT 0,
  issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
  due_date DATE,
  notes TEXT NOT NULL DEFAULT '',
  line_items JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_quotes_status ON quotes (status);
CREATE INDEX IF NOT EXISTS idx_contracts_status ON contracts (status);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices (status);
CREATE INDEX IF NOT EXISTS idx_quotes_lead ON quotes (lead_id);
CREATE INDEX IF NOT EXISTS idx_invoices_due ON invoices (due_date);
