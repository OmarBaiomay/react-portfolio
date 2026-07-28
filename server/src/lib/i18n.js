/**
 * Normalize bilingual text / list payloads.
 * Accepts plain string (legacy) or { en, ar }.
 */

export function toI18nText(value, fallback = '') {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    const en = String(value.en ?? '').trim();
    const ar = String(value.ar ?? '').trim();
    return { en: en || ar || fallback, ar: ar || en || fallback };
  }
  const text = String(value ?? fallback).trim();
  return { en: text, ar: text };
}

export function toI18nList(value) {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    const en = Array.isArray(value.en) ? value.en.map((f) => String(f ?? '').trim()).filter(Boolean) : [];
    const ar = Array.isArray(value.ar) ? value.ar.map((f) => String(f ?? '').trim()).filter(Boolean) : [];
    return {
      en: en.length ? en : ar,
      ar: ar.length ? ar : en,
    };
  }
  if (Array.isArray(value)) {
    const list = value.map((f) => String(f ?? '').trim()).filter(Boolean);
    return { en: list, ar: list };
  }
  return { en: [], ar: [] };
}

export function hasI18nText(value) {
  const n = toI18nText(value);
  return Boolean(n.en || n.ar);
}

export function hasI18nList(value) {
  const n = toI18nList(value);
  return n.en.length > 0 || n.ar.length > 0;
}
