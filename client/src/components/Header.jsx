import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Languages, Moon, Sun, Menu, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { useScrollToSection } from '../hooks/useScrollToSection';

const Header = () => {
  const [navOpen, setNavOpen] = useState(false);
  const { t, lang, toggleLang } = useLanguage();
  const { isDark, toggleTheme } = useTheme();
  const scrollToSection = useScrollToSection();
  const navigate = useNavigate();
  const location = useLocation();
  const close = () => setNavOpen(false);

  const goToSection = (id) => (event) => {
    event.preventDefault();
    close();
    if (location.pathname !== '/') {
      navigate(`/#${id}`);
      return;
    }
    scrollToSection(id);
    window.history.replaceState(null, '', `/#${id}`);
  };

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) setNavOpen(false);
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
    { id: 'services', label: t.nav.services },
    { id: 'portfolio', label: t.nav.portfolio },
    { id: 'pricing', label: t.nav.pricing },
    { id: 'about', label: t.nav.about },
    { id: 'contact', label: t.nav.contact },
  ];

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-line/10 bg-bg/85 backdrop-blur-xl">
      <div className="container-site flex h-16 items-center gap-3 sm:h-[4.25rem] lg:h-[4.5rem] lg:gap-6">
        <Link
          to="/"
          className="relative z-10 flex min-w-0 shrink-0 items-center gap-2.5"
          aria-label="B-Code"
          onClick={close}
        >
          <img
            src="/images/logo.svg"
            width={56}
            height={56}
            alt=""
            className="h-11 w-11 shrink-0 sm:h-12 sm:w-12 lg:h-14 lg:w-14"
          />
          <span className="truncate font-display text-lg font-bold tracking-tight sm:text-xl lg:text-2xl">
            {t.brand}
          </span>
        </Link>

        <nav className="nav-desktop" aria-label="Primary">
          {links.map(({ id, label }) => (
            <a key={id} href={`/#${id}`} className="nav-link" onClick={goToSection(id)}>
              {label}
            </a>
          ))}
        </nav>

        <div className="relative z-10 ms-auto flex shrink-0 items-center gap-1 sm:gap-1.5">
          <button
            type="button"
            className="inline-flex h-9 items-center gap-1 rounded-md border border-line/15 bg-elevated/60 px-2 text-[11px] font-bold tracking-wide text-ink transition hover:border-accent/40 hover:text-accent"
            onClick={toggleLang}
            aria-label={t.a11y.toggleLang}
          >
            <Languages className="hidden h-3.5 w-3.5 shrink-0 sm:block" />
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

          {/* Desktop only — never show quote CTA in the mobile bar */}
          <a
            href="/#contact"
            className="btn-primary !hidden !h-9 !px-3.5 !py-0 whitespace-nowrap lg:!inline-flex"
            onClick={goToSection('contact')}
          >
            {t.cta.quote}
          </a>

          <button
            type="button"
            className="icon-btn !h-9 !w-9 lg:!hidden"
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
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            aria-label="Close menu"
            onClick={close}
          />
          <nav className="nav-drawer lg:hidden" aria-label="Mobile">
            {links.map(({ id, label }) => (
              <a
                key={id}
                href={`/#${id}`}
                className="nav-link block w-full px-3 py-2.5"
                onClick={goToSection(id)}
              >
                {label}
              </a>
            ))}
            <a
              href="/#contact"
              className="btn-primary mt-2 w-full"
              onClick={goToSection('contact')}
            >
              {t.cta.quote}
            </a>
          </nav>
        </>
      ) : null}
    </header>
  );
};

export default Header;
