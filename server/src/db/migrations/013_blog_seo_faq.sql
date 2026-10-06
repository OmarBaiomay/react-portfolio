-- Per-post search snippet (title ≤60 / description ≤155) and FAQ shown under the article.
ALTER TABLE blog_posts
  ADD COLUMN IF NOT EXISTS seo JSONB NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS faq JSONB NOT NULL DEFAULT '[]'::jsonb;
