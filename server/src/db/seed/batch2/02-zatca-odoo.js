export default {
  slug: 'zatca-e-invoicing-odoo',
  tags: ['Odoo', 'Compliance'],
  title: {
    en: 'ZATCA E-Invoicing with Odoo: What Your Company Needs to Set Up',
    ar: 'الفوترة الإلكترونية من زاتكا عبر أودو: ما الذي تحتاج شركتك لإعداده',
  },
  seo: {
    title: {
      en: 'ZATCA E-Invoicing in Odoo: Setup Guide for Saudi Firms',
      ar: 'الفوترة الإلكترونية من زاتكا في أودو: دليل الإعداد',
    },
    description: {
      en: 'How to meet ZATCA e-invoicing in Odoo: both phases, what Odoo handles, what to configure, common rejections and a go-live checklist.',
      ar: 'كيف تلتزم شركتك بالفوترة الإلكترونية (فاتورة) عبر أودو: المرحلتان، وما يغطيه أودو، وما يحتاج إعداداً، وأسباب الرفض الشائعة، وقائمة تحقق قبل الإطلاق.',
    },
  },
  excerpt: {
    en: "A plain-language guide to ZATCA e-invoicing in Odoo: what each phase requires, what Odoo's Saudi localization covers, and what you still need to set up.",
    ar: 'دليل مبسّط للفوترة الإلكترونية من زاتكا في أودو: متطلبات كل مرحلة، وما يغطيه التوطين السعودي في أودو، وما يبقى عليك إعداده.',
  },
  faq: [
    {
      q: {
        en: 'Does Odoo support ZATCA Phase 2 out of the box?',
        ar: 'هل يدعم أودو المرحلة الثانية من زاتكا مباشرة؟',
      },
      a: {
        en: 'Odoo includes a Saudi localization with e-invoicing support, but it still has to be configured and connected to your ZATCA account. Which Odoo edition and version include the e-invoicing module should be confirmed for your setup.',
        ar: 'يتضمن أودو توطيناً سعودياً يدعم الفوترة الإلكترونية، لكنه يحتاج إعداداً وربطاً بحسابك لدى زاتكا. ويجب التأكد من الإصدار والنسخة من أودو التي تتضمن وحدة الفوترة الإلكترونية في حالتك.',
      },
    },
    {
      q: {
        en: 'What is the difference between clearance and reporting?',
        ar: 'ما الفرق بين الاعتماد (Clearance) والإبلاغ (Reporting)؟',
      },
      a: {
        en: 'In Phase 2, standard tax invoices (usually business to business) are sent to ZATCA for clearance before you share them with the buyer. Simplified invoices (usually to consumers) are shared first and reported to ZATCA within a set time.',
        ar: 'في المرحلة الثانية تُرسل الفواتير الضريبية القياسية (غالباً بين الشركات) إلى زاتكا لاعتمادها قبل مشاركتها مع المشتري، أما الفواتير المبسطة (غالباً للأفراد) فتُشارك أولاً ثم يُبلَّغ عنها خلال مدة محددة.',
      },
    },
    {
      q: {
        en: 'Can we cancel or delete an invoice after it is sent to ZATCA?',
        ar: 'هل يمكن إلغاء فاتورة أو حذفها بعد إرسالها إلى زاتكا؟',
      },
      a: {
        en: 'Not in the usual sense. Once an invoice is issued, corrections are made with a credit or debit note that references the original invoice and states the reason. Deleting invoices also breaks the invoice chain that ZATCA validates.',
        ar: 'ليس بالمعنى المعتاد. بعد إصدار الفاتورة يتم التصحيح بإشعار دائن أو مدين يشير إلى الفاتورة الأصلية ويذكر السبب. كما أن حذف الفواتير يكسر تسلسل الفواتير الذي تتحقق منه زاتكا.',
      },
    },
  ],
  body: {
    en: `E-invoicing in Saudi Arabia is no longer a project for "later". The Zakat, Tax and Customs Authority (ZATCA) requires VAT-registered businesses to issue invoices electronically, and in the second phase to connect their invoicing system directly to ZATCA's platform, known as Fatoora.

If your company runs on Odoo, or is planning to, the good news is that Odoo has a Saudi localization built for this. The less good news is that "built for this" is not the same as "done". This guide explains, in plain language, what the rules require, what Odoo handles for you, and what your team still needs to set up.

> **Important:** regulations, dates and technical specifications change. Always check ZATCA's current official guidance — and your own ZATCA notification — before you rely on any detail here.

## The two phases in plain language

### Phase 1: Generation

The first phase required businesses to stop issuing handwritten or editable invoices and to generate invoices from a compliant electronic system. In practice, that means:

- Invoices are created in software, not in Word or Excel.
- Each invoice contains the required fields — seller and buyer details, VAT numbers, dates, amounts and VAT breakdown.
- Simplified invoices (typically to consumers) carry a QR code.
- Invoices cannot be quietly edited or deleted after issue.

Phase 1 started on 4 December 2021.

### Phase 2: Integration

The second phase connects your invoicing system to Fatoora. Instead of just generating invoices, your system now exchanges them with ZATCA in a structured format (XML based on UBL 2.1), with a cryptographic stamp and a hash that links each invoice to the previous one.

There are two flows:

- **Clearance** — standard tax invoices, usually business to business, are sent to ZATCA and must be cleared before you share them with the buyer.
- **Reporting** — simplified invoices, usually to consumers, are shared with the customer first and reported to ZATCA within a set period.

Phase 2 has been rolled out in waves since 1 January 2023, with each wave defined by a revenue threshold and given its own deadline. ZATCA notifies the businesses in each wave in advance. If you have received a notification, your go-live date is on it.

## What Odoo's Saudi localization handles

Odoo provides a Saudi accounting localization and an e-invoicing module that connects to ZATCA — confirm with your Odoo partner which modules your edition and version include. Once configured, it typically takes care of:

- Saudi chart of accounts and VAT taxes as a starting point.
- Bilingual invoice layouts with the required fields and the QR code.
- Generating the invoice in ZATCA's XML format.
- Signing invoices and chaining them with the invoice hash and counter.
- Sending standard invoices for clearance and simplified invoices for reporting.
- Storing ZATCA's response and showing errors on the invoice.

This is a lot of heavy lifting you do not want to build yourself. But it only works if the data feeding it is right.

## What still needs configuration

### Company data

ZATCA validates seller details strictly. Make sure your company record in Odoo has:

- The legal name in Arabic, exactly as registered.
- The VAT registration number.
- An additional seller identifier, such as the commercial registration number.
- The full national address — building number, street, district, city, postal code and additional number.

### Customers

For standard (B2B) invoices, buyer details matter as much as yours. Each business customer needs a valid VAT number and a complete address in the expected format. Missing or badly formatted buyer data is one of the most common reasons invoices are rejected.

### Taxes

Use the correct VAT category on every invoice line: standard rate, zero-rated, exempt or out of scope. Zero-rated and exempt lines need the right exemption reason code. Products set up with the wrong default tax will produce wrong invoices every single time.

### Journals and sequences

Each sales journal that issues invoices must be set up for e-invoicing, with its own numbering. Do not reuse, reset or manually renumber sequences once you are live — the chain that ZATCA checks depends on them.

### Onboarding with ZATCA

Your Odoo database must be registered as an invoicing solution on the Fatoora portal. In outline:

1. Log in to the Fatoora portal and generate a one-time password (OTP).
2. Enter the OTP in Odoo's journal settings to request a compliance certificate (CSID).
3. Odoo runs the compliance checks — sample invoices of each type you will issue.
4. Once they pass, Odoo requests the production certificate and the journal goes live.

Test this first in ZATCA's simulation environment with a copy of your database, not in production.

## Common rejection errors

When ZATCA rejects or warns about an invoice, Odoo shows the message on the invoice. The causes we see most often are:

| Error area | Usual cause | Fix |
|---|---|---|
| Seller details | Arabic legal name or address incomplete | Complete the company record exactly as registered |
| Buyer VAT number | Missing or wrong length/format on a B2B invoice | Correct the customer record before invoicing |
| Address fields | Building number, postal code or district missing or in the wrong format | Use the national address format for every business customer |
| Tax category | Zero-rated or exempt line without an exemption reason | Set the correct tax and reason code on the product |
| Credit notes | No reference to the original invoice or no reason | Always create credit notes from the original invoice |
| Invoice chain | Invoices deleted, renumbered or sent out of order | Never delete posted invoices; correct with credit notes |
| Certificate | Using a compliance certificate in production, or an expired certificate | Complete onboarding and renew certificates on time |

## Point of sale and other invoicing channels

E-invoicing is not only about invoices created by the accounts team. Every channel that issues invoices must follow the same rules:

- **Point of sale.** Retail receipts are usually simplified invoices and must be reported to ZATCA. Make sure each POS configuration uses a journal that is set up for e-invoicing.
- **E-commerce.** Orders from your online store need compliant invoices too, whether they are created in Odoo or in another platform.
- **Other systems.** If a separate billing or booking system issues invoices, it needs its own compliant connection — or the invoices must be issued from Odoo instead.

Map every place an invoice can be created before go-live. Missed channels are a common gap discovered only after launch.

## Pre-go-live checklist

Work through this before you switch on Phase 2 in production:

- [ ] Your wave and go-live date confirmed from ZATCA's notification
- [ ] Company record complete: Arabic legal name, VAT number, identifier, national address
- [ ] All active business customers have valid VAT numbers and full addresses
- [ ] Products and services use the correct VAT category and exemption reasons
- [ ] Sales journals set up for e-invoicing with clean numbering
- [ ] Onboarding tested end to end in the simulation environment
- [ ] A standard invoice, a simplified invoice, a credit note and a debit note tested
- [ ] Point of sale and any other invoicing channels included in the plan
- [ ] Team trained on credit notes instead of cancelling or deleting invoices
- [ ] Someone responsible for checking rejected invoices every day

## A word on timing

Do not leave this to the last month. The technical connection is usually the quick part; cleaning customer data, fixing product taxes and retraining the team take longer. Start with the data, test in simulation, and go live a little before your deadline, not on it.

---

**Need help getting ZATCA e-invoicing right in Odoo?** We configure, test and support Saudi Odoo setups. [Contact B-Code](/#contact) and tell us where you are in the process.`,
    ar: `لم تعد الفوترة الإلكترونية في السعودية مشروعاً يمكن تأجيله. فهيئة الزكاة والضريبة والجمارك (زاتكا) تُلزم المنشآت المسجّلة في ضريبة القيمة المضافة بإصدار الفواتير إلكترونياً، وفي المرحلة الثانية بربط نظام الفوترة مباشرة بمنصة الهيئة المعروفة باسم "فاتورة".

إذا كانت شركتك تعمل على أودو أو تخطط لذلك، فالخبر الجيد أن أودو يتضمن توطيناً سعودياً مبنياً لهذا الغرض. أما الخبر الأقل جودة فهو أن "مبني لهذا الغرض" لا يعني "جاهز". في هذا الدليل نشرح بلغة بسيطة ما تتطلبه الأنظمة، وما يتولاه أودو عنك، وما يبقى على فريقك إعداده.

> **تنبيه مهم:** الأنظمة والمواعيد والمواصفات الفنية تتغير. راجع دائماً إرشادات زاتكا الرسمية الحالية — والإشعار الذي وصلك منها — قبل الاعتماد على أي تفصيل هنا.

## المرحلتان بلغة بسيطة

### المرحلة الأولى: الإصدار

ألزمت المرحلة الأولى المنشآت بالتوقف عن إصدار الفواتير اليدوية أو القابلة للتعديل، وإصدارها من نظام إلكتروني متوافق. وعملياً يعني ذلك:

- تُنشأ الفواتير من نظام برمجي، لا من Word أو Excel.
- تتضمن كل فاتورة الحقول المطلوبة — بيانات البائع والمشتري، والأرقام الضريبية، والتواريخ، والمبالغ، وتفصيل الضريبة.
- تحمل الفواتير المبسطة (غالباً للأفراد) رمز QR.
- لا يمكن تعديل الفاتورة أو حذفها بعد إصدارها.

بدأت المرحلة الأولى في 4 ديسمبر 2021.

### المرحلة الثانية: الربط والتكامل

تربط المرحلة الثانية نظام الفوترة لديك بمنصة "فاتورة". فلم يعد المطلوب إصدار الفاتورة فقط، بل تبادلها مع زاتكا بصيغة منظمة (XML مبنية على معيار UBL 2.1)، مع ختم تشفيري وقيمة "هاش" تربط كل فاتورة بالتي قبلها.

وهناك مساران:

- **الاعتماد (Clearance):** تُرسل الفواتير الضريبية القياسية، وهي غالباً بين الشركات، إلى زاتكا ويجب اعتمادها قبل مشاركتها مع المشتري.
- **الإبلاغ (Reporting):** تُشارك الفواتير المبسطة، وهي غالباً للأفراد، مع العميل أولاً، ثم يُبلَّغ عنها لزاتكا خلال مدة محددة.

تُطبَّق المرحلة الثانية على دفعات منذ 1 يناير 2023، ولكل دفعة حدّ إيرادات وموعد خاص بها، وتُبلغ الهيئة المنشآت المشمولة في كل دفعة مسبقاً. فإذا وصلك إشعار فموعد التطبيق مذكور فيه.

## ما الذي يتولاه التوطين السعودي في أودو؟

يوفّر أودو توطيناً محاسبياً سعودياً ووحدة فوترة إلكترونية تتصل بزاتكا — وتأكد مع شريك أودو من الوحدات المتاحة في نسختك وإصدارك. وبعد إعدادها تتولى عادةً:

- دليل حسابات سعودي وضرائب القيمة المضافة كنقطة بداية.
- نماذج فواتير بلغتين تتضمن الحقول المطلوبة ورمز QR.
- إنشاء الفاتورة بصيغة XML المعتمدة لدى زاتكا.
- توقيع الفواتير وربطها بالـ"هاش" والعدّاد.
- إرسال الفواتير القياسية للاعتماد والمبسطة للإبلاغ.
- حفظ ردّ زاتكا وإظهار الأخطاء على الفاتورة نفسها.

هذا عمل ثقيل لا تريد بناءه بنفسك. لكنه لا يعمل بشكل صحيح إلا إذا كانت البيانات التي تغذّيه صحيحة.

## ما الذي يحتاج إلى إعداد؟

### بيانات الشركة

تتحقق زاتكا من بيانات البائع بدقة. تأكد أن سجل شركتك في أودو يتضمن:

- الاسم القانوني بالعربية كما هو مسجّل تماماً.
- رقم التسجيل في ضريبة القيمة المضافة.
- معرّف إضافي للبائع، مثل رقم السجل التجاري.
- العنوان الوطني كاملاً: رقم المبنى، والشارع، والحي، والمدينة، والرمز البريدي، والرقم الإضافي.

### العملاء

في الفواتير القياسية بين الشركات، بيانات المشتري مهمة بقدر بياناتك. يحتاج كل عميل من الشركات إلى رقم ضريبي صحيح وعنوان كامل بالصيغة المطلوبة. ونقص بيانات المشتري أو خطأ صيغتها من أكثر أسباب رفض الفواتير شيوعاً.

### الضرائب

استخدم فئة الضريبة الصحيحة في كل سطر من الفاتورة: نسبة أساسية، أو نسبة صفرية، أو معفى، أو خارج النطاق. وتحتاج البنود الصفرية والمعفاة إلى رمز سبب الإعفاء الصحيح. فالمنتج المضبوط بضريبة افتراضية خاطئة سيُنتج فاتورة خاطئة في كل مرة.

### دفاتر اليومية والتسلسل

يجب إعداد كل دفتر مبيعات يُصدر فواتير للفوترة الإلكترونية، بترقيم خاص به. ولا تُعِد استخدام التسلسل أو تُصفّره أو تُعدّل الترقيم يدوياً بعد الإطلاق؛ فالتسلسل الذي تتحقق منه زاتكا يعتمد عليه.

### التسجيل لدى زاتكا (Onboarding)

يجب تسجيل قاعدة بيانات أودو كحلّ فوترة على بوابة "فاتورة". وبشكل عام:

1. ادخل إلى بوابة "فاتورة" وأنشئ رمز تحقق لمرة واحدة (OTP).
2. أدخل الرمز في إعدادات دفتر اليومية في أودو لطلب شهادة الامتثال (CSID).
3. يُجري أودو فحوص الامتثال بفواتير تجريبية من كل نوع ستُصدره.
4. بعد نجاحها يطلب أودو شهادة الإنتاج ويصبح الدفتر جاهزاً للعمل.

اختبر ذلك أولاً في بيئة المحاكاة لدى زاتكا على نسخة من قاعدة بياناتك، لا على بيئة الإنتاج.

## أسباب الرفض الشائعة

عندما ترفض زاتكا فاتورة أو تُصدر تحذيراً عليها، يُظهر أودو الرسالة على الفاتورة. وأكثر الأسباب التي نراها:

| مجال الخطأ | السبب المعتاد | الحل |
|---|---|---|
| بيانات البائع | الاسم القانوني بالعربية أو العنوان غير مكتمل | أكمل سجل الشركة كما هو مسجّل تماماً |
| الرقم الضريبي للمشتري | غير موجود أو بطول أو صيغة خاطئة في فاتورة بين شركات | صحّح سجل العميل قبل إصدار الفاتورة |
| حقول العنوان | رقم المبنى أو الرمز البريدي أو الحي ناقص أو بصيغة خاطئة | استخدم صيغة العنوان الوطني لكل عميل من الشركات |
| فئة الضريبة | بند صفري أو معفى دون سبب إعفاء | اضبط الضريبة ورمز السبب الصحيح على المنتج |
| الإشعارات الدائنة | لا تشير إلى الفاتورة الأصلية أو بلا سبب | أنشئ الإشعار الدائن دائماً من الفاتورة الأصلية |
| تسلسل الفواتير | حذف فواتير أو إعادة ترقيمها أو إرسالها بغير ترتيبها | لا تحذف الفواتير المرحّلة أبداً، وصحّح بإشعار دائن |
| الشهادة | استخدام شهادة الامتثال في الإنتاج، أو شهادة منتهية | أكمل التسجيل وجدّد الشهادات في وقتها |

## نقاط البيع وقنوات الفوترة الأخرى

الفوترة الإلكترونية لا تقتصر على الفواتير التي يُنشئها فريق المحاسبة، فكل قناة تُصدر فواتير يجب أن تلتزم بالقواعد نفسها:

- **نقاط البيع.** إيصالات البيع بالتجزئة غالباً فواتير مبسطة يجب الإبلاغ عنها لزاتكا. تأكد أن كل إعداد لنقطة البيع يستخدم دفتر يومية مُعداً للفوترة الإلكترونية.
- **المتجر الإلكتروني.** طلبات متجرك تحتاج فواتير متوافقة أيضاً، سواء أُنشئت في أودو أو في منصة أخرى.
- **الأنظمة الأخرى.** إذا كان نظام فوترة أو حجز منفصل يُصدر فواتير، فيحتاج ربطاً متوافقاً خاصاً به، أو يجب إصدار الفواتير من أودو بدلاً منه.

حدّد كل مكان يمكن أن تُنشأ فيه فاتورة قبل الإطلاق، فالقنوات المنسية فجوة شائعة لا تُكتشف إلا بعده.

## قائمة تحقق قبل الإطلاق

راجع هذه البنود قبل تفعيل المرحلة الثانية في بيئة الإنتاج:

- [ ] تأكيد الدفعة وموعد التطبيق من إشعار زاتكا
- [ ] اكتمال سجل الشركة: الاسم القانوني بالعربية، والرقم الضريبي، والمعرّف، والعنوان الوطني
- [ ] لكل عملاء الشركات النشطين أرقام ضريبية صحيحة وعناوين كاملة
- [ ] المنتجات والخدمات مضبوطة بفئة الضريبة وأسباب الإعفاء الصحيحة
- [ ] دفاتر المبيعات مُعدّة للفوترة الإلكترونية بترقيم سليم
- [ ] اختبار التسجيل كاملاً في بيئة المحاكاة
- [ ] اختبار فاتورة قياسية وفاتورة مبسطة وإشعار دائن وإشعار مدين
- [ ] شمول نقاط البيع وأي قناة فوترة أخرى في الخطة
- [ ] تدريب الفريق على الإشعارات الدائنة بدلاً من إلغاء الفواتير أو حذفها
- [ ] تحديد مسؤول يراجع الفواتير المرفوضة يومياً

## كلمة عن التوقيت

لا تترك ذلك للشهر الأخير. فالربط الفني غالباً هو الجزء السريع، أما تنظيف بيانات العملاء وتصحيح ضرائب المنتجات وإعادة تدريب الفريق فتحتاج وقتاً أطول. ابدأ بالبيانات، واختبر في بيئة المحاكاة، وانطلق قبل موعدك بقليل لا في يومه.

---

**تحتاج مساعدة في ضبط الفوترة الإلكترونية من زاتكا على أودو؟** نُعدّ أنظمة أودو السعودية ونختبرها وندعمها. [تواصل مع B-Code](/#contact) وأخبرنا أين وصلت.`,
  },
};
