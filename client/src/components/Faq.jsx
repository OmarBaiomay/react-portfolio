import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { faqs } from '../data/faqs';

const Faq = () => {
  const { t, lang } = useLanguage();
  const [open, setOpen] = useState(0);
  const copy = t.faq;

  return (
    <section id="faq" className="section border-t border-line/5" aria-labelledby="faq-heading">
      <div className="container-site max-w-3xl">
        <div data-animate="fade-up" className="text-center md:text-start">
          <p className="kicker">{copy.kicker}</p>
          <h2 id="faq-heading" className="title">
            {copy.title}
          </h2>
          <p className="lead mx-auto md:mx-0">{copy.lead}</p>
        </div>

        <div className="mt-10 space-y-2" itemScope itemType="https://schema.org/FAQPage">
          {faqs.map((item, index) => {
            const isOpen = open === index;
            const question = item.q[lang] || item.q.en;
            const answer = item.a[lang] || item.a.en;
            return (
              <div
                key={item.q.en}
                data-animate="fade-up"
                className="rounded-xl border border-line/10 bg-elevated/40"
                itemScope
                itemProp="mainEntity"
                itemType="https://schema.org/Question"
              >
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-4 px-4 py-4 text-start md:px-5"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? -1 : index)}
                >
                  <span className="text-sm font-semibold text-ink md:text-base" itemProp="name">
                    {question}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-muted transition ${isOpen ? 'rotate-180 text-accent' : ''}`}
                  />
                </button>
                <div
                  className={`grid transition-[grid-template-rows] duration-300 ${
                    isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                  }`}
                  itemScope
                  itemProp="acceptedAnswer"
                  itemType="https://schema.org/Answer"
                >
                  <div className="overflow-hidden">
                    <p
                      className="border-t border-line/10 px-4 pb-4 pt-3 text-sm leading-relaxed text-muted md:px-5 md:text-[15px]"
                      itemProp="text"
                    >
                      {answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Faq;
