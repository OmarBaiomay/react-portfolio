import { useLanguage } from '../context/LanguageContext';

const Footer = () => {
  const { t } = useLanguage();

  const sitemap = [
    { label: t.nav.services, href: '/#services' },
    { label: t.nav.portfolio, href: '/#portfolio' },
    { label: t.nav.pricing, href: '/#pricing' },
    { label: t.nav.about, href: '/#about' },
    { label: t.nav.contact, href: '/#contact' },
  ];

  const socials = [
    { label: 'GitHub', href: 'https://github.com/OmarBaiomay' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/omar-albayoumi/' },
  ];

  return (
    <footer className="border-t border-line/10 bg-elevated">
      <div className="container-site py-16 md:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr]" data-animate="fade-up">
          <div>
            <p className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-accent">
              {t.brand}
            </p>
            <h2 className="mt-4 max-w-lg font-display text-3xl font-semibold md:text-4xl">
              {t.footer.tagline}
            </h2>
            <a href="/#contact" className="btn-primary mt-8">
              {t.cta.start}
            </a>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div>
              <p className="mb-3 text-sm font-semibold">{t.footer.sitemap}</p>
              <ul className="space-y-2">
                {sitemap.map(({ label, href }) => (
                  <li key={href}>
                    <a href={href} className="text-sm text-muted transition hover:text-accent">
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-3 text-sm font-semibold">{t.footer.connect}</p>
              <ul className="space-y-2">
                {socials.map(({ label, href }) => (
                  <li key={href}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-muted transition hover:text-accent"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-line/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <a href="#home" className="flex items-center gap-3">
            <img src="/images/logo.svg" width={32} height={32} alt="" className="h-8 w-8" />
            <span className="font-display font-semibold">{t.brand}</span>
          </a>
          <p className="text-sm text-muted">
            © {new Date().getFullYear()} B-Code. {t.footer.rights}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
