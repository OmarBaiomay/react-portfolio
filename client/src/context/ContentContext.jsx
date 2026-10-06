import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { DEFAULT_CONTENT, mergeContent } from '../../../shared/content/index.js';
import { publicAPI } from '../services/frontendApi';

const CACHE_KEY = 'bcode-content';

const ContentContext = createContext(null);

function readCache() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeCache(parts) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(parts));
  } catch {
    // storage full or blocked — the site still works from defaults
  }
}

/**
 * Website content edited from the dashboard. Starts from the last cached copy
 * (or the built-in defaults) and refreshes from /api/content on load.
 */
export function ContentProvider({ children }) {
  const [content, setContent] = useState(() => {
    const cached = readCache();
    return cached ? mergeContent(cached) : DEFAULT_CONTENT;
  });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let alive = true;
    publicAPI
      .getContent()
      .then(({ data }) => {
        if (!alive || !data) return;
        // eslint-disable-next-line no-unused-vars
        const { updatedAt, ...parts } = data;
        setContent(mergeContent(parts));
        writeCache(parts);
      })
      .catch(() => {
        // API down: keep cached / built-in content
      })
      .finally(() => {
        if (alive) setLoaded(true);
      });
    return () => {
      alive = false;
    };
  }, []);

  const value = useMemo(
    () => ({
      ...content,
      projects: content.projects.filter((p) => !p.hidden),
      faqs: content.faqs.filter((f) => !f.hidden),
      industries: content.industries.filter((i) => !i.hidden),
      loaded,
    }),
    [content, loaded]
  );

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

ContentProvider.propTypes = { children: PropTypes.node };

export function useContent() {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error('useContent must be used within ContentProvider');
  return ctx;
}
