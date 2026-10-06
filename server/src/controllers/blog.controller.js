import { query } from '../db/pg-connection.js';

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function mapPost(row, { withBody = true } = {}) {
  if (!row) return null;
  const post = {
    id: row.id,
    slug: row.slug,
    title: row.title || {},
    excerpt: row.excerpt || {},
    coverUrl: row.cover_url || '',
    tags: row.tags || [],
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
  return {
    value: {
      slug,
      title,
      excerpt: bilingual(body.excerpt),
      body: bilingual(body.body),
      coverUrl: String(body.coverUrl || ''),
      tags,
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
      `SELECT * FROM blog_posts WHERE ${PUBLISHED} ORDER BY published_at DESC LIMIT $1`,
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
    const result = await query(`SELECT * FROM blog_posts WHERE slug = $1 AND ${PUBLISHED}`, [
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
      `INSERT INTO blog_posts (slug, title, excerpt, body, cover_url, tags, author, status, published_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
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
         author = $8, status = $9,
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
