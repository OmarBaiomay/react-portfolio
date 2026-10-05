/**
 * Service detail pages at /services/<slug>. `id` links projects (project.services) to a service.
 * `icon` is a lucide icon name. Bodies are Markdown. Edit in the dashboard → Services.
 */
export const services = [
  {
    id: 'web',
    slug: 'web-development',
    icon: 'Code2',
    image: '/images/services/web-development.webp',
    title: { en: 'Web Development', ar: 'تطوير المواقع والتطبيقات' },
    tagline: {
      en: 'Fast, bilingual websites and web apps that turn visitors into enquiries.',
      ar: 'مواقع وتطبيقات ويب سريعة ثنائية اللغة تحوّل الزوار إلى طلبات تواصل.',
    },
    highlights: {
      en: ['Company websites & landing pages', 'Web apps, portals & dashboards', 'WordPress, React & headless builds', 'Arabic RTL + English', 'SEO, speed & analytics', 'Hosting, SSL & maintenance'],
      ar: ['مواقع الشركات وصفحات الهبوط', 'تطبيقات ويب وبوابات ولوحات تحكم', 'ووردبريس وReact ومواقع حديثة', 'العربية من اليمين لليسار + الإنجليزية', 'تحسين محركات البحث والسرعة والتحليلات', 'الاستضافة وشهادات SSL والصيانة'],
    },
    body: {
      en: `Your website is often the first conversation a client has with your company. We design and build sites that explain what you do in seconds, load fast on any phone, and make it easy to get in touch.

## What we build

- **Company websites** that present your services, projects and team with confidence.
- **Landing pages** for campaigns, built to convert ad traffic into leads.
- **Web apps and portals** — booking systems, customer areas, dashboards and internal tools.
- **Content-managed sites** on WordPress or a custom dashboard, so your team can update pages without a developer.

## How we work

1. **Discovery** — your goals, audience, and the one action every visitor should take.
2. **Design** — structure and visual design for desktop and mobile, in Arabic and English.
3. **Build** — clean, fast code with SEO, analytics and WhatsApp/contact integrations.
4. **Launch & care** — hosting, SSL, backups and ongoing improvements.

Every site we deliver is bilingual by design, mobile-first, and ready for search engines from day one.`,
      ar: `غالباً ما يكون موقعك أول حديث بين العميل وشركتك. نصمم ونبني مواقع تشرح ما تقدمه خلال ثوانٍ، وتُحمَّل بسرعة على أي جوال، وتجعل التواصل معك سهلاً.

## ما نبنيه

- **مواقع الشركات** التي تعرض خدماتك ومشاريعك وفريقك بثقة.
- **صفحات الهبوط** للحملات، مصممة لتحويل زوار الإعلانات إلى عملاء محتملين.
- **تطبيقات الويب والبوابات** — أنظمة الحجز ومناطق العملاء ولوحات التحكم والأدوات الداخلية.
- **مواقع بلوحة تحكم** على ووردبريس أو لوحة مخصصة، ليحدّث فريقك الصفحات دون مطوّر.

## طريقة عملنا

1. **الاستكشاف** — أهدافك وجمهورك، والإجراء الأهم الذي يجب أن يتخذه كل زائر.
2. **التصميم** — الهيكل والتصميم المرئي للحاسوب والجوال بالعربية والإنجليزية.
3. **التطوير** — كود نظيف وسريع مع تحسين محركات البحث والتحليلات وربط واتساب ونماذج التواصل.
4. **الإطلاق والرعاية** — الاستضافة وشهادات SSL والنسخ الاحتياطي والتحسين المستمر.

كل موقع نسلّمه ثنائي اللغة منذ التصميم، ومصمم للجوال أولاً، وجاهز لمحركات البحث من اليوم الأول.`,
    },
  },
  {
    id: 'odoo',
    slug: 'odoo-development',
    icon: 'Boxes',
    image: '/images/services/odoo-development.webp',
    title: { en: 'Odoo Development', ar: 'تطوير أنظمة أودو' },
    tagline: {
      en: 'Odoo ERP implemented, customized and integrated around how your company really works.',
      ar: 'تطبيق نظام أودو وتخصيصه وربطه بما يناسب طريقة عمل شركتك الفعلية.',
    },
    highlights: {
      en: ['Implementation & configuration', 'Custom modules & workflows', 'ZATCA e-invoicing', 'Integrations (e-commerce, payments, shipping)', 'Data migration & upgrades', 'Training & support'],
      ar: ['التطبيق والإعداد', 'وحدات وسير عمل مخصصة', 'الفوترة الإلكترونية (زاتكا)', 'التكامل مع المتاجر والدفع والشحن', 'نقل البيانات والترقيات', 'التدريب والدعم'],
    },
    body: {
      en: `Odoo brings accounting, sales, inventory, purchasing, HR, projects and your website into one system. We make it fit your business — without turning it into something hard to maintain.

## What we deliver

- **Implementation** — discovery, process mapping, configuration and go-live.
- **Customization** — custom modules, fields, reports and approval workflows where standard features fall short.
- **Integrations** — online stores, payment gateways, shipping companies, attendance devices and government portals, including **ZATCA e-invoicing** in Saudi Arabia.
- **Odoo websites** — bilingual company sites built directly on Odoo, edited by your team.
- **Migration & upgrades** — clean data migration and safe version upgrades.

## Our approach

We configure first and customize only where it creates real value. Custom code lives in separate, documented modules so upgrades stay smooth. Read more in our guide: [Configure or customize?](/blog/odoo-configure-vs-customize)`,
      ar: `يجمع أودو المحاسبة والمبيعات والمخزون والمشتريات والموارد البشرية والمشاريع وموقعك الإلكتروني في نظام واحد. نجعله يناسب عملك — دون أن يتحول إلى نظام صعب الصيانة.

## ما نقدمه

- **التطبيق** — الاستكشاف ورسم العمليات والإعداد والإطلاق.
- **التخصيص** — وحدات وحقول وتقارير وسير موافقات مخصصة حيث لا تكفي الميزات القياسية.
- **التكامل** — المتاجر الإلكترونية وبوابات الدفع وشركات الشحن وأجهزة الحضور والمنصات الحكومية، بما فيها **الفوترة الإلكترونية من زاتكا** في السعودية.
- **مواقع أودو** — مواقع شركات ثنائية اللغة مبنية مباشرة على أودو ويحررها فريقك.
- **النقل والترقيات** — نقل نظيف للبيانات وترقيات آمنة للإصدارات.

## منهجنا

نبدأ بالإعداد ولا نخصّص إلا حيث يصنع التخصيص قيمة حقيقية. ويبقى الكود المخصص في وحدات منفصلة وموثّقة لتبقى الترقيات سلسة. اقرأ المزيد في دليلنا: [الإعداد أم التخصيص؟](/blog/odoo-configure-vs-customize)`,
    },
  },
  {
    id: 'software',
    slug: 'custom-software',
    icon: 'Cpu',
    image: '/images/services/custom-software.webp',
    title: { en: 'Custom Software', ar: 'البرمجيات المخصصة' },
    tagline: {
      en: 'SaaS products, desktop apps and internal systems built around your process.',
      ar: 'منتجات SaaS وتطبيقات سطح مكتب وأنظمة داخلية مبنية حول طريقة عملك.',
    },
    highlights: {
      en: ['SaaS & multi-tenant platforms', 'Desktop apps (Windows)', 'PWAs that work offline', 'POS & booking systems', 'Dashboards & automation', 'Ongoing product support'],
      ar: ['منصات SaaS متعددة المستأجرين', 'تطبيقات سطح مكتب (ويندوز)', 'تطبيقات ويب تعمل دون اتصال', 'أنظمة نقاط البيع والحجز', 'لوحات تحكم وأتمتة', 'دعم مستمر للمنتج'],
    },
    body: {
      en: `When off-the-shelf tools don't fit, we build software around your process — from internal tools to full SaaS products used by many businesses.

## What we build

- **SaaS platforms** with subscriptions, multi-tenant data separation and an admin console.
- **Desktop apps** for Windows that keep working when the internet drops.
- **Progressive web apps** installable on phones, tablets and PCs.
- **Operations systems** — POS, bookings, queues, inventory and staff roles.
- **Automation** — reports, reminders and WhatsApp notifications that save hours every week.

## Built to last

We use proven technology (React, Node.js, NestJS, PostgreSQL, Electron), design for Arabic and English from the start, and ship with role-based security, audit logs and backups. Our own products — ClinoraX for clinics and Arena for gaming lounges — run on the same foundations.`,
      ar: `عندما لا تناسبك الأدوات الجاهزة، نبني البرمجيات حول طريقة عملك — من الأدوات الداخلية إلى منتجات SaaS كاملة تستخدمها شركات عديدة.

## ما نبنيه

- **منصات SaaS** مع الاشتراكات وفصل بيانات كل عميل ولوحة إدارة.
- **تطبيقات سطح مكتب** لويندوز تستمر في العمل عند انقطاع الإنترنت.
- **تطبيقات ويب تقدمية** قابلة للتثبيت على الجوالات والأجهزة اللوحية والحواسيب.
- **أنظمة تشغيل** — نقاط البيع والحجوزات وقوائم الانتظار والمخزون وأدوار الموظفين.
- **الأتمتة** — تقارير وتذكيرات وإشعارات واتساب توفّر ساعات كل أسبوع.

## مبنية لتدوم

نستخدم تقنيات مجرّبة (React وNode.js وNestJS وPostgreSQL وElectron)، ونصمم للعربية والإنجليزية من البداية، ونسلّم مع صلاحيات حسب الدور وسجل تدقيق ونسخ احتياطي. منتجاتنا الخاصة — ClinoraX للعيادات وأرينا لصالات الألعاب — مبنية على الأسس نفسها.`,
    },
  },
];
