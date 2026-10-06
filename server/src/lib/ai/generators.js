import { query } from '../../db/pg-connection.js';
import { readContentPart, writeContentPart } from '../contentStore.js';
import { saveMedia } from '../media.js';
import { generateJSON } from './providers.js';
import { captureSite } from './browser.js';
import { COVER_ICONS, blogCover, brandColor, projectCover, toWebp } from './covers.js';

// ---------------------------------------------------------------- schema helpers
// Strict-mode compatible: every object closes additionalProperties and requires all keys.
const str = { type: 'string' };
const strList = { type: 'array', items: str };
const obj = (properties) => ({
  type: 'object',
  properties,
  required: Object.keys(properties),
  additionalProperties: false,
});
const bi = obj({ en: str, ar: str });
const biList = obj({ en: strList, ar: strList });

const slugify = (text) =>
  String(text || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 70);

const uniqueSlug = (base, taken) => {
  const root = slugify(base) || 'untitled';
  let slug = root;
  for (let i = 2; taken.has(slug); i += 1) slug = `${root}-${i}`;
  return slug;
};

const COMPANY = `B-Code is a software company in Saudi Arabia (b-code.tech). It builds modern websites,
implements and customizes Odoo ERP, and develops custom software for growing companies. Its own
website and all content are bilingual: English and Arabic (Modern Standard Arabic, right-to-left).`;

const ARABIC_RULES = `Arabic text must be natural, fluent Modern Standard Arabic written for Saudi readers —
not a word-for-word translation. Keep brand and product names (Odoo, WordPress, React, B-Code…) in Latin
letters inside Arabic text when that is how they are normally written.`;

// ---------------------------------------------------------------- new project from a link
export async function generateProject({ url, notes, ai }, progress) {
  const { info, shots } = await captureSite(url, progress);
  if (!info.text || info.text.length < 40) {
    throw new Error('Could not read any text from that website. Is the link correct and public?');
  }

  const [projects, industries] = await Promise.all([readContentPart('projects'), readContentPart('industries')]);
  const example = projects.find((p) => p.overview?.en) || projects[0];
  const industryIds = industries.map((i) => i.id);

  progress(`Writing the case study with ${ai.model}…`);
  const schema = obj({
    slug: str,
    title: bi,
    summary: bi,
    client: bi,
    role: bi,
    overview: bi,
    challenge: bi,
    solution: bi,
    results: biList,
    tags: biList,
    stack: strList,
    industry: { type: 'string', enum: [...industryIds, ''] },
    year: str,
    coverSubtitle: str,
  });

  const system = `You write portfolio case studies for B-Code's website.
${COMPANY}
B-Code designed and built the client website described below. Write as B-Code ("we").

Rules:
- Use only facts you can see in the website content, the technology hints, and the admin's notes.
  Never invent statistics, results, dates, client quotes or features. When something is unknown,
  write a true, general statement instead — or leave "year" as an empty string.
- If the admin's notes state facts (platform, scope, year), they override your own inferences.
- "stack" lists technologies actually detected or stated (e.g. WordPress, Elementor, Odoo, React, Bootstrap).
- "results" are 3 short outcome bullets grounded in what the site really offers.
- "tags" are 2–3 short labels (platform, type of site, industry).
- "industry" must be one of the allowed ids, or "" if none fits.
- "slug" is a short lowercase kebab-case name for the URL (latin letters, digits, dashes).
- "coverSubtitle" is a short English line like "WordPress website · Arabic & English".
- Match the tone and length of the example project.
${ARABIC_RULES}`;

  const prompt = `Example project (style and length reference only — do not copy its facts):
${JSON.stringify(
    {
      title: example?.title,
      summary: example?.summary,
      role: example?.role,
      overview: example?.overview,
      challenge: example?.challenge,
      solution: example?.solution,
      results: example?.results,
      tags: example?.tags,
      stack: example?.stack,
    },
    null,
    1
  )}

Allowed industry ids: ${industryIds.join(', ')}

Website: ${info.url}
Page title: ${info.title}
Meta description: ${info.description}
Document language / direction: ${info.lang || 'unknown'} / ${info.dir || 'unknown'}
Technology hints detected in the page source: ${info.hints.join(', ') || 'none'}
Main pages: ${info.links.slice(0, 20).map((l) => l.text).join(' | ')}

Admin notes: ${notes?.trim() || '(none)'}

Visible text of the home page:
"""
${info.text}
"""`;

  const draft = await generateJSON({ ...ai, system, prompt, schema });

  progress('Saving screenshots and designing the cover…');
  const host = new URL(info.url).host.replace(/^www\./, '');
  const name = draft.title?.en || host;
  const color = await brandColor(shots.desktop[0], info.themeColor);
  const pageLabel = (i) => (i === 0 ? { en: 'Home page', ar: 'الصفحة الرئيسية' } : { en: info.pages[i - 1]?.text || 'Page', ar: info.pages[i - 1]?.text || 'صفحة' });
  const altFor = (i, device) => {
    const label = pageLabel(i);
    const d = { desktop: ['on desktop', 'على سطح المكتب'], tablet: ['on tablet', 'على الجهاز اللوحي'], mobile: ['on mobile', 'على الجوال'] }[device];
    return { en: `${label.en} ${d[0]}`, ar: `${label.ar} ${d[1]}` };
  };

  const save = async (png, width, label) => saveMedia(await toWebp(png, width), 'image/webp', `${host}-${label}.webp`);
  const gallery = {
    desktop: await Promise.all(shots.desktop.map(async (png, i) => ({ src: await save(png, 1440, `desktop-${i}`), alt: altFor(i, 'desktop') }))),
    tablet: await Promise.all(shots.tablet.map(async (png, i) => ({ src: await save(png, 820, `tablet-${i}`), alt: altFor(i, 'tablet') }))),
    mobile: await Promise.all(shots.mobile.map(async (png, i) => ({ src: await save(png, 780, `mobile-${i}`), alt: altFor(i, 'mobile') }))),
  };

  const cover = await projectCover({
    title: name,
    subtitle: draft.coverSubtitle || host,
    host,
    desktop: shots.desktop[0],
    tablet: shots.tablet[0] || shots.mobile[0],
    mobile: shots.mobile[0],
    color,
  });
  const imgSrc = await saveMedia(cover, 'image/jpeg', `${host}-cover.jpg`);

  progress('Adding the project to your portfolio (hidden until you publish it)…');
  // Re-read just before writing so edits made meanwhile aren't lost.
  const current = await readContentPart('projects');
  const slug = uniqueSlug(draft.slug || name, new Set(current.map((p) => p.slug)));
  const project = {
    slug,
    imgSrc,
    liveUrl: info.url,
    industry: draft.industry || '',
    ...(draft.year ? { year: draft.year } : {}),
    title: draft.title,
    tags: draft.tags,
    summary: draft.summary,
    client: draft.client,
    role: draft.role,
    overview: draft.overview,
    challenge: draft.challenge,
    solution: draft.solution,
    results: draft.results,
    stack: draft.stack,
    gallery,
    hidden: true,
  };
  await writeContentPart('projects', [project, ...current]);
  return { slug, title: project.title, hidden: true };
}

