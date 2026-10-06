import { marked } from 'marked';
import DOMPurify from 'dompurify';

/** Pick the post field in the current language, falling back to the other one. */
export const pickLang = (value, lang) =>
  (value && (value[lang] || value[lang === 'ar' ? 'en' : 'ar'])) || '';

/** Markdown → sanitized HTML (posts are written in the dashboard). */
export function renderMarkdown(markdown) {
  const html = marked
    .parse(String(markdown || ''), { gfm: true, breaks: true })
    // Wide tables scroll sideways on phones instead of breaking the layout.
    .replace(/<table>/g, '<div class="table-scroll"><table>')
    .replace(/<\/table>/g, '</table></div>');
  return DOMPurify.sanitize(html, { ADD_ATTR: ['target'] });
}

/** ~200 words per minute, at least 1. */
export function readingMinutes(markdown) {
  const words = String(markdown || '').trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export function formatPostDate(value, lang) {
  if (!value) return '';
  return new Date(value).toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/** Search-friendly text: lower case, no Arabic diacritics, unified alef / taa marbuta / yaa forms. */
export function normalizeSearch(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/[\u064B-\u0652\u0670\u0640]/g, '')
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Arabic names for the blog's topic tags (tags are stored in English). */
const TAG_AR = {
  Website: 'المواقع الإلكترونية',
  Pricing: 'الأسعار',
  Odoo: 'أودو',
  Compliance: 'الامتثال',
  ERP: 'تخطيط الموارد',
  'Web Design': 'تصميم المواقع',
  Arabic: 'العربية',
  'E-commerce': 'التجارة الإلكترونية',
  Business: 'الأعمال',
  Software: 'البرمجيات',
  Performance: 'الأداء',
  SEO: 'تحسين محركات البحث',
  Marketing: 'التسويق',
  UX: 'تجربة المستخدم',
  Development: 'التطوير',
};

export const tagLabel = (tag, lang) => (lang === 'ar' && TAG_AR[tag]) || tag;

/** The post's category name in the current language (falls back to its first tag). */
export const categoryLabel = (post, lang) =>
  (post?.categoryName && pickLang(post.categoryName, lang)) || (post?.tags?.[0] ? tagLabel(post.tags[0], lang) : '');
