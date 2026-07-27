import { useLanguage } from '../context/LanguageContext';

const Testimonials = () => {
  const { t } = useLanguage();

  return (
    <section id="testimonials" className="section bg-elevated/30">
      <div className="container-site">
        <div data-animate="fade-up" className="text-center">
          <p className="kicker">{t.testimonials.kicker}</p>
          <h2 className="title mx-auto">{t.testimonials.title}</h2>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3" data-animate="stagger">
          {t.testimonials.items.map((item, index) => (
            <article
              key={item.name}
              data-animate-child
              className={`rounded-2xl p-6 md:p-7 ${
                index === 1
                  ? 'bg-accent text-white shadow-glow'
                  : 'glass'
              }`}
            >
              <p
                className={`text-base leading-relaxed md:text-lg ${
                  index === 1 ? 'text-white/95' : 'text-muted'
                }`}
              >
                “{item.quote}”
              </p>
              <div className="mt-6">
                <p className="font-display font-semibold">{item.name}</p>
                <p className={`text-sm ${index === 1 ? 'text-white/70' : 'text-muted'}`}>
                  {item.role}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
