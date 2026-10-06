import { ArrowRight, ArrowUpRight, MapPin } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useContent } from '../context/ContentContext';
import { contactChannels } from '../lib/socials';
import BrandLogo from './BrandLogo';

const CREDIT = {
  name: 'Omar El Bayoumi',
  href: 'https://www.linkedin.com/in/omar-albayoumi/',
};

const Footer = () => {
  const { t, lang } = useLanguage();
  const { site, sections } = useContent();
  const f = t.footer;

  const shown = new Set(sections.filter((s) => s.visible !== false).map((s) => s.id));
  const sitemap = [
    { id: 'services', label: t.nav.services, href: '/#services' },
    { id: 'portfolio', label: t.nav.portfolio, href: '/#portfolio' },
    { id: 'pricing', label: t.nav.pricing, href: '/#pricing' },
    { id: 'about', label: t.nav.about, href: '/#about' },
    { id: 'blog', label: t.nav.blog, href: '/blog' },
    { id: 'faq', label: t.faq.kicker, href: '/#faq' },
    { id: 'contact', label: t.nav.contact, href: '/#contact' },
  ].filter((link) => shown.has(link.id));

  const channels = contactChannels(site);
  const direct = channels.filter((c) => ['whatsapp', 'phone', 'email'].includes(c.key));
  const address = site.address?.[lang] || site.address?.en;

  return (
    <footer className="border-t border-line/10 bg-elevated">
      {/* CTA band */}
      <div className="container-site py-14 md:py-20">
        <div className="relative overflow-hidden rounded-3xl border border-accent/20 bg-accent/10 px-6 py-10 md:px-12 md:py-14">
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse at 100% 0%, rgb(var(--c-accent) / 0.25), transparent 60%)',
            }}
            aria-hidden="true"
          />
          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="kicker">{t.brand}</p>
              <h2 className="font-display text-3xl font-semibold text-ink md:text-5xl">
                {f.tagline}
              </h2>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a href="/#contact" className="btn-primary group !px-6 !py-3.5 text-base">
                {t.cta.start}
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5 rtl:rotate-180" />
              </a>
              {direct
                .filter((c) => c.key !== 'email')
                .map(({ key, href, Icon, external }) => (
                  <a
                    key={key}
                    href={href}
                    {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
                    className="btn-ghost !px-6 !py-3.5 text-base"
                  >
                    <Icon className="h-4 w-4" />
                    {key === 'whatsapp' ? f.whatsapp : f.call}
                  </a>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* Links */}
      <div className="container-site grid gap-12 pb-12 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <a href="/" className="inline-flex items-center gap-3">
            <BrandLogo className="h-9 w-9" />
            <span className="font-display text-lg font-semibold text-ink">{t.brand}</span>
          </a>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">
            {site.seo?.description?.[lang] || site.seo?.description?.en}
          </p>
          {channels.length ? (
            <ul className="mt-6 flex flex-wrap gap-2" aria-label={f.connect}>
              {channels.map(({ key, label, href, Icon, external }) => (
                <li key={key}>
                  <a
                    href={href}
                    aria-label={label}
                    title={label}
                    {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
                    className="grid h-10 w-10 place-items-center rounded-full border border-line/15 text-ink transition hover:-translate-y-0.5 hover:border-accent hover:bg-accent hover:text-white"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <div>
          <p className="mb-4 text-sm font-semibold text-ink">{f.sitemap}</p>
          <ul className="space-y-2.5">
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
          <p className="mb-4 text-sm font-semibold text-ink">{f.contact}</p>
          <ul className="space-y-3">
            {direct.map(({ key, label, href, Icon, external }) => (
              <li key={key}>
                <a
                  href={href}
                  {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
                  className="inline-flex items-center gap-2.5 text-sm text-muted transition hover:text-accent"
                >
                  <Icon className="h-4 w-4 shrink-0 text-accent" />
                  <span dir="ltr">{key === 'whatsapp' ? f.whatsapp : label}</span>
                </a>
              </li>
            ))}
            {address ? (
              <li className="inline-flex items-center gap-2.5 text-sm text-muted">
                <MapPin className="h-4 w-4 shrink-0 text-accent" />
                {address}
              </li>
            ) : null}
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-line/10">
        <div className="container-site flex flex-col gap-3 py-6 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} B-Code. {f.rights}
          </p>
          <p>
            {f.madeBy}{' '}
            <a
              href={CREDIT.href}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 font-semibold text-ink transition hover:text-accent"
            >
              {CREDIT.name}
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
