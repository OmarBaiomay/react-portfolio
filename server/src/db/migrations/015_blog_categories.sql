-- Blog categories (one per post), editable and creatable from the dashboard.
CREATE TABLE IF NOT EXISTS blog_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name JSONB NOT NULL DEFAULT '{}'::jsonb,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS category TEXT NOT NULL DEFAULT '';

INSERT INTO blog_categories (slug, name, sort_order) VALUES
  ('odoo-erp', '{"en": "Odoo & ERP", "ar": "أودو وأنظمة ERP"}', 10),
  ('websites', '{"en": "Websites", "ar": "المواقع الإلكترونية"}', 20),
  ('ecommerce', '{"en": "E-commerce", "ar": "التجارة الإلكترونية"}', 30),
  ('custom-software', '{"en": "Custom software", "ar": "البرمجيات المخصصة"}', 40),
  ('seo-marketing', '{"en": "SEO & marketing", "ar": "التسويق وتحسين البحث"}', 50),
  ('business', '{"en": "Business", "ar": "الأعمال"}', 60)
ON CONFLICT (slug) DO NOTHING;

-- Categorise the existing articles (only where no category was chosen yet).
UPDATE blog_posts SET category = c.category
FROM (VALUES
  ('odoo-implementation-guide', 'odoo-erp'),
  ('odoo-configure-vs-customize', 'odoo-erp'),
  ('zatca-e-invoicing-odoo', 'odoo-erp'),
  ('odoo-community-vs-enterprise', 'odoo-erp'),
  ('signs-outgrown-spreadsheets', 'odoo-erp'),
  ('web-design-that-converts', 'websites'),
  ('why-your-business-needs-a-website', 'websites'),
  ('arabic-rtl-website-design', 'websites'),
  ('website-speed-guide', 'websites'),
  ('online-store-platforms-saudi-arabia', 'ecommerce'),
  ('custom-software-vs-off-the-shelf', 'custom-software'),
  ('seo-basics-for-saudi-businesses', 'seo-marketing'),
  ('choose-web-odoo-partner', 'business')
) AS c(slug, category)
WHERE blog_posts.slug = c.slug AND blog_posts.category = '';
