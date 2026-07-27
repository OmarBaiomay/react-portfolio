import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Languages, Moon, Sun, Menu, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

const Header = () => {
  const [navOpen, setNavOpen] = useState(false);
  const { t, lang, toggleLang } = useLanguage();
  const { isDark, toggleTheme } = useTheme();
  const close = () => setNavOpen(false);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setNavOpen(false);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = navOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [navOpen]);

  const links = [
    { href: '/#services', label: t.nav.services },
    { href: '/#portfolio', label: t.nav.portfolio },
    { href: '/#pricing', label: t.nav.pricing },
    { href: '/#about', label: t.nav.about },
    { href: '/#contact', label: t.nav.contact },
  ];

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-line/10 bg-bg/80 backdrop-blur-xl">
      <div className="container-site grid h-[5rem] grid-cols-[auto_1fr_auto] items-center gap-3 lg:h-[5.25rem]">
        <Link
          to="/"
          className="relative z-10 flex shrink-0 items-center gap-2.5"
          aria-label="B-Code"
          onClick={close}
        >
          <img src="/images/logo.svg" width={64} height={64} alt="" className="h-14 w-14 sm:h-16 sm:w-16" />
          <span className="font-display text-xl font-bold tracking-tight sm:text-2xl">
            {t.brand}
          </span>
        </Link>

        <nav className="nav-desktop" aria-label="Primary">
          {links.map(({ href, label }) => (
            <a key={href} href={href} className="nav-link">
              {label}
            </a>
          ))}
        </nav>

        <div className="relative z-10 flex shrink-0 items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            className="inline-flex h-9 items-center gap-1 rounded-md border border-line/15 bg-elevated/60 px-2 text-[11px] font-bold tracking-wide text-ink transition hover:border-accent/40 hover:text-accent"
            onClick={toggleLang}
            aria-label={t.a11y.toggleLang}
          >
            <Languages className="h-3.5 w-3.5 shrink-0" />
            <span className={lang === 'en' ? 'text-accent' : 'text-muted'}>EN</span>
            <span className="text-muted">/</span>
            <span className={lang === 'ar' ? 'text-accent' : 'text-muted'}>AR</span>
          </button>

          <button
            type="button"
            className="icon-btn !h-9 !w-9"
            onClick={toggleTheme}
            aria-label={t.a11y.toggleTheme}
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          <a
            href="/#contact"
            className="btn-primary hidden !h-9 !px-3.5 !py-0 whitespace-nowrap md:inline-flex"
          >
            {t.cta.quote}
          </a>

          <button
            type="button"
            className="icon-btn !h-9 !w-9 md:hidden"
            aria-label={navOpen ? t.a11y.closeMenu : t.a11y.openMenu}
            aria-expanded={navOpen}
            onClick={() => setNavOpen((v) => !v)}
          >
            {navOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {navOpen ? (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
            aria-label="Close menu"
            onClick={close}
          />
          <nav className="nav-drawer md:hidden" aria-label="Mobile">
            {links.map(({ href, label }) => (
              <a
                key={href}
                href={href}
                className="nav-link block w-full px-3 py-2.5"
                onClick={close}
              >
                {label}
              </a>
            ))}
            <a href="/#contact" className="btn-primary mt-2 w-full" onClick={close}>
              {t.cta.quote}
            </a>
          </nav>
        </>
      ) : null}
    </header>
  );
};

export default Header;
