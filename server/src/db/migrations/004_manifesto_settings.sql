INSERT INTO site_settings (key, value)
VALUES (
  'manifesto',
  '{
    "kicker": {"en":"The craft","ar":"الحرفة"},
    "lines": [
      {"en":"We turn quiet ambition into **working** systems","ar":"نحوّل الطموح الهادئ إلى أنظمة **تعمل**"},
      {"en":"Websites that **convert**, Odoo that **runs**, software that **fits**","ar":"مواقع **تحوّل**، أودو **يعمل**، برمجيات **تناسبك**"},
      {"en":"No noise — only **clarity**, speed, and craft","ar":"بلا ضجيج — فقط **وضوح** وسرعة وحرفة"},
      {"en":"From first sketch to final **ship**, we stay close","ar":"من أول رسمة حتى **الإطلاق**، نبقى قريبين"},
      {"en":"Build once, **scale** with confidence","ar":"ابنِ مرة، و**توسّع** بثقة"},
      {"en":"Your vision. Our **code**. Real results.","ar":"رؤيتك. **تقنيتنا**. نتائج حقيقية."}
    ]
  }'::jsonb
)
ON CONFLICT (key) DO NOTHING;
