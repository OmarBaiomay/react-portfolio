import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { translations } from '../i18n/translations';

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    if (typeof window === 'undefined') return 'ar';
    return localStorage.getItem('bcode-admin-lang') || 'ar';
  });

  useEffect(() => {
    const dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('dir', dir);
    document.documentElement.setAttribute('data-lang', lang);
    localStorage.setItem('bcode-admin-lang', lang);
  }, [lang]);

  const value = useMemo(
    () => ({
      lang,
      isRtl: lang === 'ar',
      t: translations[lang],
      toggleLang: () => setLang((l) => (l === 'en' ? 'ar' : 'en')),
      setLang,
    }),
    [lang]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
