import { query } from '../db/pg-connection.js';
import { mergeContent } from '../../../shared/content/index.js';
import { publishedPostSlugs } from '../controllers/blog.controller.js';

const SITE_URL = (process.env.SITE_URL || 'https://b-code.tech').replace(/\/$/, '');

const escapeXml = (s) =>
  String(s).replace(/[<>&'"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' })[c]);

function urlEntry(path, { lastmod, changefreq = 'monthly', priority = '0.8' } = {}) {
  const lines = [`    <loc>${escapeXml(SITE_URL + path)}</loc>`];
  if (lastmod) lines.push(`    <lastmod>${new Date(lastmod).toISOString().slice(0, 10)}</lastmod>`);
  lines.push(`    <changefreq>${changefreq}</changefreq>`, `    <priority>${priority}</priority>`);
  return `  <url>\n${lines.join('\n')}\n  </url>`;
}

/** sitemap.xml built from live content: home, portfolio projects, blog. */
export async function sitemapXml() {
  const stored = await query(
    `SELECT key, value FROM site_settings WHERE key IN ('content.projects', 'content.pages')`
  );
  const saved = Object.fromEntries(stored.rows.map((r) => [r.key.replace('content.', ''), r.value]));
  const { projects, pages } = mergeContent(saved);
  const posts = await publishedPostSlugs();

  const entries = [
    urlEntry('/', { changefreq: 'weekly', priority: '1.0' }),
    ...projects.filter((p) => !p.hidden).map((p) => urlEntry(`/work/${p.slug}`)),
    ...pages.filter((p) => !p.hidden).map((p) => urlEntry(`/${p.slug}`, { changefreq: 'yearly', priority: '0.3' })),
  ];
  if (posts.length) {
    entries.push(urlEntry('/blog', { changefreq: 'weekly', priority: '0.7' }));
    entries.push(...posts.map((p) => urlEntry(`/blog/${p.slug}`, { lastmod: p.updated_at, priority: '0.6' })));
  }

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join('\n')}\n</urlset>\n`;
}
