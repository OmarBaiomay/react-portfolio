import { query } from '../db/pg-connection.js';

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** Reading time per language (~200 words a minute), so lists can show it without the body. */
const minutesFor = (text) =>
  Math.max(1, Math.round(String(text || '').split(/\s+/).filter(Boolean).length / 200));

function mapPost(row, { withBody = true } = {}) {
  if (!row) return null;
  const post = {
    id: row.id,
    slug: row.slug,
    title: row.title || {},
    excerpt: row.excerpt || {},
    coverUrl: row.cover_url || '',
    tags: row.tags || [],
    category: row.category || '',
    categoryName: row.category_name || null,
    seo: row.seo || {},
    minutes: { en: minutesFor(row.body?.en), ar: minutesFor(row.body?.ar) },
    faq: row.faq || [],
    author: row.author || '',
    status: row.status,
    publishedAt: row.published_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
  if (withBody) post.body = row.body || {};
  return post;
}

const bilingual = (v) => ({ en: String(v?.en ?? ''), ar: String(v?.ar ?? '') });

function readPostInput(body = {}) {
  const slug = String(body.slug || '').trim().toLowerCase();
  if (!SLUG_RE.test(slug)) {
    return { error: 'Slug must use lowercase letters, numbers and dashes (e.g. odoo-vs-zoho)' };
  }
  const title = bilingual(body.title);
  if (!title.en.trim() && !title.ar.trim()) return { error: 'Add a title in English or Arabic' };
  const tags = Array.isArray(body.tags)
    ? body.tags.map((t) => String(t).trim()).filter(Boolean).slice(0, 12)
    : [];
  const publishedAt = body.publishedAt ? new Date(body.publishedAt) : null;
  const seo = { title: bilingual(body.seo?.title), description: bilingual(body.seo?.description) };
  const faq = Array.isArray(body.faq)
    ? body.faq
        .map((item) => ({ q: bilingual(item?.q), a: bilingual(item?.a) }))
        .filter((item) => item.q.en.trim() || item.q.ar.trim())
        .slice(0, 12)
    : [];
  return {
    value: {
      slug,
      title,
      excerpt: bilingual(body.excerpt),
      body: bilingual(body.body),
      coverUrl: String(body.coverUrl || ''),
      tags,
      seo,
      faq,
      category: SLUG_RE.test(String(body.category || '')) ? String(body.category) : '',
      author: String(body.author || '').slice(0, 120),
      status: body.status === 'published' ? 'published' : 'draft',
      publishedAt: publishedAt && !Number.isNaN(publishedAt.getTime()) ? publishedAt : null,
    },
  };
}

const PUBLISHED = `status = 'published' AND published_at <= CURRENT_TIMESTAMP`;

/** Public: published posts, newest first (without bodies). */
export async function listPublishedPosts(req, res) {
  try {
    const limit = Math.min(Number(req.query.limit) || 50, 100);
    const result = await query(
      `SELECT p.*, c.name AS category_name FROM blog_posts p
       LEFT JOIN blog_categories c ON c.slug = p.category
       WHERE ${PUBLISHED} ORDER BY published_at DESC LIMIT $1`,
      [limit]
    );
    res.set('Cache-Control', 'no-cache');
    res.json(result.rows.map((r) => mapPost(r, { withBody: false })));
  } catch (error) {
    console.error('listPublishedPosts:', error.message);
    res.status(500).json({ message: 'Failed to load posts' });
  }
}

export async function getPublishedPost(req, res) {
  try {
    const result = await query(`SELECT p.*, c.name AS category_name FROM blog_posts p
       LEFT JOIN blog_categories c ON c.slug = p.category
       WHERE p.slug = $1 AND ${PUBLISHED}`, [
      String(req.params.slug || '').toLowerCase(),
    ]);
    if (!result.rows[0]) return res.status(404).json({ message: 'Post not found' });
    res.set('Cache-Control', 'no-cache');
    res.json(mapPost(result.rows[0]));
  } catch (error) {
    console.error('getPublishedPost:', error.message);
    res.status(500).json({ message: 'Failed to load post' });
  }
}

/** Admin: every post, drafts included. */
export async function listAllPosts(req, res) {
  try {
    const result = await query(
      `SELECT * FROM blog_posts ORDER BY COALESCE(published_at, created_at) DESC`
    );
    res.json(result.rows.map((r) => mapPost(r)));
  } catch (error) {
    console.error('listAllPosts:', error.message);
    res.status(500).json({ message: 'Failed to load posts' });
  }
}

export async function createPost(req, res) {
  try {
    const { value, error } = readPostInput(req.body);
    if (error) return res.status(400).json({ message: error });
    const publishedAt =
      value.status === 'published' ? value.publishedAt || new Date() : value.publishedAt;
    const result = await query(
      `INSERT INTO blog_posts (slug, title, excerpt, body, cover_url, tags, author, status, published_at, seo, faq, category)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *`,
      [
        value.slug,
        value.title,
        value.excerpt,
        value.body,
        value.coverUrl,
        JSON.stringify(value.tags),
        value.author,
        value.status,
        publishedAt,
        value.seo,
        JSON.stringify(value.faq),
        value.category,
      ]
    );
    res.status(201).json(mapPost(result.rows[0]));
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ message: 'Another post already uses this slug' });
    }
    console.error('createPost:', error.message);
    res.status(500).json({ message: 'Failed to create post' });
  }
}

