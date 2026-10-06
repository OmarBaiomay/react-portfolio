/**
 * Launch articles for the B-Code blog (English + Arabic, Markdown).
 * Seeded once by migration 011 via scripts/build-blog-seed.mjs; edit them in the dashboard afterwards.
 * Images live in client/public/images/blog/<slug>/.
 */
const img = (slug, file) => `/images/blog/${slug}/${file}`;

export const blogPosts = [
  // ---------------------------------------------------------------- 1. Odoo implementation
  {
    slug: 'odoo-implementation-guide',
    publishedAt: '2026-09-08T08:00:00Z',
    tags: ['Odoo', 'ERP'],
    title: {
      en: 'Odoo ERP Implementation: A Step-by-Step Guide for Growing Companies',
      ar: 'تطبيق نظام أودو: دليل خطوة بخطوة للشركات النامية',
    },
    excerpt: {
      en: 'The six phases of a successful Odoo rollout — from mapping your processes to go-live — and the mistakes that make ERP projects stall.',
      ar: 'المراحل الست لتطبيق أودو بنجاح — من رسم عملياتك حتى الإطلاق — والأخطاء التي تُعطّل مشاريع أنظمة ERP.',
    },
    body: {
      en: `Most companies don't decide to implement an ERP because they want new software. They decide because spreadsheets have stopped scaling: stock numbers don't match, invoices go out late, and every report takes a day to assemble.

Odoo is a strong answer to that problem. It covers accounting, sales, inventory, purchasing, HR, projects and more in one system — and you only switch on the apps you need. But the software is the easy part. How you implement it decides whether it saves you hours every week or becomes another tool nobody trusts.

![The six phases of an Odoo implementation](${img('odoo-implementation-guide', 'phases-en.webp')})

## 1. Discovery: start with the problem, not the modules

Before anything is installed, write down what is actually broken. "We need Odoo Inventory" is not a goal. "We can't see real stock across our two warehouses" is. Clear problems give you a clear scope — and a way to measure success later.

## 2. Process mapping

Walk through how work really happens today: how a quote becomes an order, how an order becomes a delivery, how a delivery becomes an invoice. This is where most surprises appear — approval steps nobody wrote down, exceptions handled by one person, data kept in personal files.

## 3. Configuration

Odoo's standard features cover a large share of what most companies need. Configure first: products, price lists, taxes (including ZATCA e-invoicing in Saudi Arabia), warehouses, approval rules and user rights. Only customize where a real gap remains — we cover that decision in detail in [Configure or customize?](/blog/odoo-configure-vs-customize).

## 4. Data migration

Customers, vendors, products, opening balances and open orders all need to move — cleanly. Migrating messy data just moves the mess. Use this phase to remove duplicates, fix product names and agree on one source of truth.

## 5. Training

People adopt systems they understand. Train by role, using your own data and your own scenarios, not generic demos. Short, focused sessions work better than one long day.

## 6. Go-live and support

Pick a quiet period, run old and new side by side for a short time if needed, and have support ready for the first weeks. The first month always surfaces small fixes; plan for them instead of treating them as failures.

## Mistakes that make ERP projects stall

- **Customizing everything on day one.** Every custom feature is something to maintain and upgrade later.
- **No internal owner.** Someone inside the company must own decisions and priorities.
- **Skipping data cleanup.** Bad data on day one destroys trust in the new system fast.
- **Training too early or too late.** Train close to go-live, when people can practise straight away.

## How long does it take?

A focused rollout of a few core apps can go live in weeks; a multi-company setup with integrations takes longer. The honest answer depends on scope — which is exactly why discovery comes first.

---

**Planning an Odoo project?** We help companies implement, customize and integrate Odoo around how they actually work. [Tell us about your project](/#contact) and we'll reply with a clear plan.`,
      ar: `لا تقرّر معظم الشركات تطبيق نظام ERP لأنها تريد برنامجاً جديداً، بل لأن جداول البيانات لم تعد تكفي: أرقام المخزون غير متطابقة، والفواتير تتأخر، وكل تقرير يحتاج يوماً كاملاً لإعداده.

أودو حلّ قوي لهذه المشكلة. فهو يغطي المحاسبة والمبيعات والمخزون والمشتريات والموارد البشرية والمشاريع وغيرها في نظام واحد، وتفعّل فقط التطبيقات التي تحتاجها. لكن البرنامج هو الجزء السهل؛ فطريقة التطبيق هي ما يحدد إن كان سيوفّر عليك ساعات كل أسبوع أم سيصبح أداة أخرى لا يثق بها أحد.

![المراحل الست لتطبيق أودو](${img('odoo-implementation-guide', 'phases-ar.webp')})

## 1. الاستكشاف: ابدأ بالمشكلة لا بالتطبيقات

قبل تثبيت أي شيء، اكتب ما الذي لا يعمل فعلاً. عبارة "نحتاج تطبيق المخزون" ليست هدفاً، أما "لا نرى المخزون الحقيقي في مستودعينا" فهي هدف واضح. المشكلات الواضحة تعطيك نطاقاً واضحاً، وطريقة لقياس النجاح لاحقاً.

## 2. رسم العمليات

تتبّع كيف يتم العمل اليوم فعلاً: كيف يتحول عرض السعر إلى طلب، والطلب إلى تسليم، والتسليم إلى فاتورة. هنا تظهر معظم المفاجآت: خطوات موافقة غير مكتوبة، واستثناءات يتعامل معها شخص واحد، وبيانات محفوظة في ملفات شخصية.

## 3. الإعداد

تغطي ميزات أودو القياسية جزءاً كبيراً مما تحتاجه معظم الشركات. ابدأ بالإعداد: المنتجات وقوائم الأسعار والضرائب (بما فيها الفوترة الإلكترونية من زاتكا في السعودية) والمستودعات وقواعد الموافقة وصلاحيات المستخدمين. ولا تلجأ للتخصيص إلا عند وجود فجوة حقيقية — وقد شرحنا هذا القرار بالتفصيل في مقال [الإعداد أم التخصيص؟](/blog/odoo-configure-vs-customize).

## 4. نقل البيانات

يجب نقل العملاء والموردين والمنتجات والأرصدة الافتتاحية والطلبات المفتوحة بشكل نظيف. نقل البيانات الفوضوية ينقل الفوضى فقط. استغل هذه المرحلة لحذف التكرارات وتوحيد أسماء المنتجات والاتفاق على مصدر واحد للحقيقة.

## 5. التدريب

يتبنّى الناس الأنظمة التي يفهمونها. درّب كل فريق حسب دوره، باستخدام بياناتكم وسيناريوهاتكم الحقيقية لا العروض العامة. الجلسات القصيرة المركّزة أفضل من يوم تدريبي طويل.

## 6. الإطلاق والدعم

اختر فترة هادئة، وشغّل النظامين معاً لفترة قصيرة إن لزم، وجهّز الدعم للأسابيع الأولى. الشهر الأول يكشف دائماً تعديلات صغيرة؛ خطّط لها بدلاً من اعتبارها فشلاً.

## أخطاء تُعطّل مشاريع ERP

- **تخصيص كل شيء من اليوم الأول.** كل ميزة مخصصة تحتاج صيانة وترقية لاحقاً.
- **غياب مسؤول داخلي.** يجب أن يملك شخص داخل الشركة القرارات والأولويات.
- **تجاوز تنظيف البيانات.** البيانات السيئة في اليوم الأول تهدم الثقة بالنظام الجديد بسرعة.
- **التدريب مبكراً جداً أو متأخراً جداً.** درّب قرب موعد الإطلاق، حين يمكن للفريق التطبيق فوراً.

## كم يستغرق التطبيق؟

يمكن إطلاق مجموعة مركّزة من التطبيقات الأساسية خلال أسابيع، بينما يحتاج إعداد متعدد الشركات مع تكاملات وقتاً أطول. الإجابة الصادقة تعتمد على النطاق — ولهذا تأتي مرحلة الاستكشاف أولاً.

---

**تخطط لمشروع أودو؟** نساعد الشركات على تطبيق أودو وتخصيصه وربطه بما يناسب طريقة عملها الفعلية. [أخبرنا عن مشروعك](/#contact) وسنعود إليك بخطة واضحة.`,
    },
  },

  // ---------------------------------------------------------------- 2. Configure vs customize
  {
    slug: 'odoo-configure-vs-customize',
    publishedAt: '2026-09-15T08:00:00Z',
    tags: ['Odoo', 'Development'],
    title: {
      en: 'Odoo: Configure or Customize? How to Decide',
      ar: 'أودو: الإعداد أم التخصيص؟ كيف تتخذ القرار',
    },
    excerpt: {
      en: 'Customization is powerful — and expensive to maintain. A simple decision path for when to configure, use Studio, or build a custom module.',
      ar: 'التخصيص قوي لكن صيانته مكلفة. مسار بسيط لاتخاذ القرار: متى تكتفي بالإعداد، ومتى تستخدم Studio، ومتى تبني وحدة مخصصة.',
    },
    body: {
      en: `"Can Odoo do this?" is the most common question we hear. The answer is almost always yes — the real question is *how*, because there are three very different ways to get there, each with a different long-term cost.

## Three levels of change

**Configuration** uses Odoo's built-in settings: workflows, fields you switch on, approval rules, reports, email templates. It survives upgrades with no extra work.

**Odoo Studio** lets you add fields, adjust views and create simple automations without code. It's ideal for small, clear changes — but heavy Studio use can become hard to manage.

**Custom modules** are real code: new logic, integrations, complex calculations, new screens. They can do almost anything — and they need to be maintained and tested with every Odoo upgrade.

![Decision path: configure, Studio, or custom module](${img('odoo-configure-vs-customize', 'decision-en.webp')})

## A simple decision path

1. **Is there a standard feature that does 80% of it?** Use it, and adapt the process slightly. Small process changes are often cheaper than permanent code.
2. **Is the gap small and visual** — an extra field, a changed form, a simple rule? Use Studio.
3. **Is the gap critical to how you make money or comply** — pricing logic, a regulatory requirement, an integration with another system? Build a clean custom module.

## Signs you really need custom development

- You must connect Odoo to another system: an e-commerce platform, a payment gateway, a government portal, a delivery company or attendance devices.
- Your pricing, commission or costing rules are unique and drive revenue.
- You process high volumes where manual steps don't scale.
- Reporting needs combine data in ways standard reports can't.

## Build customizations that age well

- **Keep custom code in separate modules** — never edit Odoo's core.
- **Document the "why"**, not just the "what". The next developer needs the business reason.
- **Test on a copy of your database** before every upgrade.
- **Review custom modules yearly.** Odoo adds features every release; some customizations become unnecessary.

## The bottom line

The best Odoo setups are mostly standard, with a few precise customizations where they create real value. That keeps upgrades smooth and total cost low.

---

**Not sure which path fits your requirement?** Send us the scenario — we'll tell you honestly whether it needs configuration, Studio, or code. [Contact B-Code](/#contact).`,
      ar: `"هل يستطيع أودو فعل هذا؟" هو السؤال الأكثر تكراراً لدينا. والإجابة غالباً نعم — لكن السؤال الحقيقي هو *كيف*، لأن هناك ثلاث طرق مختلفة تماماً للوصول، ولكل منها تكلفة مختلفة على المدى الطويل.

## ثلاثة مستويات للتغيير

**الإعداد** يستخدم إعدادات أودو المدمجة: سير العمل، والحقول التي تفعّلها، وقواعد الموافقة، والتقارير، وقوالب البريد. ويستمر مع الترقيات دون أي عمل إضافي.

**أودو ستوديو** يتيح إضافة حقول وتعديل الواجهات وإنشاء أتمتة بسيطة دون برمجة. وهو مثالي للتغييرات الصغيرة الواضحة، لكن الإفراط في استخدامه قد يصعّب الإدارة.

**الوحدات المخصصة** برمجة حقيقية: منطق جديد، وتكاملات، وحسابات معقدة، وشاشات جديدة. يمكنها فعل أي شيء تقريباً، لكنها تحتاج صيانة واختباراً مع كل ترقية لأودو.

![مسار القرار: الإعداد أو ستوديو أو وحدة مخصصة](${img('odoo-configure-vs-customize', 'decision-ar.webp')})

## مسار بسيط لاتخاذ القرار

1. **هل توجد ميزة قياسية تغطي 80% من المطلوب؟** استخدمها، وعدّل العملية قليلاً. تعديل العملية غالباً أرخص من برمجة دائمة.
2. **هل الفجوة صغيرة وشكلية** — حقل إضافي، أو نموذج معدّل، أو قاعدة بسيطة؟ استخدم ستوديو.
3. **هل الفجوة حاسمة لإيراداتك أو التزامك النظامي** — منطق تسعير، أو متطلب تنظيمي، أو تكامل مع نظام آخر؟ ابنِ وحدة مخصصة نظيفة.

## علامات تدل على حاجتك فعلاً للتطوير المخصص

- تحتاج ربط أودو بنظام آخر: متجر إلكتروني، أو بوابة دفع، أو منصة حكومية، أو شركة توصيل، أو أجهزة حضور.
- قواعد التسعير أو العمولات أو التكاليف لديك فريدة وتؤثر في الإيرادات.
- تعالج أحجاماً كبيرة لا تناسبها الخطوات اليدوية.
- تحتاج تقارير تجمع البيانات بطرق لا توفرها التقارير القياسية.

## ابنِ تخصيصات تصمد مع الوقت

- **ضع الكود المخصص في وحدات منفصلة** — ولا تعدّل نواة أودو أبداً.
- **وثّق "السبب"** لا "الطريقة" فقط. المطوّر التالي يحتاج السبب التجاري.
- **اختبر على نسخة من قاعدة البيانات** قبل كل ترقية.
- **راجع الوحدات المخصصة سنوياً.** يضيف أودو ميزات في كل إصدار، وقد يصبح بعض التخصيص غير ضروري.

## الخلاصة

أفضل أنظمة أودو قياسية في معظمها، مع تخصيصات دقيقة قليلة حيث تصنع قيمة حقيقية. هذا يُبقي الترقيات سلسة والتكلفة الإجمالية منخفضة.

---

**غير متأكد أي مسار يناسب متطلبك؟** أرسل لنا السيناريو وسنخبرك بصراحة إن كان يحتاج إعداداً أو ستوديو أو برمجة. [تواصل مع B-Code](/#contact).`,
    },
  },

  // ---------------------------------------------------------------- 3. Web design
  {
    slug: 'web-design-that-converts',
    publishedAt: '2026-09-22T08:00:00Z',
    tags: ['Web Design', 'UX'],
    title: {
      en: 'Web Design That Converts: 7 Principles We Use on Every Project',
      ar: 'تصميم مواقع يحقق النتائج: 7 مبادئ نطبقها في كل مشروع',
    },
    excerpt: {
      en: 'Beautiful is not enough. The seven design principles that turn visitors into enquiries — on desktop and, above all, on mobile.',
      ar: 'الجمال وحده لا يكفي. سبعة مبادئ تصميم تحوّل الزوار إلى طلبات تواصل — على الحاسوب، وعلى الجوال قبل كل شيء.',
    },
    body: {
      en: `A website can look stunning and still fail. The test of good web design isn't whether people admire it — it's whether the right visitors understand what you do and take the next step. These are the seven principles we apply on every site we build.

![Seven principles of web design that converts](${img('web-design-that-converts', 'principles-en.webp')})

## 1. One clear message above the fold

In the first seconds a visitor should know three things: what you do, who it's for, and what to do next. A strong headline, one supporting sentence and **one primary call to action** beat a slider of five competing messages.

## 2. Design for mobile first

For many businesses, most visitors arrive on a phone. Design the mobile layout first, then expand to desktop. Thumb-friendly buttons, readable text without zooming, and short forms matter more than desktop animations.

## 3. Speed is part of the design

Every heavy image, video background and extra script costs load time. Compress images, load only what's visible, and question every effect. A fast simple page usually outperforms a slow impressive one.

## 4. Clear visual hierarchy

Size, weight, colour and spacing tell the eye where to look. If everything is bold, nothing is. Give each section one job and one focal point.

## 5. Proof builds trust

Real project screenshots, client logos, testimonials, numbers you can stand behind and clear contact details all reduce the risk a visitor feels. Generic stock photos do the opposite.

## 6. Make contact effortless

Put the action where the decision happens: a button after each key section, WhatsApp and call options for mobile users, and forms that ask only for what you need. Every extra field loses people.

## 7. Built for both languages

In Saudi Arabia, a serious business site should work in Arabic and English. That means a true right-to-left layout — mirrored navigation, icons and alignment — not just translated text pasted into an English design.

## Before you launch: a quick checklist

- Can a new visitor explain what you do after 5 seconds?
- Does every page have one clear next step?
- Does the site load quickly on a mobile connection?
- Do forms, WhatsApp and phone links work on a real phone?
- Does the Arabic version feel native, not mirrored by accident?

---

**Want a website that works as hard as you do?** We design and build fast, bilingual websites focused on results. [Start your project](/#contact).`,
      ar: `قد يبدو الموقع مذهلاً ومع ذلك يفشل. فمقياس التصميم الجيد ليس إعجاب الناس به، بل أن يفهم الزائر المناسب ما تقدمه ويتخذ الخطوة التالية. هذه المبادئ السبعة نطبقها في كل موقع نبنيه.

![سبعة مبادئ لتصميم مواقع يحقق النتائج](${img('web-design-that-converts', 'principles-ar.webp')})

## 1. رسالة واحدة واضحة في أول شاشة

في الثواني الأولى يجب أن يعرف الزائر ثلاثة أشياء: ماذا تقدم، ولمن، وما الخطوة التالية. عنوان قوي وجملة داعمة واحدة و**دعوة واحدة رئيسية لاتخاذ إجراء** أفضل من شريط صور بخمس رسائل متنافسة.

## 2. صمّم للجوال أولاً

في كثير من الأعمال يصل معظم الزوار من الجوال. صمّم واجهة الجوال أولاً ثم وسّعها للحاسوب. الأزرار المناسبة للإبهام، والنص المقروء دون تكبير، والنماذج القصيرة أهم من الحركات على الحاسوب.

## 3. السرعة جزء من التصميم

كل صورة ثقيلة وخلفية فيديو وسكربت إضافي يكلّف وقت تحميل. اضغط الصور، وحمّل ما يظهر فقط، وراجع كل تأثير. الصفحة السريعة البسيطة تتفوق غالباً على الصفحة البطيئة المبهرة.

## 4. تسلسل بصري واضح

الحجم والسماكة واللون والمسافات تخبر العين أين تنظر. إذا كان كل شيء عريضاً فلا شيء بارز. امنح كل قسم مهمة واحدة ونقطة تركيز واحدة.

## 5. الإثبات يبني الثقة

لقطات المشاريع الحقيقية، وشعارات العملاء، والتوصيات، والأرقام التي يمكنك الدفاع عنها، وبيانات التواصل الواضحة — كلها تقلل إحساس الزائر بالمخاطرة. أما الصور العامة الجاهزة فتفعل العكس.

## 6. اجعل التواصل سهلاً

ضع الإجراء حيث يُتخذ القرار: زر بعد كل قسم مهم، وخيارات واتساب والاتصال لمستخدمي الجوال، ونماذج لا تطلب إلا الضروري. كل حقل إضافي يُفقدك زواراً.

## 7. مصمم للغتين

في السعودية، يجب أن يعمل موقع الشركة الجادة بالعربية والإنجليزية. وهذا يعني تصميماً حقيقياً من اليمين إلى اليسار — قوائم وأيقونات ومحاذاة معكوسة بعناية — لا مجرد نص مترجم داخل تصميم إنجليزي.

## قبل الإطلاق: قائمة سريعة

- هل يستطيع زائر جديد شرح ما تقدمه بعد 5 ثوانٍ؟
- هل لكل صفحة خطوة تالية واضحة؟
- هل يُحمَّل الموقع بسرعة على اتصال الجوال؟
- هل تعمل النماذج وروابط واتساب والهاتف على جوال حقيقي؟
- هل تبدو النسخة العربية أصيلة لا معكوسة بالخطأ؟

---

**تريد موقعاً يعمل بجدّ مثلك؟** نصمم ونبني مواقع سريعة ثنائية اللغة تركّز على النتائج. [ابدأ مشروعك](/#contact).`,
    },
  },

  // ---------------------------------------------------------------- 4. Importance of a website
  {
    slug: 'why-your-business-needs-a-website',
    publishedAt: '2026-09-29T08:00:00Z',
    tags: ['Website', 'Business'],
    title: {
      en: 'Why Every Business Still Needs a Professional Website',
      ar: 'لماذا تحتاج كل شركة إلى موقع إلكتروني احترافي',
    },
    excerpt: {
      en: 'Social media pages are rented space. Here is what a professional website does for credibility, sales and growth — and why it pays for itself.',
      ar: 'صفحات التواصل الاجتماعي مساحة مستأجرة. إليك ما يقدمه الموقع الاحترافي للمصداقية والمبيعات والنمو — ولماذا يسترد تكلفته.',
    },
    body: {
      en: `"We have Instagram and WhatsApp — do we really need a website?" It's a fair question. Social channels are great for reach. But they are rented space: the platform controls the layout, the algorithm decides who sees you, and your best content scrolls away in days.

A website is the one place online you fully own.

![What a professional website does for your business](${img('why-your-business-needs-a-website', 'benefits-en.webp')})

## 1. Credibility before the first call

Before a company contacts you, it looks you up. A clear, professional website answers the silent questions — *Is this business real? Do they do what I need? Have they done it before?* — before anyone picks up the phone. For B2B buyers and government-related work, having no website is often a red flag.

## 2. Found when people search

People search Google — and increasingly AI assistants — for services like yours every day. A website with well-structured pages can appear in those results. A social profile rarely ranks for "Odoo partner in Riyadh" or "clinic near me".

## 3. A salesperson that works 24/7

Your website explains your services, shows your work, answers common questions and collects enquiries at 2 a.m. on a holiday. Every question it answers is a call your team doesn't have to take.

## 4. You control the message

On your own site you decide the story, the order and the call to action. You can publish case studies, pricing, FAQs and articles — content that keeps working for years.

## 5. Measurable marketing

With analytics on your site you see where visitors come from, which pages work and which campaigns bring real enquiries. That turns marketing from guesswork into decisions.

## 6. Connected to how you work

A modern website doesn't have to live alone. Contact forms can create leads in your CRM, product pages can sync with Odoo, and bookings can land straight in your team's calendar.

## What makes a website worth it?

A website pays for itself when it is **clear, fast, trusted and easy to contact**. A slow, outdated site can do more harm than good — so treat it as a business asset, not a one-time task: keep content current and review it at least once a year.

---

**Ready for a website that represents your business properly?** We build fast, bilingual websites that turn visitors into enquiries. [Talk to us](/#contact).`,
      ar: `"لدينا إنستغرام وواتساب — هل نحتاج فعلاً إلى موقع؟" سؤال منطقي. قنوات التواصل ممتازة للوصول، لكنها مساحة مستأجرة: المنصة تتحكم في الشكل، والخوارزمية تقرر من يراك، وأفضل محتواك يختفي خلال أيام.

الموقع الإلكتروني هو المكان الوحيد على الإنترنت الذي تملكه بالكامل.

![ما يقدمه الموقع الاحترافي لأعمالك](${img('why-your-business-needs-a-website', 'benefits-ar.webp')})

## 1. المصداقية قبل أول اتصال

قبل أن تتواصل معك أي شركة، تبحث عنك. الموقع الواضح الاحترافي يجيب عن الأسئلة الصامتة — *هل هذه شركة حقيقية؟ هل يقدمون ما أحتاجه؟ هل فعلوه من قبل؟* — قبل أن يرفع أحد الهاتف. وبالنسبة لعملاء الشركات والجهات الحكومية، فإن غياب الموقع كثيراً ما يكون علامة تحذير.

## 2. يجدك الناس عند البحث

يبحث الناس يومياً في جوجل — ومساعدات الذكاء الاصطناعي بشكل متزايد — عن خدمات مثل خدماتك. الموقع ذو الصفحات المنظمة جيداً يمكن أن يظهر في هذه النتائج، بينما نادراً ما يظهر حساب تواصل اجتماعي لعبارة مثل "شريك أودو في الرياض" أو "عيادة قريبة مني".

## 3. موظف مبيعات يعمل على مدار الساعة

يشرح موقعك خدماتك، ويعرض أعمالك، ويجيب عن الأسئلة الشائعة، ويستقبل الطلبات في الثانية فجراً يوم العطلة. كل سؤال يجيب عنه الموقع هو مكالمة لا يحتاج فريقك لاستقبالها.

## 4. أنت من يتحكم في الرسالة

في موقعك تقرر القصة والترتيب ودعوة الإجراء. يمكنك نشر دراسات الحالة والأسعار والأسئلة الشائعة والمقالات — محتوى يستمر في العمل لسنوات.

## 5. تسويق قابل للقياس

مع أدوات التحليل في موقعك ترى من أين يأتي الزوار، وأي الصفحات تنجح، وأي الحملات تجلب طلبات حقيقية. هكذا يتحول التسويق من تخمين إلى قرارات.

## 6. مرتبط بطريقة عملك

الموقع الحديث لا يعمل منفرداً. يمكن لنماذج التواصل إنشاء عملاء محتملين في نظام إدارة العملاء، ويمكن لصفحات المنتجات أن تتزامن مع أودو، ويمكن للحجوزات أن تصل مباشرة إلى تقويم فريقك.

## ما الذي يجعل الموقع يستحق الاستثمار؟

يسترد الموقع تكلفته عندما يكون **واضحاً وسريعاً وموثوقاً وسهل التواصل**. الموقع البطيء القديم قد يضر أكثر مما ينفع — لذا تعامل معه كأصل تجاري لا مهمة لمرة واحدة: حدّث محتواه وراجعه مرة واحدة سنوياً على الأقل.

---

**جاهز لموقع يمثل أعمالك كما يجب؟** نبني مواقع سريعة ثنائية اللغة تحوّل الزوار إلى طلبات تواصل. [تحدث معنا](/#contact).`,
    },
  },

  // ---------------------------------------------------------------- 5. SEO
  {
    slug: 'seo-basics-for-saudi-businesses',
    publishedAt: '2026-10-03T08:00:00Z',
    tags: ['SEO', 'Marketing'],
    title: {
      en: 'SEO Basics for Saudi Businesses: Get Found on Google and AI Search',
      ar: 'أساسيات السيو للشركات السعودية: كيف يجدك عملاؤك في جوجل وبحث الذكاء الاصطناعي',
    },
    excerpt: {
      en: 'The four pillars of SEO, a practical checklist for Arabic and English sites, and what changes now that people also ask AI assistants.',
      ar: 'الركائز الأربع لتحسين محركات البحث، وقائمة عملية للمواقع العربية والإنجليزية، وما الذي تغيّر بعد أن أصبح الناس يسألون مساعدات الذكاء الاصطناعي.',
    },
    body: {
      en: `Search engine optimization (SEO) sounds technical, but the goal is simple: when someone searches for what you offer, your business should be one of the answers. Good SEO is mostly about being genuinely useful — and making that easy for search engines to understand.

![The four pillars of SEO](${img('seo-basics-for-saudi-businesses', 'pillars-en.webp')})

## Pillar 1: Technical foundations

Search engines must be able to find, load and understand your pages.

- **Fast loading**, especially on mobile.
- **A secure site** (HTTPS) that works on every device.
- **A sitemap** submitted to Google Search Console and Bing Webmaster Tools.
- **Clean URLs** like \`/services/odoo-implementation\`, not \`/page?id=42\`.
- **Proper language tags**, so Arabic and English pages are each shown to the right audience.

## Pillar 2: Content that answers real questions

Every important service deserves its own page, written for the words customers actually use — in Arabic *and* English. Answer the questions people ask before they buy: cost ranges, timelines, process, what's included. Articles like this one build that depth over time.

## Pillar 3: Authority and trust

Search engines favour sites others trust. Earn mentions from partners, industry directories, clients and local media. Show real case studies, clear company details and reviews.

## Pillar 4: Local visibility

For businesses serving specific cities, set up and complete your **Google Business Profile**: correct name, address, phone, hours, photos and services. Ask happy clients for reviews and reply to them.

## On-page checklist

- One clear **title** and **meta description** per page, with the main keyword.
- One **H1** per page, then logical H2/H3 headings.
- Descriptive **image alt text** and compressed images.
- **Internal links** between related pages — like linking from this guide to our [web design principles](/blog/web-design-that-converts).
- **Structured data** (FAQ, Organization, Article) to help search engines read your content.

## SEO in the age of AI search

People now ask assistants like ChatGPT and Gemini, and Google shows AI-generated overviews. These systems still rely on clear, trustworthy websites. The same fundamentals apply — plus:

- Write **direct answers** to common questions in plain language.
- Keep **company facts consistent** everywhere: name, services, locations, contact details.
- Use **structured data** and clear headings so content is easy to quote accurately.

## Be patient — and measure

SEO compounds. New pages often take weeks to months to gain traction. Track impressions, clicks and enquiries in Search Console and analytics, then improve the pages that are close to ranking.

---

**Want a website built for search from day one?** Every site we build ships with clean structure, bilingual SEO, sitemaps and structured data. [Get in touch](/#contact).`,
      ar: `يبدو تحسين محركات البحث (SEO) أمراً تقنياً، لكن الهدف بسيط: عندما يبحث شخص عمّا تقدمه، يجب أن تكون شركتك من الإجابات. والسيو الجيد في معظمه يعني أن تكون مفيداً فعلاً، وأن تسهّل على محركات البحث فهم ذلك.

![الركائز الأربع لتحسين محركات البحث](${img('seo-basics-for-saudi-businesses', 'pillars-ar.webp')})

## الركيزة 1: الأساس التقني

يجب أن تستطيع محركات البحث العثور على صفحاتك وتحميلها وفهمها.

- **تحميل سريع**، خصوصاً على الجوال.
- **موقع آمن** (HTTPS) يعمل على كل الأجهزة.
- **خريطة موقع** مرسلة إلى Google Search Console وBing Webmaster Tools.
- **روابط نظيفة** مثل \`/services/odoo-implementation\` لا \`/page?id=42\`.
- **وسوم لغة صحيحة** لتظهر الصفحات العربية والإنجليزية كلٌّ لجمهورها.

## الركيزة 2: محتوى يجيب عن أسئلة حقيقية

تستحق كل خدمة مهمة صفحة خاصة بها، مكتوبة بالكلمات التي يستخدمها العملاء فعلاً — بالعربية *والإنجليزية*. أجب عن الأسئلة التي تسبق قرار الشراء: نطاقات التكلفة، والمدة، وطريقة العمل، وما يشمله العرض. والمقالات مثل هذا المقال تبني هذا العمق مع الوقت.

## الركيزة 3: السمعة والثقة

تفضّل محركات البحث المواقع التي يثق بها الآخرون. احصل على إشارات من الشركاء وأدلة القطاع والعملاء والإعلام المحلي. واعرض دراسات حالة حقيقية وبيانات شركة واضحة وتقييمات.

## الركيزة 4: الظهور المحلي

إذا كنت تخدم مدناً محددة، فأنشئ **ملفك التجاري في جوجل** وأكمله: الاسم الصحيح والعنوان والهاتف وأوقات العمل والصور والخدمات. واطلب من العملاء الراضين تقييمك وردّ على التقييمات.

## قائمة تحسين الصفحة

- **عنوان** و**وصف** واضحان لكل صفحة يتضمنان الكلمة الرئيسية.
- وسم **H1** واحد لكل صفحة، ثم عناوين H2 وH3 منطقية.
- **نص بديل** وصفي للصور، مع ضغط الصور.
- **روابط داخلية** بين الصفحات المرتبطة — مثل الرابط من هذا الدليل إلى [مبادئ تصميم المواقع](/blog/web-design-that-converts).
- **بيانات منظّمة** (الأسئلة الشائعة، والمنشأة، والمقال) لتساعد محركات البحث على قراءة محتواك.

## السيو في عصر بحث الذكاء الاصطناعي

أصبح الناس يسألون مساعدات مثل ChatGPT وGemini، وتعرض جوجل ملخصات مولّدة بالذكاء الاصطناعي. وما زالت هذه الأنظمة تعتمد على مواقع واضحة وموثوقة. الأساسيات نفسها تنطبق، مع إضافة:

- اكتب **إجابات مباشرة** للأسئلة الشائعة بلغة بسيطة.
- حافظ على **تطابق معلومات الشركة** في كل مكان: الاسم والخدمات والمواقع وبيانات التواصل.
- استخدم **البيانات المنظّمة** والعناوين الواضحة ليسهل اقتباس محتواك بدقة.

## اصبر — وقِس النتائج

نتائج السيو تتراكم. قد تحتاج الصفحات الجديدة من أسابيع إلى أشهر لتكتسب الظهور. تابع مرات الظهور والنقرات والطلبات في Search Console وأدوات التحليل، ثم حسّن الصفحات القريبة من الترتيب.

---

**تريد موقعاً مبنياً لمحركات البحث من اليوم الأول؟** كل موقع نبنيه يأتي بهيكل نظيف وسيو ثنائي اللغة وخرائط موقع وبيانات منظّمة. [تواصل معنا](/#contact).`,
    },
  },
];
