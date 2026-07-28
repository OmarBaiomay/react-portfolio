import { useEffect, useState } from 'react';
import { MessageCircle, Clock, Send, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { publicAPI } from '../services/frontendApi';
import PhoneField, { isValidPhoneNumber } from './PhoneField';

const Contact = () => {
  const { t } = useLanguage();
  const c = t.contact;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [sameAsPhone, setSameAsPhone] = useState(true);
  const [service, setService] = useState('web');
  const [message, setMessage] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    if (sameAsPhone) setWhatsapp(phone);
  }, [sameAsPhone, phone]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);

    const wa = sameAsPhone ? phone : whatsapp;

    if (
      !name.trim() ||
      !email.trim() ||
      !phone ||
      !wa ||
      !message.trim() ||
      !isValidPhoneNumber(phone) ||
      (!sameAsPhone && !isValidPhoneNumber(wa))
    ) {
      setStatus('error');
      return;
    }

    setSubmitting(true);
    try {
      await publicAPI.createLead({
        name: name.trim(),
        email: email.trim(),
        phone,
        whatsapp: wa,
        whatsappSameAsPhone: sameAsPhone,
        service,
        message: message.trim(),
        _gotcha: honeypot,
      });
      setStatus('success');
      setName('');
      setEmail('');
      setPhone('');
      setWhatsapp('');
      setSameAsPhone(true);
      setService('web');
      setMessage('');
    } catch (err) {
      console.error(err);
      setStatus('error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="section relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_80%_20%,rgb(var(--c-accent)/0.18),transparent_50%),radial-gradient(ellipse_at_10%_80%,rgb(var(--c-accent)/0.1),transparent_45%)]"
        aria-hidden="true"
      />
      <div
        className="contact-orb contact-orb--a pointer-events-none absolute -start-24 top-10 h-72 w-72 rounded-full bg-accent/20 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="contact-orb contact-orb--b pointer-events-none absolute -end-16 bottom-0 h-64 w-64 rounded-full bg-accent/15 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035] bg-grid-fade bg-[size:28px_28px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]"
        aria-hidden="true"
      />

      <div className="container-site relative grid gap-12 lg:grid-cols-2 lg:gap-16 lg:items-center">
        <div data-animate="fade-up" className="relative">
          <p className="kicker">{c.kicker}</p>
          <h2 className="title">{c.title}</h2>
          <p className="lead">{c.lead}</p>

          <div
            className="mt-8 inline-flex items-center gap-2.5 rounded-xl border border-accent/25 bg-accent/10 px-3.5 py-2 text-sm text-accent"
            data-animate="scale-in"
          >
            <span className="relative flex h-2 w-2">
              <span className="contact-pulse absolute inline-flex h-full w-full rounded-full bg-accent opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            <Clock className="h-3.5 w-3.5 shrink-0" strokeWidth={2} />
            <span className="font-medium">{c.replyTime}</span>
          </div>

          <div className="mt-8 space-y-3" data-animate="stagger">
            <div
              data-animate-child
              className="flex items-start gap-4 rounded-2xl border border-line/10 bg-elevated/40 p-4"
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-accent/15 text-accent">
                <Sparkles className="h-5 w-5" strokeWidth={1.5} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted">{c.focus}</p>
                <div className="mt-2.5 flex flex-wrap gap-2">
                  {(c.focusTags || []).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md border border-line/10 bg-surface/80 px-2.5 py-1 text-xs font-medium text-ink transition hover:border-accent/40 hover:text-accent"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          data-animate="scale-in"
          className="contact-form group/form relative z-10 overflow-visible rounded-2xl border border-line/10 bg-elevated/80 p-6 shadow-card backdrop-blur-xl transition hover:border-accent/30 hover:shadow-glow md:p-8"
          noValidate
        >
          <div
            className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent opacity-70"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition duration-500 group-hover/form:opacity-100 bg-[radial-gradient(ellipse_at_top,rgb(var(--c-accent)/0.12),transparent_55%)]"
            aria-hidden="true"
          />

          <input
            type="text"
            name="_gotcha"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            className="hidden"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
          />

          <div className="relative space-y-5">
            <div className="mb-1 flex items-center gap-2 text-accent">
              <MessageCircle className="h-4 w-4" strokeWidth={1.75} />
              <p className="text-xs font-semibold uppercase tracking-[0.18em]">{c.formEyebrow}</p>
            </div>

            <div>
              <label htmlFor="name" className="mb-1.5 block">
                {c.name}
              </label>
              <input
                type="text"
                id="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={c.placeholderName}
                className="text-field h-12 !py-0"
              />
            </div>

            <PhoneField
              id="phone"
              label={c.phone}
              value={phone}
              onChange={setPhone}
              placeholder={c.placeholderPhone}
              required
            />

            <label className="flex cursor-pointer items-start gap-2.5 rounded-xl border border-transparent px-1 py-1.5 text-sm leading-snug text-ink transition hover:border-line/10 hover:bg-surface/60">
              <input
                type="checkbox"
                checked={sameAsPhone}
                onChange={(e) => setSameAsPhone(e.target.checked)}
                className="mt-0.5 h-4 w-4 shrink-0 rounded border-line/30 accent-[rgb(var(--c-accent))]"
              />
              <span className="inline-flex items-start gap-2">
                <MessageCircle className="mt-0.5 h-4 w-4 shrink-0 text-accent" strokeWidth={1.75} />
                <span>{c.whatsappSame}</span>
              </span>
            </label>

            {!sameAsPhone ? (
              <PhoneField
                id="whatsapp"
                label={c.whatsapp}
                value={whatsapp}
                onChange={setWhatsapp}
                placeholder={c.placeholderWhatsapp}
                required
              />
            ) : null}

            <div>
              <label htmlFor="email" className="mb-1.5 block">
                {c.workEmail}
              </label>
              <input
                type="email"
                id="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={c.placeholderEmail}
                className="text-field h-12 !py-0"
              />
            </div>

            <div>
              <label htmlFor="service" className="mb-1.5 block">
                {c.need}
              </label>
              <select
                id="service"
                value={service}
                onChange={(e) => setService(e.target.value)}
                className="text-field h-12 !py-0"
              >
                <option value="web">{c.options.web}</option>
                <option value="odoo">{c.options.odoo}</option>
                <option value="software">{c.options.software}</option>
                <option value="other">{c.options.other}</option>
              </select>
            </div>

            <div>
              <label htmlFor="message" className="mb-1.5 block">
                {c.details}
              </label>
              <textarea
                id="message"
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={c.placeholderMsg}
                className="text-field min-h-32 resize-y"
              />
            </div>

            {status === 'success' ? (
              <p className="rounded-lg border border-accent/30 bg-accent/10 px-3 py-2 text-sm text-accent">
                {c.success}
              </p>
            ) : null}
            {status === 'error' ? (
              <p className="rounded-lg border border-red-400/30 bg-red-400/10 px-3 py-2 text-sm text-red-400">
                {c.error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={submitting}
              className="btn-primary group/btn w-full disabled:opacity-60"
            >
              <span>{submitting ? c.sending : t.cta.send}</span>
              {!submitting ? (
                <Send className="h-4 w-4 transition group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 rtl:group-hover/btn:-translate-x-0.5" />
              ) : null}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Contact;
