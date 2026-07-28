import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const ThemeContext = createContext(null);

function readInitialTheme() {
  if (typeof window === 'undefined') return 'dark';
  return localStorage.getItem('bcode-theme') || 'dark';
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const initial = readInitialTheme();
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', initial);
    }
    return initial;
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('bcode-theme', theme);
  }, [theme]);

  const value = useMemo(
    () => ({
      theme,
      isDark: theme === 'dark',
      toggleTheme: () => setTheme((t) => (t === 'dark' ? 'light' : 'dark')),
      setTheme,
    }),
    [theme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
