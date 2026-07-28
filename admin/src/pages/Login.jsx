import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Eye, EyeOff, Languages, Lock, Moon, Palette, Package, Shield, Sun } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { t, lang, toggleLang, isRtl } = useLanguage();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(formData);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`relative flex min-h-screen flex-col lg:flex-row ${isRtl ? 'lg:flex-row-reverse' : ''}`}
    >
      {/* Brand panel */}
      <aside className="relative flex min-h-[46vh] flex-col justify-between overflow-hidden bg-accent px-8 py-10 text-white sm:px-12 lg:min-h-screen lg:w-[56%] lg:px-14 lg:py-12 xl:w-[58%]">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.16] mix-blend-overlay"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          }}
          aria-hidden="true"
        />

        {/* Decorative wireframe shapes — SaleSkip-style arcs + geometry */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <svg
            className="login-shape-drift absolute -bottom-[18%] -end-[22%] h-[95%] w-[95%] text-white/25"
            viewBox="0 0 600 600"
            fill="none"
          >
            <ellipse cx="320" cy="340" rx="280" ry="200" stroke="currentColor" strokeWidth="1.25" />
            <ellipse cx="320" cy="340" rx="220" ry="155" stroke="currentColor" strokeWidth="1.1" />
            <ellipse cx="320" cy="340" rx="160" ry="110" stroke="currentColor" strokeWidth="1" />
            <ellipse cx="320" cy="340" rx="100" ry="68" stroke="currentColor" strokeWidth="0.9" />
            <path
              d="M40 420 C 140 220, 280 160, 520 280"
              stroke="currentColor"
              strokeWidth="1.2"
              opacity="0.7"
            />
            <path
              d="M60 480 C 180 260, 320 180, 560 320"
              stroke="currentColor"
              strokeWidth="1"
              opacity="0.5"
            />
          </svg>

          {/* Wireframe cube */}
          <svg
            className="login-shape-spin absolute start-[8%] top-[28%] h-28 w-28 text-white/30 sm:h-36 sm:w-36 lg:h-44 lg:w-44"
            viewBox="0 0 120 120"
            fill="none"
          >
            <path
              d="M20 40 L60 18 L100 40 L100 82 L60 104 L20 82 Z"
              stroke="currentColor"
              strokeWidth="1.4"
            />
            <path d="M20 40 L60 62 L100 40" stroke="currentColor" strokeWidth="1.2" />
            <path d="M60 62 L60 104" stroke="currentColor" strokeWidth="1.2" />
          </svg>

          {/* Torus knot hint */}
          <svg
            className="login-shape-pulse absolute bottom-[22%] start-[18%] h-24 w-24 text-white/25 sm:h-32 sm:w-32"
            viewBox="0 0 100 100"
            fill="none"
          >
            <circle cx="50" cy="50" r="34" stroke="currentColor" strokeWidth="1.2" />
            <circle cx="50" cy="50" r="18" stroke="currentColor" strokeWidth="1" />
            <path
              d="M16 50 C 28 28, 72 28, 84 50 C 72 72, 28 72, 16 50"
              stroke="currentColor"
              strokeWidth="1.1"
            />
          </svg>

          <div className="login-shape-float absolute end-[12%] top-[18%] h-16 w-16 rotate-12 rounded-2xl border border-white/25 sm:h-20 sm:w-20" />
          <div className="login-shape-float-delay absolute end-[8%] top-[22%] h-10 w-10 -rotate-6 rounded-lg border border-white/20" />
        </div>

        <div className="relative z-10 flex items-center gap-3 sm:gap-4">
          <span
            className="inline-block h-14 w-14 shrink-0 bg-white sm:h-20 sm:w-20 lg:h-24 lg:w-24"
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
          <div>
            <p
              className={`text-xl font-bold tracking-tight text-white sm:text-2xl ${
                isRtl ? 'font-sans' : 'font-display'
              }`}
            >
              {t.brand}
            </p>
            <p className="mt-0.5 text-sm text-white/70">{t.admin}</p>
          </div>
        </div>

        <div className="relative z-10 my-10 max-w-lg lg:my-0">
          <h1
            className={`text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-[3.4rem] ${
              isRtl ? 'font-sans' : 'font-display tracking-tight'
            }`}
          >
            {t.auth.hello}
          </h1>
          <p className="mt-5 text-base leading-relaxed text-white/88 sm:text-lg lg:max-w-md">
            {t.auth.panelLead}
          </p>

          <div className="mt-8 flex flex-wrap gap-2">
            {[
              { icon: Package, label: t.auth.chipPackages },
              { icon: Box, label: t.auth.chipShapes },
              { icon: Palette, label: t.auth.chipTheme },
            ].map(({ icon: Icon, label }) => (
              <span
                key={label}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm"
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </span>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-sm text-white/55">{t.auth.copyright}</p>
      </aside>

      {/* Form panel */}
      <section className="relative flex flex-1 flex-col bg-elevated lg:w-[44%] xl:w-[42%]">
        <div className="absolute end-4 top-4 z-20 flex items-center gap-2 sm:end-6 sm:top-6">
          <button
            type="button"
            onClick={toggleLang}
            className="inline-flex h-9 items-center gap-1 rounded-md border border-line/15 bg-bg px-2 text-[11px] font-bold text-ink"
            aria-label={t.a11y.toggleLang}
          >
            <Languages className="h-3.5 w-3.5" />
            <span className={lang === 'en' ? 'text-accent' : 'text-muted'}>EN</span>
            <span className="text-muted">/</span>
            <span className={lang === 'ar' ? 'text-accent' : 'text-muted'}>AR</span>
          </button>
          <button type="button" onClick={toggleTheme} className="icon-btn" aria-label={t.a11y.toggleTheme}>
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </div>

        <div className="flex flex-1 flex-col justify-center px-8 py-12 sm:px-12 lg:px-14 xl:px-16">
          <div className="mb-10">
            <div className="mb-6 flex items-center gap-3">
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
              <p
                className={`text-2xl font-bold text-ink ${
                  isRtl ? 'font-sans' : 'font-display tracking-tight'
                }`}
              >
                {t.brand}
              </p>
            </div>

            <h2
              className={`text-3xl font-bold text-ink ${
                isRtl ? 'font-sans' : 'font-display tracking-tight'
              }`}
            >
              {t.auth.welcome}
            </h2>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted">
              {t.auth.noAccount}{' '}
              <span className="font-semibold text-ink underline decoration-ink/30 underline-offset-2">
                {t.auth.contactOwner}
              </span>
              {t.auth.contactOwnerHint}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="w-full max-w-md space-y-8">
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium text-ink">
                {t.auth.email}
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder={t.auth.emailPlaceholder}
                className="w-full border-0 border-b border-line/25 bg-transparent px-0 py-3 text-base text-ink outline-none transition placeholder:text-muted/50 focus:border-accent"
                required
                autoComplete="email"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-medium text-ink">
                {t.auth.password}
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder={t.auth.passwordPlaceholder}
                  className={`w-full border-0 border-b border-line/25 bg-transparent py-3 text-base text-ink outline-none transition placeholder:text-muted/50 focus:border-accent ${
                    isRtl ? 'pl-10 pr-0' : 'pl-0 pr-10'
                  }`}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute top-1/2 -translate-y-1/2 text-muted transition hover:text-accent ${
                    isRtl ? 'left-0' : 'right-0'
                  }`}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-ink px-4 py-3.5 text-sm font-semibold text-bg transition hover:opacity-90 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-bg border-t-transparent" />
                  {t.auth.loggingIn}
                </>
              ) : (
                t.auth.login
              )}
            </button>
          </form>

          <div className="mt-10 max-w-md space-y-3">
            <p className="inline-flex items-center gap-2 text-xs text-muted">
              <Shield className="h-3.5 w-3.5 text-accent" />
              {t.auth.secureNote}
            </p>
            <p className="inline-flex items-center gap-2 text-xs text-muted">
              <Lock className="h-3.5 w-3.5" />
              {t.auth.protected}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Login;
