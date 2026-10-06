import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { contentAPI } from '../services/api';

/**
 * Public website origin, for previewing site assets like /images/... that live
 * on the marketing site rather than the dashboard.
 */
const SITE_ORIGIN = (
  import.meta.env.VITE_SITE_URL || (import.meta.env.DEV ? 'http://localhost:5173' : 'https://b-code.tech')
).replace(/\/$/, '');

/** Make a stored image path viewable from the dashboard. */
export function assetUrl(src) {
  if (!src) return '';
  if (/^(https?:|data:|blob:)/.test(src)) return src;
  if (src.startsWith('/api/')) return src;
  return `${SITE_ORIGIN}${src.startsWith('/') ? '' : '/'}${src}`;
}

export const SITE_URL = SITE_ORIGIN;

const clone = (v) => (typeof structuredClone === 'function' ? structuredClone(v) : JSON.parse(JSON.stringify(v)));

/**
 * Load one content part (merged live value + built-in default) and save/reset it.
 * `value` is a working copy; `dirty` tracks unsaved edits.
 */
export function useContentPart(part, messages = {}) {
  const [value, setValue] = useState(null);
  const [defaults, setDefaults] = useState(null);
  const [edited, setEdited] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    try {
      const [live, defs] = await Promise.all([contentAPI.get(), contentAPI.getDefaults()]);
      setValue(clone(live.data[part]));
      setDefaults(defs.data.defaults[part]);
      setEdited(defs.data.edited.includes(part));
      setDirty(false);
    } catch (error) {
      toast.error(error.response?.data?.message || messages.loadError || 'Failed to load');
    }
  }, [part, messages.loadError]);

  useEffect(() => {
    load();
  }, [load]);

  // Warn before leaving the page with unsaved edits.
  useEffect(() => {
    if (!dirty) return undefined;
    const onBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [dirty]);

  const update = useCallback((next) => {
    setValue((prev) => (typeof next === 'function' ? next(prev) : next));
    setDirty(true);
  }, []);

  const save = useCallback(
    async (override) => {
      setSaving(true);
      try {
        const { data } = await contentAPI.save(part, override ?? value);
        setValue(clone(data.value));
        setEdited(true);
        setDirty(false);
        toast.success(messages.saved || 'Saved — live on the website');
        return true;
      } catch (error) {
        toast.error(error.response?.data?.message || messages.saveError || 'Failed to save');
        return false;
      } finally {
        setSaving(false);
      }
    },
    [part, value, messages.saved, messages.saveError]
  );

  const reset = useCallback(async () => {
    setSaving(true);
    try {
      const { data } = await contentAPI.reset(part);
      setValue(clone(data.value));
      setEdited(false);
      setDirty(false);
      toast.success(messages.reset || 'Restored the original content');
    } catch (error) {
      toast.error(error.response?.data?.message || messages.saveError || 'Failed to reset');
    } finally {
      setSaving(false);
    }
  }, [part, messages.reset, messages.saveError]);

  return { value, defaults, edited, dirty, saving, update, save, reset, reload: load };
}

/** Immutable set at a dotted/array path, e.g. setIn(obj, ['a', 0, 'b'], v). */
export function setIn(obj, path, val) {
  if (!path.length) return val;
  const [key, ...rest] = path;
  const copy = Array.isArray(obj) ? [...obj] : { ...(obj || {}) };
  copy[key] = setIn(copy[key], rest, val);
  return copy;
}

export function getIn(obj, path) {
  return path.reduce((acc, key) => (acc == null ? undefined : acc[key]), obj);
}

export function moveItem(list, index, dir) {
  const target = index + dir;
  if (target < 0 || target >= list.length) return list;
  const next = [...list];
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}

export const slugify = (text) =>
  String(text || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
