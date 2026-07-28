export const DEFAULT_MANIFESTO = {
  kicker: {
    en: 'The craft',
    ar: 'الحرفة',
  },
  lines: [
    {
      en: 'We turn quiet ambition into **working** systems',
      ar: 'نحوّل الطموح الهادئ إلى أنظمة **تعمل**',
    },
    {
      en: 'Websites that **convert**, Odoo that **runs**, software that **fits**',
      ar: 'مواقع **تحوّل**، أودو **يعمل**، برمجيات **تناسبك**',
    },
    {
      en: 'No noise — only **clarity**, speed, and craft',
      ar: 'بلا ضجيج — فقط **وضوح** وسرعة وحرفة',
    },
    {
      en: 'From first sketch to final **ship**, we stay close',
      ar: 'من أول رسمة حتى **الإطلاق**، نبقى قريبين',
    },
    {
      en: 'Build once, **scale** with confidence',
      ar: 'ابنِ مرة، و**توسّع** بثقة',
    },
    {
      en: 'Your vision. Our **code**. Real results.',
      ar: 'رؤيتك. **تقنيتنا**. نتائج حقيقية.',
    },
  ],
};

export function normalizeManifesto(raw) {
  const source = raw && typeof raw === 'object' ? raw : {};
  const kicker =
    source.kicker && typeof source.kicker === 'object'
      ? {
          en: String(source.kicker.en || DEFAULT_MANIFESTO.kicker.en),
          ar: String(source.kicker.ar || DEFAULT_MANIFESTO.kicker.ar),
        }
      : { ...DEFAULT_MANIFESTO.kicker };

  const lines = Array.isArray(source.lines)
    ? source.lines
        .map((line) => {
          if (!line) return null;
          if (typeof line === 'string') {
            return { en: line, ar: line };
          }
          if (typeof line === 'object') {
            const en = String(line.en || '').trim();
            const ar = String(line.ar || '').trim();
            if (!en && !ar) return null;
            return { en: en || ar, ar: ar || en };
          }
          return null;
        })
        .filter(Boolean)
    : [];

  return {
    kicker,
    lines: lines.length ? lines : DEFAULT_MANIFESTO.lines.map((l) => ({ ...l })),
  };
}
