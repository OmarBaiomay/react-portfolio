import {
  Building2,
  Truck,
  ShoppingBag,
  GraduationCap,
  HeartPulse,
  Landmark,
  Factory,
  Briefcase,
  ArrowUpRight,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { industries } from '../data/industries';

const iconMap = {
  Building2,
  Truck,
  ShoppingBag,
  GraduationCap,
  HeartPulse,
  Landmark,
  Factory,
  Briefcase,
};

const Industries = () => {
  const { t, lang } = useLanguage();

  return (
    <section id="industries" className="section relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 opacity-30 bg-[radial-gradient(ellipse_at_top,rgb(var(--c-accent)/0.2),transparent_55%)]"
        aria-hidden="true"
      />

      <div className="container-site relative">
        <div
          className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between"
          data-animate="fade-up"
        >
          <div className="max-w-2xl">
            <p className="kicker">{t.industries.kicker}</p>
            <h2 className="title">{t.industries.title}</h2>
            <p className="lead">{t.industries.lead}</p>
          </div>
          <a href="/#contact" className="btn-ghost shrink-0">
            {t.cta.quote}
          </a>
        </div>

        <div
          className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4"
          data-animate="stagger"
        >
          {industries.map((item) => {
            const Icon = iconMap[item.icon] || Briefcase;
            return (
              <a
                key={item.id}
                href="/#contact"
                data-animate-child
                className="group relative overflow-hidden rounded-2xl border border-line/10 bg-elevated/50 p-4 transition hover:-translate-y-1 hover:border-accent/50 hover:shadow-glow sm:p-5"
              >
                <div className="absolute inset-0 opacity-0 transition group-hover:opacity-100 bg-[linear-gradient(145deg,rgb(var(--c-accent)/0.16),transparent_55%)]" />
                <div className="relative z-10">
                  <div className="mb-4 flex items-start justify-between gap-2">
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent/15 text-accent transition group-hover:bg-accent group-hover:text-white">
                      <Icon className="h-5 w-5" strokeWidth={1.5} />
                    </span>
                    <ArrowUpRight className="h-4 w-4 text-muted opacity-0 transition group-hover:opacity-100 group-hover:text-accent" />
                  </div>
                  <h3 className="font-display text-base font-semibold sm:text-lg">
                    {item.title[lang]}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-muted sm:text-sm">
                    {item.blurb[lang]}
                  </p>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Industries;
