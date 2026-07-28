import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Languages, Moon, Sun, Menu, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { useScrollToSection } from '../hooks/useScrollToSection';
import BrandLogo from './BrandLogo';

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
      <div className="container-site flex h-14 items-center gap-2 sm:h-16 sm:gap-3 lg:h-[5rem] lg:gap-6 xl:h-[5.25rem]">
        <Link
          to="/"
          className="relative z-10 flex min-w-0 flex-1 items-center gap-2 sm:flex-none sm:gap-2.5"
          aria-label="B-Code"
          onClick={close}
        >
          <BrandLogo className="h-10 w-10 sm:h-12 sm:w-12 lg:h-14 lg:w-14 xl:h-16 xl:w-16" />
          <span className="font-display truncate text-base font-bold tracking-tight text-ink sm:text-xl lg:text-2xl xl:text-[1.75rem]">
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

        <div className="relative z-10 flex shrink-0 items-center justify-end gap-1 sm:gap-1.5">
          <button
            type="button"
            className="inline-flex h-9 min-w-[3.75rem] items-center justify-center gap-1 rounded-md border border-line/15 bg-elevated/60 px-1.5 text-[11px] font-bold tracking-wide text-ink transition hover:border-accent/40 hover:text-accent sm:min-w-[5.5rem] sm:px-2 lg:h-10 lg:min-w-[6.25rem] lg:px-2.5 lg:text-[13px]"
            onClick={toggleLang}
            title={t.a11y.toggleLang}
          >
            <Languages className="hidden h-3.5 w-3.5 shrink-0 sm:block lg:h-4 lg:w-4" aria-hidden="true" />
            <span className={lang === 'en' ? 'text-accent' : 'text-muted'}>EN</span>
            <span className="text-muted" aria-hidden="true">
              /
            </span>
            <span className={lang === 'ar' ? 'text-accent' : 'text-muted'}>AR</span>
          </button>

          <button
            type="button"
            className="icon-btn !h-9 !w-9 lg:!h-10 lg:!w-10"
            onClick={toggleTheme}
            aria-label={t.a11y.toggleTheme}
          >
            {isDark ? (
              <Sun className="h-4 w-4 lg:h-[1.125rem] lg:w-[1.125rem]" />
            ) : (
              <Moon className="h-4 w-4 lg:h-[1.125rem] lg:w-[1.125rem]" />
            )}
          </button>

          <a
            href="/#contact"
            className="btn-primary !hidden !h-9 !min-w-[7.5rem] !px-3.5 !py-0 whitespace-nowrap !text-sm lg:!inline-flex lg:!h-10 lg:!min-w-[9rem] lg:!px-5 lg:!text-[15px]"
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
                className="nav-link block w-full px-3 py-3 text-base"
                onClick={goToSection(id)}
              >
                {label}
              </a>
            ))}
            <a
              href="/#contact"
              className="btn-primary mt-3 w-full !py-3"
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