// ---------------------------------------------------------------- new blog post from a topic
const LENGTHS = { short: '450–600', medium: '750–950', long: '1100–1400' };

export async function generateBlogPost({ topic, notes, length, author, ai }, progress) {
  const [{ rows: existing }, site] = await Promise.all([
    query(`SELECT slug, title FROM blog_posts ORDER BY COALESCE(published_at, created_at) DESC LIMIT 30`),
    readContentPart('translations'),
  ]);
  const { rows: sample } = await query(
    `SELECT body FROM blog_posts WHERE status = 'published' ORDER BY published_at DESC LIMIT 1`
  );
  const words = LENGTHS[length] || LENGTHS.medium;

  progress(`Writing the article with ${ai.model}…`);
  const schema = obj({
    slug: str,
    title: bi,
    excerpt: bi,
    body: bi,
    tags: strList,
    coverIcon: { type: 'string', enum: COVER_ICONS },
    coverTag: bi,
  });

  const system = `You write blog articles for B-Code's website.
${COMPANY}
Services: ${site?.en?.services?.lead || 'websites, Odoo ERP, custom software'}

Write genuinely useful, practical articles for business owners and managers in Saudi Arabia and the Gulf.
Rules:
- Return the article in English ("en") and Arabic ("ar"). Each language: about ${words} words, Markdown.
- Do not include an H1 title in the body (the page shows the title). Use ## and ### headings, short paragraphs,
  bullet or numbered lists where they help, and **bold** for key phrases.
- Be accurate. Do not invent statistics, studies, quotes or prices. Prefer clear advice over hype.
- Where natural, link to related B-Code articles with relative links like [text](/blog/slug) — only slugs
  from the list provided — and never to other websites unless the admin asks.
- End each language with a horizontal rule (---) followed by one short bold call to action that links to /#contact.
- "excerpt" is one or two sentences for the article card.
- "slug" is short lowercase English kebab-case. "tags" are 2–3 short English labels.
- "coverIcon" is the icon that best fits the topic. "coverTag" is a 1–3 word topic label in each language.
${ARABIC_RULES}`;

  const prompt = `Topic / instructions from the admin:
"""
${topic}
"""

Extra notes: ${notes?.trim() || '(none)'}

Existing articles you may link to:
${existing.map((p) => `- /blog/${p.slug} — ${p.title?.en || p.title?.ar || ''}`).join('\n') || '(none yet)'}

${sample[0]?.body?.en ? `Style reference (an existing article — match its tone and structure, not its content):\n"""\n${sample[0].body.en.slice(0, 2500)}\n"""` : ''}`;

  const draft = await generateJSON({ ...ai, system, prompt, schema });

  progress('Designing the cover image…');
  const coverPng = await blogCover({
    title: draft.title?.en || topic,
    tagEn: draft.coverTag?.en,
    tagAr: draft.coverTag?.ar,
    icon: draft.coverIcon,
  });
  const coverUrl = await saveMedia(coverPng, 'image/webp', `blog-${slugify(draft.slug || topic)}-cover.webp`);

  progress('Saving the draft…');
  const { rows: slugs } = await query(`SELECT slug FROM blog_posts`);
  const slug = uniqueSlug(draft.slug || draft.title?.en || topic, new Set(slugs.map((r) => r.slug)));
  const { rows } = await query(
    `INSERT INTO blog_posts (slug, title, excerpt, body, cover_url, tags, author, status)
     VALUES ($1, $2, $3, $4, $5, $6, $7, 'draft') RETURNING id, slug, title`,
    [slug, draft.title, draft.excerpt, draft.body, coverUrl, JSON.stringify((draft.tags || []).slice(0, 6)), author || 'B-Code Team']
  );
  return { postId: rows[0].id, slug: rows[0].slug, title: rows[0].title, status: 'draft' };
}
