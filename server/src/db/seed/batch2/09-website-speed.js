export default {
  slug: 'website-speed-guide',
  tags: ['Performance', 'Website'],
  title: {
    en: 'Website Speed: Why Slow Pages Lose Customers and How to Fix Them',
    ar: 'سرعة الموقع: لماذا تخسر الصفحات البطيئة عملاءها وكيف تعالجها',
  },
  seo: {
    title: {
      en: 'Website Speed: Why Slow Pages Lose Customers',
      ar: 'سرعة الموقع: لماذا تخسر الصفحات البطيئة عملاءها؟',
    },
    description: {
      en: 'Why website speed affects sales and search ranking, Core Web Vitals in plain language, free ways to test your site, and a prioritised list of fixes.',
      ar: 'لماذا تؤثر سرعة الموقع في المبيعات وترتيب البحث، وشرح مبسط لمؤشرات Core Web Vitals، وطرق مجانية لاختبار موقعك، وقائمة إصلاحات مرتبة حسب الأولوية.',
    },
  },
  excerpt: {
    en: 'A slow website costs you customers before they see what you offer. What speed means, how to test your site for free, and what to fix first.',
    ar: 'الموقع البطيء يخسر العملاء قبل أن يروا ما تقدمه. ماذا تعني السرعة، وكيف تختبر موقعك مجاناً، وما الذي تبدأ بإصلاحه.',
  },
  faq: [
    {
      q: {
        en: 'Why is my site fast on my computer but slow for customers?',
        ar: 'لماذا يبدو موقعي سريعاً على حاسبي وبطيئاً لدى العملاء؟',
      },
      a: {
        en: 'Your computer may have the site cached and a fast office connection. Many customers visit on a phone over mobile data for the first time. Always test on a real phone and with tools that simulate mobile conditions.',
        ar: 'قد يكون الموقع محفوظاً مؤقتاً في جهازك، واتصال مكتبك سريعاً. أما كثير من العملاء فيزورونه لأول مرة من الجوال عبر بيانات الهاتف. اختبر دائماً على جوال حقيقي وبأدوات تحاكي ظروف الجوال.',
      },
    },
    {
      q: {
        en: 'Do I need a perfect 100 score in PageSpeed Insights?',
        ar: 'هل أحتاج درجة 100 كاملة في PageSpeed Insights؟',
      },
      a: {
        en: 'No. The score is a lab estimate. What matters more is that real visitors get a fast experience — the Core Web Vitals field data — and that pages feel quick on mobile. Fix the biggest problems first rather than chasing points.',
        ar: 'لا. فالدرجة تقدير مختبري. والأهم أن يحصل الزوار الحقيقيون على تجربة سريعة — أي بيانات Core Web Vitals الفعلية — وأن تبدو الصفحات سريعة على الجوال. عالج أكبر المشكلات أولاً بدل مطاردة النقاط.',
      },
    },
    {
      q: {
        en: 'Will a faster website improve my Google ranking?',
        ar: 'هل يحسّن الموقع الأسرع ترتيبي في Google؟',
      },
      a: {
        en: 'Page experience, including Core Web Vitals, is one of many signals Google uses. Speed alone will not outrank better content, but a slow site can hold good content back — and it definitely affects how many visitors stay.',
        ar: 'تجربة الصفحة، ومنها Core Web Vitals، إحدى إشارات كثيرة تستخدمها Google. فالسرعة وحدها لن تتفوق على محتوى أفضل، لكن الموقع البطيء قد يعيق المحتوى الجيد، ويؤثر بلا شك في عدد الزوار الذين يبقون.',
      },
    },
  ],
  body: {
    en: `You can spend months on design, content and advertising, and lose the visitor in the first few seconds because the page is still loading. Website speed is not a technical detail for developers. It decides how many of the people you paid to attract actually see what you offer.

This guide explains speed in plain language, shows you how to test your own site for free, and gives you a prioritised list of fixes — split into what you can do yourself and what to ask your developer.

## Why speed matters

### People leave slow pages

When a page takes too long, visitors press back and choose the next result. Many studies have shown that conversions fall as load time rises. You do not need a statistic to see it in your own data: compare bounce rates of your fastest and slowest pages in your analytics.

### Most of your visitors are on phones

For most businesses in Saudi Arabia, a large share of visitors arrive on phones — your analytics will show your own share. Phones have less processing power than laptops, and mobile connections vary. A page that feels fine on an office computer can feel slow on a phone.

### Search engines notice

Google uses page experience signals, including Core Web Vitals, as part of how it ranks pages. Speed will not beat better content, but a slow site makes good content work harder.

### Slow pages cost money twice

If you run ads, you pay for every click — including the ones that leave before the page loads.

## Core Web Vitals in plain language

Google measures real-world experience with three main metrics, called Core Web Vitals:

| Metric | What it means | Good target |
|---|---|---|
| **Largest Contentful Paint (LCP)** | How quickly the main content — usually the hero image or headline — appears | Within 2.5 seconds |
| **Interaction to Next Paint (INP)** | How quickly the page responds when someone taps or clicks | Under 200 milliseconds |
| **Cumulative Layout Shift (CLS)** | How much the page jumps around while loading | Below 0.1 |

In everyday words: **does the important part show up fast, does the page react when I tap, and does it stay still while I read?**

## How to test your own site for free

You do not need special software. Start with these free tools:

1. **PageSpeed Insights** (pagespeed.web.dev). Enter your address. It shows real-user data from Chrome users when available, plus a lab test with specific suggestions. Always check the **mobile** tab first.
2. **Google Search Console.** The Core Web Vitals report groups your pages into good, needs improvement and poor, based on real visitors. You need to verify your site first.
3. **Chrome DevTools Lighthouse.** Built into the Chrome browser on desktop: right-click, Inspect, then Lighthouse. Useful for testing a single page after a change.
4. **A real phone.** Open your site on a mid-range phone using mobile data, not office Wi-Fi. Time how long it takes before you can read and tap.

Test your home page, your most visited service or product page, and your contact or checkout page. These usually matter most.

## The most common causes of slow sites

### Heavy images

The most common problem by far. Photos uploaded straight from a camera or phone can be many times larger than needed. A hero image that should be a few hundred kilobytes is often several megabytes.

### Too many scripts

Chat widgets, tracking pixels, heat maps, pop-ups, review badges, font loaders — each one adds code the phone must download and run. Together they can slow a page more than everything else combined.

### Cheap or distant hosting

Shared hosting with many sites on one server, or a server far from your visitors, makes every request slower before the page even starts to load.

### No caching or CDN

Without caching, the server rebuilds the page for every visitor. Without a content delivery network (CDN), every file travels from one server, wherever it is.

### Heavy themes and page builders

Some templates and visual builders load large amounts of code for features you never use.

### Fonts and layout shifts

Several font files, or fonts that swap in late, make text jump. Images without set dimensions push content down as they load.

## A prioritised fix list

### Do it yourself

1. **Compress and resize images before uploading.** Use modern formats like WebP where your site supports them, and size images to how they are displayed.
2. **Remove what you do not use.** Old plugins, unused chat widgets, duplicate tracking codes and pop-ups.
3. **Limit autoplay video and large sliders** on the home page. One strong image often converts better than a slider.
4. **Keep the number of fonts low.** One family with two or three weights is usually enough — per language.
5. **Re-test after every change** to confirm it helped.

### Ask your developer

1. **Lazy-load images and videos** below the first screen.
2. **Set image dimensions** to stop layout shifts.
3. **Defer or delay non-essential scripts** so the page shows before trackers and widgets load.
4. **Turn on caching and compression** on the server.
5. **Put the site behind a CDN**, ideally with points of presence near your customers.
6. **Upgrade hosting** if the server itself is slow to respond.
7. **Preload the main image and fonts** used on the first screen.
8. **Review the theme or builder.** Sometimes the fastest fix is a lighter template or a custom build.

## Speed on Arabic and bilingual sites

Bilingual sites have a few speed traps of their own:

- **Two sets of fonts.** An Arabic and an English font family, each with several weights, can add a lot of weight. Load only the weights you use, and only the font each language needs.
- **Duplicate images.** If the Arabic and English versions use different images with text inside, both sets must be optimised — or use images without embedded text.
- **Translation plugins** that translate pages on the fly can add delay. Pre-built language versions are usually faster.

## Measure the impact of your fixes

Speed work is easier to justify when you can see its effect:

1. Note your Core Web Vitals and PageSpeed results before you start.
2. Record key business numbers for the same pages: bounce rate, enquiries, add-to-cart or checkout completion.
3. Make one group of changes at a time.
4. Compare again after a few weeks of real traffic.

This shows which fixes made a real difference, and helps you decide where to invest next.

## A simple speed routine

- [ ] Test your top three pages on mobile every month
- [ ] Check every new image size before uploading
- [ ] Ask before adding any new script or widget: is it worth the speed cost?
- [ ] Review the Core Web Vitals report in Search Console every quarter
- [ ] Re-test after every redesign, plugin install or campaign launch

## The takeaway

Speed is part of the customer experience, just like design and content. Start with images and unnecessary scripts — they fix most problems — then work with your developer on caching, hosting and code. Treat speed as ongoing work, not a one-off project: every new image, plugin and campaign can slow things down again. For more on what affects your visibility, read our [SEO basics for Saudi businesses](/blog/seo-basics-for-saudi-businesses).

---

**Is your website losing visitors to slow pages?** We audit, fix and rebuild sites for speed on mobile. [Get a quote](/#contact).`,
    ar: `قد تقضي أشهراً في التصميم والمحتوى والإعلانات، ثم تخسر الزائر في الثواني الأولى لأن الصفحة ما زالت تُحمَّل. فسرعة الموقع ليست تفصيلاً تقنياً يخص المطورين، بل هي ما يحدد كم شخصاً — ممن دفعت لجذبهم — سيرى فعلاً ما تقدمه.

يشرح هذا الدليل السرعة بلغة بسيطة، ويوضح كيف تختبر موقعك مجاناً، ويقدّم قائمة إصلاحات مرتبة حسب الأولوية، مقسّمة بين ما يمكنك فعله بنفسك وما تطلبه من مطوّرك.

## لماذا تهم السرعة؟

### الناس يغادرون الصفحات البطيئة

عندما تتأخر الصفحة يضغط الزائر زر الرجوع ويختار النتيجة التالية. وقد أظهرت دراسات كثيرة أن معدلات التحويل تنخفض كلما زاد وقت التحميل. ولا تحتاج إحصائية لترى ذلك في بياناتك: قارن معدل الارتداد لأسرع صفحاتك وأبطئها في أداة التحليلات.

### أغلب زوارك يتصفحون من الجوال

لدى أغلب الشركات في السعودية، تصل نسبة كبيرة من الزوار عبر الجوال — وتُظهر لك أدوات التحليل نسبتك الفعلية. والهواتف أقل قدرة على المعالجة من الحواسيب، واتصالات الجوال متفاوتة. فالصفحة التي تبدو مقبولة على حاسب المكتب قد تكون بطيئة على الهاتف.

### محركات البحث تلاحظ

تستخدم Google إشارات تجربة الصفحة، ومنها Core Web Vitals، ضمن طريقة ترتيب الصفحات. السرعة لن تتفوق على محتوى أفضل، لكن الموقع البطيء يجعل المحتوى الجيد يعمل بجهد أكبر.

### الصفحات البطيئة تكلفك مرتين

إذا كنت تدير إعلانات فأنت تدفع ثمن كل نقرة، بما فيها النقرات التي غادرت قبل أن تُحمَّل الصفحة.

## مؤشرات Core Web Vitals بلغة بسيطة

تقيس Google التجربة الفعلية بثلاثة مؤشرات رئيسية تُسمى Core Web Vitals:

| المؤشر | ماذا يعني | الهدف الجيد |
|---|---|---|
| **أكبر عرض للمحتوى (LCP)** | سرعة ظهور المحتوى الرئيسي، وهو غالباً الصورة الرئيسية أو العنوان | خلال 2.5 ثانية |
| **التفاعل حتى العرض التالي (INP)** | سرعة استجابة الصفحة عند اللمس أو النقر | أقل من 200 جزء من الثانية |
| **التحول التراكمي في التخطيط (CLS)** | مقدار اهتزاز الصفحة وتحرك عناصرها أثناء التحميل | أقل من 0.1 |

وبكلمات يومية: **هل يظهر الجزء المهم بسرعة؟ وهل تستجيب الصفحة عندما ألمسها؟ وهل تبقى ثابتة وأنا أقرأ؟**

## كيف تختبر موقعك مجاناً؟

لا تحتاج برامج خاصة. ابدأ بهذه الأدوات المجانية:

1. **PageSpeed Insights** (pagespeed.web.dev). أدخل عنوان موقعك، فيعرض بيانات المستخدمين الحقيقيين من متصفح Chrome عند توفرها، إضافة إلى اختبار مختبري باقتراحات محددة. وابدأ دائماً بتبويب **الجوال**.
2. **Google Search Console.** يجمّع تقرير Core Web Vitals صفحاتك في فئات: جيدة، وتحتاج تحسيناً، وضعيفة، بناءً على الزوار الحقيقيين. وتحتاج أولاً لإثبات ملكية موقعك.
3. **أداة Lighthouse في Chrome.** مدمجة في متصفح Chrome على الحاسب: انقر بالزر الأيمن، ثم "فحص"، ثم Lighthouse. وهي مفيدة لاختبار صفحة واحدة بعد أي تعديل.
4. **هاتف حقيقي.** افتح موقعك على هاتف متوسط المواصفات عبر بيانات الجوال لا شبكة المكتب، واحسب الوقت حتى تتمكن من القراءة واللمس.

اختبر الصفحة الرئيسية، وأكثر صفحات الخدمات أو المنتجات زيارة، وصفحة التواصل أو الدفع، فهي غالباً الأهم.

## أكثر أسباب بطء المواقع شيوعاً

### الصور الثقيلة

المشكلة الأكثر شيوعاً بفارق كبير. فالصور المرفوعة مباشرة من الكاميرا أو الهاتف قد تكون أكبر من الحاجة بأضعاف، والصورة الرئيسية التي يكفيها بضع مئات من الكيلوبايت تكون غالباً عدة ميغابايت.

### كثرة السكربتات

أدوات المحادثة، وبكسلات التتبع، والخرائط الحرارية، والنوافذ المنبثقة، وشارات التقييم، ومحمّلات الخطوط — كلٌّ منها يضيف كوداً يجب على الهاتف تنزيله وتشغيله. ومجتمعة قد تبطئ الصفحة أكثر من كل ما عداها.

### استضافة رخيصة أو بعيدة

الاستضافة المشتركة مع مواقع كثيرة على خادم واحد، أو خادم بعيد عن زوارك، تجعل كل طلب أبطأ قبل أن تبدأ الصفحة بالتحميل أصلاً.

### غياب التخزين المؤقت وشبكة توصيل المحتوى

دون تخزين مؤقت يعيد الخادم بناء الصفحة لكل زائر، ودون شبكة توصيل محتوى (CDN) ينتقل كل ملف من خادم واحد أينما كان.

### القوالب ومنشئو الصفحات الثقيلة

بعض القوالب وأدوات البناء المرئي تحمّل كميات كبيرة من الكود لميزات لا تستخدمها أبداً.

### الخطوط وتحرك عناصر الصفحة

تعدد ملفات الخطوط، أو تأخر ظهورها، يجعل النص يقفز. والصور التي لم تُحدد أبعادها تدفع المحتوى للأسفل أثناء تحميلها.

## قائمة إصلاحات حسب الأولوية

### ما يمكنك فعله بنفسك

1. **اضغط الصور وصغّر أبعادها قبل رفعها.** استخدم صيغاً حديثة مثل WebP إذا كان موقعك يدعمها، واجعل أبعاد الصورة بحجم عرضها الفعلي.
2. **احذف ما لا تستخدمه.** الإضافات القديمة، وأدوات المحادثة غير المستخدمة، وأكواد التتبع المكررة، والنوافذ المنبثقة.
3. **قلّل الفيديو التلقائي والعروض المتحركة الكبيرة** في الصفحة الرئيسية؛ فصورة واحدة قوية تحقق غالباً تحويلاً أفضل من عرض متحرك.
4. **قلّل عدد الخطوط.** عائلة واحدة بوزنين أو ثلاثة تكفي غالباً لكل لغة.
5. **أعد الاختبار بعد كل تغيير** لتتأكد أنه أفاد.

### ما تطلبه من مطوّرك

1. **التحميل الكسول للصور والفيديو** الواقعة أسفل الشاشة الأولى.
2. **تحديد أبعاد الصور** لمنع تحرك عناصر الصفحة.
3. **تأجيل السكربتات غير الضرورية** لتظهر الصفحة قبل تحميل أدوات التتبع والإضافات.
4. **تفعيل التخزين المؤقت والضغط** على الخادم.
5. **وضع الموقع خلف شبكة توصيل محتوى**، ويُفضّل أن تكون لها نقاط قريبة من عملائك.
6. **ترقية الاستضافة** إذا كان الخادم نفسه بطيء الاستجابة.
7. **التحميل المسبق للصورة الرئيسية والخطوط** المستخدمة في الشاشة الأولى.
8. **مراجعة القالب أو أداة البناء.** أحياناً يكون أسرع حل هو قالب أخف أو بناء مخصص.

## السرعة في المواقع العربية وثنائية اللغة

للمواقع ثنائية اللغة فخاخ سرعة خاصة بها:

- **مجموعتان من الخطوط.** عائلة خط عربية وأخرى إنجليزية، لكلٍّ منهما عدة أوزان، قد تضيف حجماً كبيراً. حمّل الأوزان التي تستخدمها فقط، والخط الذي تحتاجه كل لغة فقط.
- **صور مكررة.** إذا كانت النسختان العربية والإنجليزية تستخدمان صوراً مختلفة بنصوص داخلها، فيجب تحسين المجموعتين — أو استخدام صور بلا نصوص مدمجة.
- **إضافات الترجمة** التي تترجم الصفحات لحظياً قد تضيف تأخيراً، والنسخ اللغوية المبنية مسبقاً أسرع عادةً.

## قِس أثر الإصلاحات

يسهل تبرير العمل على السرعة عندما ترى أثره:

1. سجّل نتائج Core Web Vitals وPageSpeed قبل البدء.
2. سجّل الأرقام التجارية للصفحات نفسها: معدل الارتداد، والاستفسارات، والإضافة إلى السلة أو إتمام الشراء.
3. نفّذ مجموعة واحدة من التغييرات في كل مرة.
4. قارن مجدداً بعد بضعة أسابيع من الزيارات الفعلية.

هكذا تعرف أي الإصلاحات أحدثت فرقاً حقيقياً، وأين تستثمر بعد ذلك.

## روتين بسيط للسرعة

- [ ] اختبر أهم ثلاث صفحات على الجوال كل شهر
- [ ] تحقق من حجم كل صورة جديدة قبل رفعها
- [ ] اسأل قبل إضافة أي سكربت أو أداة: هل تستحق ما ستكلفه من سرعة؟
- [ ] راجع تقرير Core Web Vitals في Search Console كل ربع سنة
- [ ] أعد الاختبار بعد كل إعادة تصميم أو تثبيت إضافة أو إطلاق حملة

## الخلاصة

السرعة جزء من تجربة العميل، تماماً كالتصميم والمحتوى. ابدأ بالصور والسكربتات غير الضرورية فهي تحل أغلب المشكلات، ثم اعمل مع مطوّرك على التخزين المؤقت والاستضافة والكود. وتعامل مع السرعة كعمل مستمر لا مشروع لمرة واحدة، فكل صورة أو إضافة أو حملة جديدة قد تبطئ الموقع من جديد. ولمعرفة المزيد عما يؤثر في ظهورك، اقرأ مقال [أساسيات تحسين الظهور في البحث للشركات السعودية](/blog/seo-basics-for-saudi-businesses).

---

**هل يخسر موقعك زواره بسبب البطء؟** نفحص المواقع ونصلحها ونعيد بناءها لتكون سريعة على الجوال. [اطلب عرض سعر](/#contact).`,
  },
};
