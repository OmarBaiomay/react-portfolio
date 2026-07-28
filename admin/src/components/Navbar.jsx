import { User, LogOut, Moon, Sun, Menu, X, Languages } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { useState } from 'react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { toggleTheme, isDark } = useTheme();
  const { t, lang, toggleLang } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="z-50 shrink-0 border-b border-line/10 bg-elevated/90 px-4 py-3 shadow-sm backdrop-blur-xl md:px-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <span
            className="brand-logo-mask inline-block h-9 w-9 shrink-0 bg-ink"
            style={{
              WebkitMaskImage: 'url(/images/logo.svg)',
              maskImage: 'url(/images/logo.svg)',
              WebkitMaskSize: 'contain',
              maskSize: 'contain',
              WebkitMaskRepeat: 'no-repeat',
              maskRepeat: 'no-repeat',
              WebkitMaskPosition: 'center',
              maskPosition: 'center',
            }}
            aria-hidden="true"
          />
          <div className="min-w-0">
            <h1 className="font-display text-lg font-bold tracking-tight text-accent md:text-xl">
              {t.brand}
            </h1>
            <p className="truncate text-xs text-muted">{t.admin}</p>
          </div>
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <button
            type="button"
            onClick={toggleLang}
            className="inline-flex h-9 items-center gap-1 rounded-md border border-line/15 bg-surface px-2 text-[11px] font-bold tracking-wide text-ink transition hover:border-accent/40 hover:text-accent"
            aria-label={t.a11y.toggleLang}
          >
            <Languages className="h-3.5 w-3.5" />
            <span className={lang === 'en' ? 'text-accent' : 'text-muted'}>EN</span>
            <span className="text-muted">/</span>
            <span className={lang === 'ar' ? 'text-accent' : 'text-muted'}>AR</span>
          </button>

          <button
            type="button"
            onClick={toggleTheme}
            className="icon-btn"
            aria-label={t.a11y.toggleTheme}
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          <Link
            to="/settings"
            className="flex items-center gap-3 rounded-lg px-1 py-1 ps-1 transition hover:bg-surface"
          >
            <div className="grid h-10 w-10 place-items-center rounded-full bg-accent/15">
              <User className="h-5 w-5 text-accent" />
            </div>
            <div className="hidden lg:block">
              <p className="text-sm font-medium text-ink">{user?.fullName}</p>
              <p className="text-xs text-muted">{user?.email}</p>
            </div>
          </Link>

          <button type="button" onClick={logout} className="btn-ghost !py-2 text-sm">
            <LogOut className="h-4 w-4" />
            <span className="hidden lg:inline">{t.logout}</span>
          </button>
        </div>

        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="icon-btn md:hidden"
          aria-label={mobileMenuOpen ? t.a11y.closeMenu : t.a11y.openMenu}
        >
          {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      {mobileMenuOpen ? (
        <div className="mt-3 space-y-2 border-t border-line/10 pt-3 md:hidden">
          <Link
            to="/settings"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 rounded-lg bg-surface p-3"
          >
            <div className="grid h-10 w-10 place-items-center rounded-full bg-accent/15">
              <User className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-sm font-medium text-ink">{user?.fullName}</p>
              <p className="text-xs text-muted">{user?.email}</p>
            </div>
          </Link>

          <button
            type="button"
            onClick={toggleLang}
            className="flex w-full items-center gap-3 rounded-lg bg-surface px-4 py-3 text-ink"
          >
            <Languages className="h-5 w-5 text-accent" />
            <span>EN / AR</span>
          </button>

          <button
            type="button"
            onClick={toggleTheme}
            className="flex w-full items-center gap-3 rounded-lg bg-surface px-4 py-3 text-ink"
          >
            {isDark ? <Sun className="h-5 w-5 text-accent" /> : <Moon className="h-5 w-5 text-accent" />}
            <span>{isDark ? t.theme.light : t.theme.dark}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              logout();
              setMobileMenuOpen(false);
            }}
            className="flex w-full items-center gap-3 rounded-lg bg-red-500/10 px-4 py-3 text-red-500"
          >
            <LogOut className="h-5 w-5" />
            <span>{t.logout}</span>
          </button>
        </div>
      ) : null}
    </nav>
  );
};

export default Navbar;
