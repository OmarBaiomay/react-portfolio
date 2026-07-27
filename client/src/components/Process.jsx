import { useLanguage } from '../context/LanguageContext';

const Process = () => {
  const { t } = useLanguage();

  return (
    <section id="process" className="section">
      <div className="container-site">
        <div data-animate="fade-up">
          <p className="kicker">{t.process.kicker}</p>
          <h2 className="title">{t.process.title}</h2>
          <p className="lead">{t.process.lead}</p>
        </div>

        <ol className="mt-14 grid gap-6 md:grid-cols-3" data-animate="stagger">
          {t.process.steps.map(({ step, title, text }) => (
            <li key={step} data-animate-child className="glass rounded-2xl p-6 md:p-7">
              <p className="font-display text-sm font-semibold tracking-[0.2em] text-accent">
                {step}
              </p>
              <h3 className="mt-3 font-display text-2xl font-semibold">{title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted md:text-base">{text}</p>
            </li>
          ))}
        </ol>

        <div
          data-animate="scale-in"
          className="mt-16 overflow-hidden rounded-2xl bg-[linear-gradient(120deg,rgb(var(--c-accent)),#7c2d12)] px-8 py-10 text-white md:px-12 md:py-14"
        >
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="font-display text-2xl font-semibold md:text-3xl">
                {t.process.bandTitle}
              </h3>
              <p className="mt-2 max-w-xl text-white/80">{t.process.bandLead}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href="#contact"
                className="inline-flex items-center justify-center rounded-md bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-white/90"
              >
                {t.cta.requestQuote}
              </a>
              <a
                href="#pricing"
                className="inline-flex items-center justify-center rounded-md border border-white/40 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                {t.cta.seePricing}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Process;
