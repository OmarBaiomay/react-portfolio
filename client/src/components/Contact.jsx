import { useLanguage } from '../context/LanguageContext';

const Contact = () => {
  const { t } = useLanguage();
  const c = t.contact;

  return (
    <section id="contact" className="section">
      <div className="container-site grid gap-12 lg:grid-cols-2 lg:gap-16">
        <div data-animate="fade-up">
          <p className="kicker">{c.kicker}</p>
          <h2 className="title">{c.title}</h2>
          <p className="lead">{c.lead}</p>

          <div className="mt-10 space-y-4 text-sm text-muted">
            <p>
              <span className="font-semibold text-ink">{c.email}:</span>{' '}
              <a href="mailto:baiomayomar@gmail.com" className="text-accent hover:brightness-110">
                baiomayomar@gmail.com
              </a>
            </p>
            <p>
              <span className="font-semibold text-ink">{c.focus}:</span> {c.focusValue}
            </p>
          </div>
        </div>

        <form
          action="https://getform.io/f/byvvyvla"
          method="POST"
          data-animate="scale-in"
          className="glass rounded-2xl p-6 md:p-8"
        >
          <input type="hidden" name="_gotcha" className="hidden" />
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="name">{c.name}</label>
              <input
                type="text"
                name="name"
                id="name"
                required
                placeholder={c.placeholderName}
                className="text-field"
              />
            </div>
            <div>
              <label htmlFor="email">{c.workEmail}</label>
              <input
                type="email"
                name="email"
                id="email"
                required
                placeholder={c.placeholderEmail}
                className="text-field"
              />
            </div>
          </div>

          <div className="mt-4">
            <label htmlFor="service">{c.need}</label>
            <select id="service" name="service" className="text-field" defaultValue="web">
              <option value="web">{c.options.web}</option>
              <option value="odoo">{c.options.odoo}</option>
              <option value="software">{c.options.software}</option>
              <option value="other">{c.options.other}</option>
            </select>
          </div>

          <div className="mt-4">
            <label htmlFor="message">{c.details}</label>
            <textarea
              name="message"
              id="message"
              required
              placeholder={c.placeholderMsg}
              className="text-field min-h-32 resize-y"
            />
          </div>

          <button type="submit" className="btn-primary mt-6 w-full">
            {t.cta.send}
          </button>
        </form>
      </div>
    </section>
  );
};

export default Contact;
