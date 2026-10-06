import { translations } from './translations.js';
import { projects } from './projects.js';
import { faqs } from './faqs.js';
import { industries } from './industries.js';
import { techStack } from './techStack.js';
import { site } from './site.js';
import { sections } from './sections.js';
import { pages } from './pages.js';
import { services } from './services.js';

/** Built-in website content. The API stores edits per part and merges them over this. */
export const DEFAULT_CONTENT = { translations, projects, faqs, industries, techStack, site, sections, pages, services };

export const CONTENT_PARTS = Object.keys(DEFAULT_CONTENT);

const isPlainObject = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);

/** Objects merge key by key; arrays and scalars from `override` replace the base. */
export function deepMerge(base, override) {
  if (override === undefined || override === null) return base;
  if (!isPlainObject(base) || !isPlainObject(override)) return override;
  const out = { ...base };
  for (const [key, value] of Object.entries(override)) {
    out[key] = deepMerge(base[key], value);
  }
  return out;
}

/** Merge stored edits ({ part: value }) over the defaults. */
export function mergeContent(stored = {}) {
  const out = {};
  for (const part of CONTENT_PARTS) {
    out[part] = deepMerge(DEFAULT_CONTENT[part], stored[part]);
  }
  return out;
}
