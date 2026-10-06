import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useContent } from './ContentContext';

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const { translations } = useContent();
  const [lang, setLang] = useState(() => {
    if (typeof window === 'undefined') return 'ar';
    return localStorage.getItem('bcode-lang') || 'ar';
  });

  useEffect(() => {
    const dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('dir', dir);
    document.documentElement.setAttribute('data-lang', lang);
    localStorage.setItem('bcode-lang', lang);
  }, [lang]);

  const value = useMemo(
    () => ({
      lang,
      isRtl: lang === 'ar',
      t: translations[lang] || translations.en,
      toggleLang: () => setLang((l) => (l === 'en' ? 'ar' : 'en')),
      setLang,
    }),
    [lang, translations]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
