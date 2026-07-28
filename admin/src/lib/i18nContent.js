export function pickLocalized(value, lang = 'en') {
  if (value == null) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'object' && !Array.isArray(value)) {
    return value[lang] || value.en || value.ar || '';
  }
  return String(value);
}

export function pickLocalizedList(value, lang = 'en') {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === 'object') {
    const list = value[lang] || value.en || value.ar || [];
    return Array.isArray(list) ? list : [];
  }
  return [];
}

export function emptyI18nText() {
  return { en: '', ar: '' };
}

export function emptyI18nList() {
  return { en: [''], ar: [''] };
}

export function normalizeI18nText(value) {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return { en: value.en || '', ar: value.ar || '' };
  }
  const text = typeof value === 'string' ? value : '';
  return { en: text, ar: text };
}

export function normalizeI18nList(value) {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return {
      en: Array.isArray(value.en) && value.en.length ? value.en : [''],
      ar: Array.isArray(value.ar) && value.ar.length ? value.ar : [''],
    };
  }
  if (Array.isArray(value) && value.length) {
    return { en: [...value], ar: [...value] };
  }
  return emptyI18nList();
}
