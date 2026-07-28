import { useEffect, useState } from 'react';
import { Check, Crown, Shield, Rocket, ShoppingBag, Wrench } from 'lucide-react';
import { publicAPI } from '../services/frontendApi';
import { useLanguage } from '../context/LanguageContext';
import { pickLocalized, pickLocalizedList } from '../lib/i18nContent';

const iconMap = {
  rocket: Rocket,
  crown: Crown,
  shield: Shield,
  store: ShoppingBag,
  wrench: Wrench,
};

function Pricing() {
  const { t, lang } = useLanguage();
  const [packages, setPackages] = useState([]);
  const [maintenancePlans, setMaintenancePlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPricingData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [packagesRes, maintenanceRes] = await Promise.all([
        publicAPI.getPackages(),
        publicAPI.getMaintenancePlans(),
      ]);
      const nextPackages = packagesRes?.data;
      const nextPlans = maintenanceRes?.data;
      setPackages(Array.isArray(nextPackages) ? nextPackages : []);
      setMaintenancePlans(Array.isArray(nextPlans) ? nextPlans : []);
      if (!Array.isArray(nextPackages)) {
        setError(t.pricing.error);
      }
    } catch (err) {
      setPackages([]);
      setMaintenancePlans([]);
      setError(err.response?.data?.message || t.pricing.error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPricingData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <section id="pricing" className="section">
        <div className="container-site text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-accent border-t-transparent" />
          <p className="text-muted">{t.pricing.loading}</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="pricing" className="section">
        <div className="container-site text-center">
          <p className="mb-4 text-red-500">{error}</p>
          <button type="button" onClick={fetchPricingData} className="btn-primary">
            {t.cta.tryAgain}
          </button>
        </div>
      </section>
    );
  }

  return (
    <section id="pricing" className="section bg-elevated/30">
      <div className="container-site">
        <div data-animate="fade-up">
          <p className="kicker">{t.pricing.kicker}</p>
          <h2 className="title">{t.pricing.title}</h2>
          <p className="lead">{t.pricing.lead}</p>
        </div>

        <h3 className="mt-14 font-display text-xl font-semibold md:text-2xl" data-animate="fade-up">
          {t.pricing.website}
        </h3>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4" data-animate="stagger">
          {packages.map((pkg) => {
            const Icon = iconMap[pkg.icon] || Rocket;
            const name = pickLocalized(pkg.name, lang);
            const title = pickLocalized(pkg.title, lang);
            const subtitle = pickLocalized(pkg.subtitle, lang);
            const delivery = pickLocalized(pkg.delivery, lang);
            const features = pickLocalizedList(pkg.features, lang);
            return (
              <article
                key={pkg._id || pkg.id}
                data-animate-child
                className={`glass flex flex-col rounded-2xl p-6 transition hover:border-accent/40 ${
                  pkg.featured ? 'shadow-glow ring-1 ring-accent/50' : ''
                }`}
              >
                {pkg.featured ? (
                  <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-accent">
                    {t.pricing.mostChosen}
                  </p>
                ) : null}
                <Icon className="mb-4 h-7 w-7 text-accent" strokeWidth={1.5} />
                <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                  {name}
                </p>
                <h4 className="mt-1 font-display text-xl font-semibold">{title}</h4>
                <p className="mt-2 text-sm text-muted">{subtitle}</p>
                <p className="mt-5 font-display text-2xl font-semibold">${pkg.priceUSD}</p>
                <p className="text-sm text-muted">{pkg.priceEGP}</p>
                <p className="mt-2 text-xs text-muted">
                  {t.pricing.delivery}: {delivery}
                </p>
                <ul className="mt-5 flex-1 space-y-2">
                  {features.map((feature) => (
                    <li key={feature} className="flex gap-2 text-sm text-muted">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <a href="#contact" className="btn-primary mt-6 w-full">
                  {t.cta.choose}
                </a>
              </article>
            );
          })}
        </div>

        {maintenancePlans.length > 0 ? (
          <>
            <h3
              className="mt-16 font-display text-xl font-semibold md:text-2xl"
              data-animate="fade-up"
            >
              {t.pricing.maintenance}
            </h3>
            <div className="mt-8 grid gap-5 md:grid-cols-2" data-animate="stagger">
              {maintenancePlans.map((plan) => {
                const name = pickLocalized(plan.name, lang);
                const features = pickLocalizedList(plan.features, lang);
                return (
                <article
                  key={plan._id || plan.id}
                  data-animate-child
                  className="glass rounded-2xl p-6 md:p-8"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <Wrench className="mb-3 h-6 w-6 text-accent" strokeWidth={1.5} />
                      <h4 className="font-display text-xl font-semibold">{name}</h4>
                    </div>
                    <div className="text-end">
                      <p className="font-display text-2xl font-semibold">${plan.priceUSD}</p>
                      <p className="text-sm text-muted">{plan.priceEGP}</p>
                    </div>
                  </div>
                  <ul className="mt-5 space-y-2">
                    {features.map((feature) => (
                      <li key={feature} className="flex gap-2 text-sm text-muted">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <a href="#contact" className="btn-ghost mt-6">
                    {t.cta.maintenance}
                  </a>
                </article>
              );
              })}
            </div>
          </>
        ) : null}

        <p className="mt-10 text-center text-sm text-muted" data-animate="fade-up">
          {t.pricing.odooNote}{' '}
          <a href="#contact" className="font-semibold text-accent hover:brightness-110">
            {t.cta.tailored}
          </a>
        </p>
      </div>
    </section>
  );
}

export default Pricing;
