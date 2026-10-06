export default {
  slug: 'arabic-rtl-website-design',
  tags: ['Web Design', 'Arabic'],
  title: {
    en: 'Arabic Websites Done Right: RTL Is More Than Flipping the Layout',
    ar: 'المواقع العربية بالشكل الصحيح: الاتجاه من اليمين أكثر من مجرد قلب التصميم',
  },
  seo: {
    title: {
      en: 'Arabic Website Design: RTL Done Right (AR/EN Guide)',
      ar: 'تصميم المواقع العربية: دليل الاتجاه من اليمين لليسار',
    },
    description: {
      en: 'How to build a proper Arabic and English website: RTL mirroring, Arabic fonts, numbers, forms, localization, hreflang SEO and an Arabic QA checklist.',
      ar: 'كيف تبني موقعاً عربياً وإنجليزياً بالشكل الصحيح: عكس الاتجاه والخطوط العربية والأرقام والنماذج والتوطين وإعدادات البحث وقائمة لاختبار النسخة العربية.',
    },
  },
  excerpt: {
    en: 'Flipping a layout to the right is the easy 10%. Fonts, numbers, forms, mixed text and SEO are where most Arabic websites quietly break.',
    ar: 'قلب التصميم إلى اليمين هو الجزء السهل. أما الخطوط والأرقام والنماذج والنص المختلط وإعدادات البحث فهي حيث تتعثر أغلب المواقع العربية.',
  },
  faq: [
    {
      q: {
        en: 'Should Arabic or English be the default language?',
        ar: 'هل تكون العربية أم الإنجليزية اللغة الافتراضية؟',
      },
      a: {
        en: 'Make the default the language most of your customers search and buy in. For many businesses selling to Saudi consumers that is Arabic. Whatever you choose, let visitors switch easily and remember their choice.',
        ar: 'اجعل الافتراضية هي اللغة التي يبحث ويشتري بها أغلب عملائك، وهي العربية لكثير من الشركات التي تبيع للمستهلك السعودي. ومهما اخترت، اجعل التبديل سهلاً واحفظ اختيار الزائر.',
      },
    },
    {
      q: {
        en: 'Should we use Arabic-Indic digits (١٢٣) or Western digits (123)?',
        ar: 'هل نستخدم الأرقام العربية المشرقية (١٢٣) أم الأرقام الغربية (123)؟',
      },
      a: {
        en: 'Both are used in Saudi Arabia. Western digits are common on websites, prices and phone numbers and are easier to copy and search. Pick one style and use it consistently across the Arabic site.',
        ar: 'كلاهما مستخدم في السعودية. والأرقام الغربية شائعة في المواقع والأسعار وأرقام الهواتف، وأسهل في النسخ والبحث. اختر نمطاً واحداً والتزم به في كامل النسخة العربية.',
      },
    },
    {
      q: {
        en: 'Can we use machine translation for the Arabic version?',
        ar: 'هل يمكن الاعتماد على الترجمة الآلية للنسخة العربية؟',
      },
      a: {
        en: 'It is a reasonable first draft, not a final text. Machine translation often sounds stiff, misses Saudi business terms and gets headings and calls to action wrong. Have a native writer rewrite the key pages.',
        ar: 'تصلح كمسودة أولى لا كنص نهائي. فالترجمة الآلية تبدو غالباً جامدة، وتخطئ في المصطلحات التجارية المحلية والعناوين وعبارات الدعوة لاتخاذ إجراء. اجعل كاتباً عربياً يعيد صياغة الصفحات الأساسية.',
      },
    },
  ],
  body: {
    en: `Most bilingual websites in the region are built in English first, then "made Arabic" at the end. The layout is flipped to right-to-left, the text is translated, and the project is called done. Then customers arrive and see arrows pointing the wrong way, phone numbers scrambled, prices split across lines and forms that do not accept Arabic names.

A proper Arabic website is not a mirror image of the English one. It is the same site, designed to be read naturally in Arabic. This guide covers what that takes, with the mistakes we see most often.

## 1. Mirroring: what to flip and what to leave alone

Setting the page direction to right-to-left (\`dir="rtl"\`) flips the overall layout: navigation starts on the right, text aligns right, sidebars swap sides. That part is easy with modern CSS. The skill is knowing what should *not* flip.

**Flip these:**

- Navigation order, breadcrumbs and menus.
- "Back" and "next" arrows, carousel controls and progress indicators.
- Icons that show direction, such as a reply arrow or a "send" icon.
- Form layouts, labels and the position of icons inside inputs.

**Do not flip these:**

- Logos and brand marks.
- Media controls — a play button points right in every language.
- Charts and timelines that follow a standard axis, unless you redesign them deliberately.
- Clocks, phone numbers, product codes and anything that must be read left to right.
- Checkmarks and most universal symbols.

**A common mistake:** a slider whose "next" arrow points left in Arabic but still moves the slides the English way. Direction must be consistent between the icon and the behaviour.

## 2. Arabic typography

Arabic letters connect, vary in height and carry dots and marks above and below the line. Fonts designed for English make Arabic look cramped or broken.

- **Choose a real Arabic typeface**, designed for screens, with weights that match your English font. Pair them so headings and body text feel like one family.
- **Increase line height.** Arabic needs more vertical space than English to stay readable.
- **Size up slightly.** Arabic text often looks smaller than English at the same font size.
- **Never use letter spacing on Arabic.** It breaks the connections between letters.
- **No uppercase styles.** Arabic has no capital letters; styles like \`uppercase\` and wide tracking that suit English labels should be switched off for Arabic.
- **Check bold and italic.** Many Arabic fonts have no true italic; a fake slant looks wrong.

## 3. Mixed-direction text and numbers

Arabic pages are full of left-to-right content: brand names, email addresses, phone numbers, prices, product codes. Without care, the browser reorders them in confusing ways.

Typical problems:

- A phone number like **+966 5X XXX XXXX** displayed as **XXXX XXX 5X 966+**.
- A price split so the currency appears on the wrong side or on the next line.
- An English brand name at the start of an Arabic sentence pushing punctuation to the wrong end.

Fixes:

- Wrap phone numbers, emails, codes and URLs in an element with \`dir="ltr"\` or the \`<bdi>\` tag.
- Keep amounts and currency together with a non-breaking space.
- Decide on a currency format — "120 ر.س" or "SAR 120" — and use it everywhere.
- Choose Western (123) or Arabic-Indic (١٢٣) digits and use one style consistently.

## 4. Forms, phone numbers and dates

Forms are where bilingual sites lose leads.

- **Names:** accept Arabic characters in name fields. Validation that only allows Latin letters rejects real customers.
- **Phone numbers:** default the country to Saudi Arabia, accept local formats with or without the leading zero, and show the number left to right.
- **Email and website fields:** always left to right, even on the Arabic page.
- **Dates:** decide whether you show Gregorian, Hijri or both, and label clearly which one a date picker uses.
- **Error messages:** write them in Arabic, not as translated developer messages.
- **Emails and SMS:** confirmation messages must also arrive in the visitor's language.

## 5. Translation vs localization

Translation changes words. Localization changes the message so it works for the reader.

- Rewrite headings and calls to action in natural Arabic rather than translating them word for word.
- Use the business terms your customers actually use.
- Adapt examples, currencies, addresses and working days to Saudi Arabia.
- Check images: people, settings and text inside images should suit the Arabic audience.
- Allow for length: Arabic text can be shorter or longer than English, so layouts must not depend on exact text length.

## 6. URLs, hreflang and Arabic SEO

Search engines need to understand that you have two language versions of each page.

- **One URL per language.** For example \`/ar/…\` and \`/en/…\`, or a default language at the root and the other in a folder. Avoid switching language only with a cookie on the same URL.
- **Set the language and direction on every page:** \`lang="ar"\` with \`dir="rtl"\` for Arabic, \`lang="en"\` for English.
- **Add hreflang tags** that link each page to its other-language version, plus an \`x-default\` [VERIFY current guidance for your setup].
- **Write Arabic titles and meta descriptions** for every page. Do not leave English metadata on Arabic pages.
- **Do Arabic keyword research.** People search differently in Arabic, including spelling variations and Saudi dialect terms.
- **Include both language versions in your sitemap.**

Our article on [SEO basics for Saudi businesses](/blog/seo-basics-for-saudi-businesses) covers the rest of the essentials.

## Beyond the website: emails, PDFs and messages

Visitors judge your Arabic experience by everything they receive, not just the pages they browse:

- **Transactional emails.** Order confirmations, password resets and form replies need Arabic templates with right-to-left layout and the right font fallbacks for email clients.
- **PDF documents.** Quotes, invoices and brochures generated from your system must render Arabic letters connected and in the right order — a common failure with basic PDF generators.
- **SMS and WhatsApp messages.** Keep them short, natural and free of mixed-direction problems with numbers and links.
- **Social previews.** When a page is shared, its Arabic title, description and image should appear — not the English ones.
- **Search inside the site.** Arabic search should handle common spelling variations, such as different forms of alef and taa marbuta.

Test each of these with a real Arabic-speaking colleague before launch.

## A QA checklist for the Arabic version

Test the Arabic site as its own product, on real phones as well as desktops.

- [ ] Every page has \`lang="ar"\` and \`dir="rtl"\`
- [ ] Navigation, breadcrumbs and arrows point the right way — and behave the same way
- [ ] Logos, media controls and charts are not mirrored by mistake
- [ ] Arabic font loads on all pages, with no letter spacing or uppercase styles
- [ ] Phone numbers, emails, prices and codes display correctly inside Arabic text
- [ ] Forms accept Arabic names and show Arabic error messages
- [ ] Phone fields default to Saudi Arabia and accept local formats
- [ ] Confirmation emails and messages arrive in Arabic
- [ ] Titles, meta descriptions and image alt text are written in Arabic
- [ ] Hreflang links connect each Arabic page to its English version
- [ ] Long and short Arabic text does not break cards, buttons or menus
- [ ] The language switcher keeps the visitor on the same page

## The takeaway

If Arabic speakers are your main customers, the Arabic site is not a translation of your website — it *is* your website. Design it, write it and test it with the same care as the English version, and it will feel native instead of converted.

---

**See how we build bilingual sites.** Browse our [portfolio](/work) for Arabic and English websites we have designed and built for Saudi companies.`,
    ar: `تُبنى أغلب المواقع ثنائية اللغة في المنطقة بالإنجليزية أولاً، ثم "تُعرَّب" في النهاية: يُقلب التصميم من اليمين إلى اليسار، ويُترجم النص، ويُعتبر المشروع منتهياً. ثم يصل العملاء فيرون أسهماً باتجاه خاطئ، وأرقام هواتف مبعثرة، وأسعاراً منقسمة على سطرين، ونماذج لا تقبل الأسماء العربية.

الموقع العربي الصحيح ليس صورة معكوسة للموقع الإنجليزي، بل هو الموقع نفسه مصمماً ليُقرأ بالعربية بشكل طبيعي. في هذا الدليل نوضح ما يتطلبه ذلك، مع أكثر الأخطاء التي نراها.

## 1. العكس: ما الذي يُقلب وما الذي يبقى كما هو؟

ضبط اتجاه الصفحة من اليمين إلى اليسار (\`dir="rtl"\`) يقلب التخطيط العام: تبدأ القائمة من اليمين، ويُحاذى النص لليمين، وتتبادل الأعمدة الجانبية مواضعها. وهذا سهل مع تقنيات CSS الحديثة. أما المهارة الحقيقية ففي معرفة ما *لا* يجب قلبه.

**اقلب هذه العناصر:**

- ترتيب القوائم ومسار التنقل.
- أسهم "السابق" و"التالي" وأزرار العروض المتحركة ومؤشرات التقدم.
- الأيقونات التي تدل على اتجاه، مثل سهم الرد أو أيقونة الإرسال.
- تخطيط النماذج وعناوين الحقول وموضع الأيقونات داخلها.

**لا تقلب هذه العناصر:**

- الشعارات والعلامات التجارية.
- أزرار تشغيل الوسائط، فزر التشغيل يتجه لليمين في كل اللغات.
- الرسوم البيانية والخطوط الزمنية ذات المحاور القياسية، إلا إذا أُعيد تصميمها عن قصد.
- الساعات وأرقام الهواتف ورموز المنتجات وكل ما يُقرأ من اليسار إلى اليمين.
- علامات الصح وأغلب الرموز العالمية.

**خطأ شائع:** عرض متحرك يشير فيه سهم "التالي" إلى اليسار في النسخة العربية، لكنه ما زال يحرّك الشرائح بالاتجاه الإنجليزي. يجب أن يتطابق اتجاه الأيقونة مع سلوكها.

## 2. الخط العربي

الحروف العربية متصلة، ومتفاوتة الارتفاع، وتحمل نقاطاً وحركات فوق السطر وتحته. والخطوط المصممة للإنجليزية تجعل العربية تبدو مزدحمة أو مكسورة.

- **اختر خطاً عربياً حقيقياً** مصمماً للشاشات، بأوزان تتناسب مع خطك الإنجليزي، ونسّق بينهما ليبدو الموقع عائلة واحدة.
- **زِد ارتفاع السطر.** تحتاج العربية مساحة عمودية أكبر لتبقى مقروءة.
- **كبّر الحجم قليلاً.** يبدو النص العربي غالباً أصغر من الإنجليزي بالحجم نفسه.
- **لا تستخدم تباعد الحروف مع العربية أبداً.** فهو يقطع اتصال الحروف.
- **لا أنماط للحروف الكبيرة.** لا توجد حروف كبيرة في العربية، فعطّل أنماط \`uppercase\` والتباعد الواسع التي تناسب العناوين الإنجليزية.
- **راجع الخط العريض والمائل.** كثير من الخطوط العربية بلا نسخة مائلة حقيقية، والميل المصطنع يبدو خاطئاً.

## 3. النص المختلط الاتجاه والأرقام

الصفحات العربية مليئة بمحتوى يُقرأ من اليسار إلى اليمين: أسماء العلامات التجارية، والبريد الإلكتروني، وأرقام الهواتف، والأسعار، ورموز المنتجات. ودون عناية يعيد المتصفح ترتيبها بشكل مربك.

مشكلات معتادة:

- رقم هاتف مثل **+966 5X XXX XXXX** يظهر بالشكل **XXXX XXX 5X 966+**.
- سعر ينقسم فتظهر العملة في الجهة الخاطئة أو في السطر التالي.
- اسم علامة إنجليزية في بداية جملة عربية يدفع علامات الترقيم إلى الطرف الخاطئ.

الحلول:

- ضع أرقام الهواتف والبريد والرموز والروابط داخل عنصر بخاصية \`dir="ltr"\` أو وسم \`<bdi>\`.
- أبقِ المبلغ والعملة معاً بمسافة غير قابلة للكسر.
- حدّد صيغة واحدة للعملة — "120 ر.س" أو "SAR 120" — واستخدمها في كل مكان.
- اختر الأرقام الغربية (123) أو المشرقية (١٢٣) والتزم بنمط واحد.

## 4. النماذج وأرقام الهواتف والتواريخ

النماذج هي المكان الذي تخسر فيه المواقع ثنائية اللغة عملاءها المحتملين.

- **الأسماء:** اقبل الحروف العربية في حقول الاسم. فالتحقق الذي يقبل الحروف اللاتينية فقط يرفض عملاء حقيقيين.
- **أرقام الهواتف:** اجعل السعودية الدولة الافتراضية، واقبل الصيغ المحلية مع الصفر في البداية أو دونه، واعرض الرقم من اليسار إلى اليمين.
- **حقول البريد والموقع:** دائماً من اليسار إلى اليمين حتى في الصفحة العربية.
- **التواريخ:** قرّر هل تعرض الميلادي أم الهجري أم كليهما، ووضّح أي تقويم يستخدمه منتقي التاريخ.
- **رسائل الخطأ:** اكتبها بالعربية، لا كرسائل مطوّرين مترجمة.
- **البريد والرسائل النصية:** يجب أن تصل رسائل التأكيد بلغة الزائر أيضاً.

## 5. الترجمة أم التوطين؟

الترجمة تغيّر الكلمات، أما التوطين فيغيّر الرسالة لتناسب القارئ.

- أعد صياغة العناوين وعبارات الدعوة لاتخاذ إجراء بعربية طبيعية بدل ترجمتها حرفياً.
- استخدم المصطلحات التجارية التي يستخدمها عملاؤك فعلاً.
- كيّف الأمثلة والعملات والعناوين وأيام العمل مع السعودية.
- راجع الصور: الأشخاص والأماكن والنصوص داخل الصور يجب أن تناسب الجمهور العربي.
- اترك مجالاً لاختلاف الطول: النص العربي قد يكون أقصر أو أطول من الإنجليزي، فلا تبنِ التصميم على طول نص محدد.

## 6. الروابط ووسوم hreflang والبحث بالعربية

تحتاج محركات البحث أن تفهم أن لكل صفحة نسختين بلغتين.

- **رابط مستقل لكل لغة.** مثل \`/ar/…\` و\`/en/…\`، أو اللغة الافتراضية في الجذر والأخرى في مجلد. وتجنّب تبديل اللغة عبر ملف تعريف الارتباط فقط على الرابط نفسه.
- **حدّد اللغة والاتجاه في كل صفحة:** \`lang="ar"\` مع \`dir="rtl"\` للعربية، و\`lang="en"\` للإنجليزية.
- **أضف وسوم hreflang** التي تربط كل صفحة بنسختها باللغة الأخرى، مع \`x-default\` [VERIFY الإرشادات الحالية لإعدادك].
- **اكتب عناوين وأوصافاً عربية** لكل صفحة، ولا تترك بيانات إنجليزية على الصفحات العربية.
- **ابحث عن الكلمات المفتاحية بالعربية.** يبحث الناس بالعربية بطرق مختلفة، منها اختلاف الإملاء والمصطلحات المحلية.
- **أدرج نسختي اللغتين في خريطة الموقع.**

ويغطي مقالنا عن [أساسيات تحسين الظهور في البحث للشركات السعودية](/blog/seo-basics-for-saudi-businesses) بقية الأساسيات.

## أبعد من الموقع: البريد والمستندات والرسائل

يحكم الزوار على تجربتك العربية من كل ما يصلهم، لا من الصفحات التي يتصفحونها فقط:

- **رسائل البريد التلقائية.** تأكيد الطلب وإعادة تعيين كلمة المرور والرد على النماذج تحتاج قوالب عربية باتجاه من اليمين إلى اليسار وخطوطاً بديلة مناسبة لبرامج البريد.
- **مستندات PDF.** عروض الأسعار والفواتير والكتيبات المولّدة من نظامك يجب أن تظهر فيها الحروف العربية متصلة وبالترتيب الصحيح، وهي مشكلة شائعة في أدوات توليد PDF البسيطة.
- **الرسائل النصية وواتساب.** اجعلها قصيرة وطبيعية، وخالية من مشكلات الاتجاه مع الأرقام والروابط.
- **معاينات المشاركة.** عند مشاركة صفحة يجب أن يظهر عنوانها ووصفها وصورتها بالعربية، لا بالإنجليزية.
- **البحث داخل الموقع.** يجب أن يتعامل البحث العربي مع اختلافات الإملاء الشائعة، مثل صور الألف والتاء المربوطة.

اختبر كل ذلك مع زميل يتحدث العربية قبل الإطلاق.

## قائمة لاختبار النسخة العربية

اختبر الموقع العربي كمنتج قائم بذاته، على هواتف حقيقية وعلى الحاسب.

- [ ] كل صفحة تحمل \`lang="ar"\` و\`dir="rtl"\`
- [ ] القوائم ومسار التنقل والأسهم في الاتجاه الصحيح — وتتصرف بالاتجاه نفسه
- [ ] الشعارات وأزرار الوسائط والرسوم البيانية غير معكوسة بالخطأ
- [ ] الخط العربي يُحمَّل في كل الصفحات، دون تباعد حروف أو أنماط حروف كبيرة
- [ ] أرقام الهواتف والبريد والأسعار والرموز تظهر بشكل صحيح داخل النص العربي
- [ ] النماذج تقبل الأسماء العربية وتعرض رسائل خطأ عربية
- [ ] حقول الهاتف تبدأ بالسعودية وتقبل الصيغ المحلية
- [ ] رسائل التأكيد تصل بالعربية
- [ ] العناوين والأوصاف والنص البديل للصور مكتوبة بالعربية
- [ ] وسوم hreflang تربط كل صفحة عربية بنسختها الإنجليزية
- [ ] النصوص العربية الطويلة والقصيرة لا تكسر البطاقات والأزرار والقوائم
- [ ] مبدّل اللغة يُبقي الزائر في الصفحة نفسها

## الخلاصة

إذا كان المتحدثون بالعربية هم عملاؤك الأساسيون، فالموقع العربي ليس ترجمة لموقعك — بل *هو* موقعك. صمّمه واكتبه واختبره بالعناية نفسها التي تمنحها للنسخة الإنجليزية، وسيبدو أصيلاً لا مترجماً.

---

**شاهد كيف نبني المواقع ثنائية اللغة.** تصفّح [أعمالنا](/work) لترى مواقع عربية وإنجليزية صممناها وطورناها لشركات سعودية.`,
  },
};
