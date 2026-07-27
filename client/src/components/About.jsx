import { useLanguage } from '../context/LanguageContext';

const About = () => {
  const { t } = useLanguage();

  return (
    <section id="about" className="section">
      <div className="container-site grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:gap-20">
        <div data-animate="fade-up">
          <p className="kicker">{t.about.kicker}</p>
          <h2 className="title">{t.about.title}</h2>
          <p className="lead">{t.about.p1}</p>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted md:text-lg">
            {t.about.p2}
          </p>
          <a href="#contact" className="btn-primary mt-8">
            {t.cta.consult}
          </a>
        </div>

        <div className="grid gap-4 self-center" data-animate="stagger">
          {t.about.stats.map(({ value, label }) => (
            <div key={label} data-animate-child className="glass rounded-2xl p-5 md:p-6">
              <p className="font-display text-3xl font-semibold text-accent md:text-4xl">
                {value}
              </p>
              <p className="mt-1 text-sm text-muted">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
