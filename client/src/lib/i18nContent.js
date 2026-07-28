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
