import { marked } from 'marked';
import DOMPurify from 'dompurify';

/** Pick the post field in the current language, falling back to the other one. */
export const pickLang = (value, lang) =>
  (value && (value[lang] || value[lang === 'ar' ? 'en' : 'ar'])) || '';

/** Markdown → sanitized HTML (posts are written in the dashboard). */
export function renderMarkdown(markdown) {
  const html = marked.parse(String(markdown || ''), { gfm: true, breaks: true });
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
