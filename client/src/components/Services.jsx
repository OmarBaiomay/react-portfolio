import { Code2, Boxes, Cpu, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Services = () => {
  const { t } = useLanguage();
  const s = t.services;

  const items = [
    {
      icon: Code2,
      title: s.webTitle,
      desc: s.webDesc,
      points: s.webPoints,
      cta: s.webCta,
    },
    {
      icon: Boxes,
      title: s.odooTitle,
      desc: s.odooDesc,
      points: s.odooPoints,
      cta: s.odooCta,
    },
    {
      icon: Cpu,
      title: s.softTitle,
      desc: s.softDesc,
      points: s.softPoints,
      cta: s.softCta,
    },
  ];

  return (
    <section id="services" className="section">
      <div className="container-site">
        <div data-animate="fade-up">
          <p className="kicker">{s.kicker}</p>
          <h2 className="title">{s.title}</h2>
          <p className="lead">{s.lead}</p>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-3" data-animate="stagger">
          {items.map(({ icon: Icon, title, desc, points, cta }) => (
            <article
              key={title}
              data-animate-child
              className="glass group rounded-2xl p-6 transition hover:border-accent/40 hover:shadow-glow md:p-7"
            >
              <div className="mb-5 grid h-12 w-12 place-items-center rounded-xl bg-accent/15 text-accent">
                <Icon className="h-6 w-6" strokeWidth={1.5} />
              </div>
              <h3 className="font-display text-2xl font-semibold">{title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted md:text-base">{desc}</p>
              <ul className="mt-6 space-y-2 text-sm text-muted">
                {points.map((point) => (
                  <li key={point} className="flex gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    {point}
                  </li>
                ))}
              </ul>
              <a
                href="#contact"
                className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-accent transition group-hover:gap-3"
              >
                {cta}
                <ArrowRight className="h-4 w-4 rtl:rotate-180" />
              </a>
            </article>
          ))}
        </div>

        <div
          data-animate="scale-in"
          className="glass mt-12 flex flex-col items-start justify-between gap-6 rounded-2xl p-8 md:flex-row md:items-center md:p-10"
        >
          <div>
            <h3 className="font-display text-2xl font-semibold">{s.unsureTitle}</h3>
            <p className="mt-2 max-w-xl text-muted">{s.unsureLead}</p>
          </div>
          <a href="#contact" className="btn-primary shrink-0">
            {t.cta.consult}
          </a>
        </div>
      </div>
    </section>
  );
};

export default Services;