export async function updatePost(req, res) {
  try {
    const { value, error } = readPostInput(req.body);
    if (error) return res.status(400).json({ message: error });
    const result = await query(
      `UPDATE blog_posts SET
         slug = $2, title = $3, excerpt = $4, body = $5, cover_url = $6, tags = $7,
         author = $8, status = $9, seo = $11, faq = $12, category = $13,
         published_at = CASE WHEN $9 = 'published'
           THEN COALESCE($10, published_at, CURRENT_TIMESTAMP) ELSE $10 END,
         updated_at = CURRENT_TIMESTAMP
       WHERE id = $1 RETURNING *`,
      [
        req.params.id,
        value.slug,
        value.title,
        value.excerpt,
        value.body,
        value.coverUrl,
        JSON.stringify(value.tags),
        value.author,
        value.status,
        value.publishedAt,
        value.seo,
        JSON.stringify(value.faq),
        value.category,
      ]
    );
    if (!result.rows[0]) return res.status(404).json({ message: 'Post not found' });
    res.json(mapPost(result.rows[0]));
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ message: 'Another post already uses this slug' });
    }
    if (error.code === '22P02') return res.status(404).json({ message: 'Post not found' });
    console.error('updatePost:', error.message);
    res.status(500).json({ message: 'Failed to update post' });
  }
}

export async function deletePost(req, res) {
  try {
    await query(`DELETE FROM blog_posts WHERE id = $1`, [req.params.id]);
    res.json({ message: 'Deleted' });
  } catch (error) {
    if (error.code === '22P02') return res.status(404).json({ message: 'Post not found' });
    console.error('deletePost:', error.message);
    res.status(500).json({ message: 'Failed to delete post' });
  }
}

/** Slugs and dates of published posts, for the sitemap. */
export async function publishedPostSlugs() {
  const result = await query(
    `SELECT slug, updated_at FROM blog_posts WHERE ${PUBLISHED} ORDER BY published_at DESC`
  );
  return result.rows;
}

/* ---------------------------------------------------------------- categories */

const mapCategory = (row) => ({ id: row.id, slug: row.slug, name: row.name || {}, sortOrder: row.sort_order });

const slugifyCategory = (text) =>
  String(text || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);

/** Public: all categories in display order. */
export async function listCategories(req, res) {
  try {
    const result = await query(`SELECT * FROM blog_categories ORDER BY sort_order ASC, created_at ASC`);
    res.set('Cache-Control', 'no-cache');
    res.json(result.rows.map(mapCategory));
  } catch (error) {
    console.error('listCategories:', error.message);
    res.status(500).json({ message: 'Failed to load categories' });
  }
}

/** Admin: create a category inline from the post editor. Returns the existing one if the slug is taken. */
export async function createCategory(req, res) {
  try {
    const name = bilingual(req.body?.name);
    if (!name.en.trim() && !name.ar.trim()) return res.status(400).json({ message: 'Add a category name' });
    if (!name.en.trim()) name.en = name.ar;
    if (!name.ar.trim()) name.ar = name.en;
    // Arabic-only names have no Latin letters to build a slug from.
    const slug = slugifyCategory(name.en) || `category-${Date.now().toString(36)}`;
    const existing = await query(`SELECT * FROM blog_categories WHERE slug = $1`, [slug]);
    if (existing.rows[0]) return res.json(mapCategory(existing.rows[0]));
    const result = await query(
      `INSERT INTO blog_categories (slug, name, sort_order)
       VALUES ($1, $2, COALESCE((SELECT MAX(sort_order) FROM blog_categories), 0) + 10) RETURNING *`,
      [slug, name]
    );
    res.status(201).json(mapCategory(result.rows[0]));
  } catch (error) {
    console.error('createCategory:', error.message);
    res.status(500).json({ message: 'Failed to create category' });
  }
}

/** Admin: rename a category or change its position. */
export async function updateCategory(req, res) {
  try {
    const cur = await query(`SELECT * FROM blog_categories WHERE slug = $1`, [req.params.slug]);
    if (!cur.rows[0]) return res.status(404).json({ message: 'Category not found' });
    const name = req.body?.name ? bilingual(req.body.name) : cur.rows[0].name;
    if (!name.en.trim() && !name.ar.trim()) return res.status(400).json({ message: 'Add a category name' });
    const sortOrder = Number.isFinite(Number(req.body?.sortOrder)) ? Number(req.body.sortOrder) : cur.rows[0].sort_order;
    const result = await query(`UPDATE blog_categories SET name = $2, sort_order = $3 WHERE slug = $1 RETURNING *`, [
      req.params.slug,
      name,
      sortOrder,
    ]);
    res.json(mapCategory(result.rows[0]));
  } catch (error) {
    console.error('updateCategory:', error.message);
    res.status(500).json({ message: 'Failed to update category' });
  }
}

/** Admin: delete a category; its posts become uncategorised. */
export async function deleteCategory(req, res) {
  try {
    await query(`UPDATE blog_posts SET category = '' WHERE category = $1`, [req.params.slug]);
    const result = await query(`DELETE FROM blog_categories WHERE slug = $1 RETURNING slug`, [req.params.slug]);
    if (!result.rows[0]) return res.status(404).json({ message: 'Category not found' });
    res.json({ message: 'Category deleted' });
  } catch (error) {
    console.error('deleteCategory:', error.message);
    res.status(500).json({ message: 'Failed to delete category' });
  }
}

const BULK_ACTIONS = ['publish', 'draft', 'delete', 'category'];

/** Admin: apply one action to many posts at once. */
export async function bulkPosts(req, res) {
  try {
    const ids = Array.isArray(req.body?.ids) ? req.body.ids.map(String).slice(0, 500) : [];
    const action = String(req.body?.action || '');
    if (!ids.length || !BULK_ACTIONS.includes(action)) {
      return res.status(400).json({ message: 'Choose posts and an action' });
    }
    let result;
    if (action === 'delete') {
      result = await query(`DELETE FROM blog_posts WHERE id = ANY($1::uuid[]) RETURNING id`, [ids]);
    } else if (action === 'publish') {
      result = await query(
        `UPDATE blog_posts SET status = 'published', published_at = COALESCE(published_at, CURRENT_TIMESTAMP),
           updated_at = CURRENT_TIMESTAMP WHERE id = ANY($1::uuid[]) RETURNING id`,
        [ids]
      );
    } else if (action === 'draft') {
      result = await query(
        `UPDATE blog_posts SET status = 'draft', updated_at = CURRENT_TIMESTAMP WHERE id = ANY($1::uuid[]) RETURNING id`,
        [ids]
      );
    } else {
      const category = String(req.body?.category || '');
      if (category && !SLUG_RE.test(category)) return res.status(400).json({ message: 'Invalid category' });
      result = await query(
        `UPDATE blog_posts SET category = $2, updated_at = CURRENT_TIMESTAMP WHERE id = ANY($1::uuid[]) RETURNING id`,
        [ids, category]
      );
    }
    res.json({ count: result.rowCount });
  } catch (error) {
    if (error.code === '22P02') return res.status(400).json({ message: 'Invalid post id' });
    console.error('bulkPosts:', error.message);
    res.status(500).json({ message: 'Bulk action failed' });
  }
}
