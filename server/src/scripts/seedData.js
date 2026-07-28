import dotenv from 'dotenv';
import { query, closePool } from '../db/pg-connection.js';
import { runMigrations } from '../db/pg-migrate.js';

dotenv.config();

const packages = [
  {
    name: { en: 'BASIC PACKAGE', ar: 'الباقة الأساسية' },
    title: { en: 'Launch Starter', ar: 'انطلاقة سريعة' },
    subtitle: {
      en: 'Ideal for: small projects, landing pages, personal brands',
      ar: 'مثالية لـ: المشاريع الصغيرة وصفحات الهبوط والعلامات الشخصية',
    },
    icon: 'rocket',
    features: {
      en: [
        'Single Landing Page',
        'Premium responsive design',
        'Sections: Hero, About, Services, Contact',
        'WhatsApp click-to-chat',
        'Google Maps integration',
        'Basic SEO optimization',
        'Performance & speed optimization',
      ],
      ar: [
        'صفحة هبوط واحدةحدة',
        'تصميم متجاوب فاخر',
        'أقسام: البطل، من نحن، الخدمات، تواصل',
        'تواصل واتساب بنقرة واحدةحدة',
        'تكامل خرائط جوجل',
        'تحسين SEO أساسي',
        'تحسين الأداء والسرعة',
      ],
    },
    delivery: { en: '3 days', ar: '٣ أيام' },
    priceUSD: '200 – 280',
    priceEGP: '9,440 – 16,520 EGP',
    featured: false,
    order: 1,
  },
  {
    name: { en: 'STANDARD PACKAGE', ar: 'الباقة القياسية' },
    title: { en: 'Business Boost', ar: 'تعزيز الأعمال' },
    subtitle: {
      en: 'Ideal for: small and medium businesses',
      ar: 'مثالية لـ: الشركات الصغيرة والمتوسطة',
    },
    icon: 'crown',
    features: {
      en: [
        'Up to 5 pages (Home, About, Services, Blog, Contact)',
        'Fully custom Luxury UI/UX design',
        'Simple content management panel',
        'Blog system with categories',
        'Contact forms + WhatsApp',
        'Google Analytics setup',
        'Medium-level SEO optimization',
        'Optimized loading + optional CDN',
      ],
      ar: [
        'حتى ٥ صفحات (الرئيسية، من نحن، الخدمات، المدونة، تواصل)',
        'تصميم واجهة وتجربة فاخر مخصص بالكامل',
        'لوحة إدارة محتوى بسيطة',
        'نظام مدونة مع التصنيفات',
        'نماذج تواصل + واتساب',
        'إعداد Google Analytics',
        'تحسين SEO متوسط',
        'تحميل محسّن + CDN اختياري',
      ],
    },
    delivery: { en: '7 days', ar: '٧ أيام' },
    priceUSD: '400 – 560',
    priceEGP: '18,880 – 26,432 EGP',
    featured: true,
    order: 2,
  },
  {
    name: { en: 'PREMIUM PACKAGE', ar: 'الباقة المميزة' },
    title: { en: 'Ultimate Brand Website', ar: 'موقع علامة تجارية متكامل' },
    subtitle: {
      en: 'Ideal for: corporate brands and high-end websites',
      ar: 'مثالية لـ: العلامات المؤسسية والمواقع الفاخرة',
    },
    icon: 'shield',
    features: {
      en: [
        '7–10 luxury pages',
        'Full wireframes + UI/UX system',
        'GSAP & Lottie animations',
        'Complete CMS/dashboard',
        'Advanced blog + marketing pages',
        'Integrations: CRM, Email Marketing, Chatbot, Payments',
        'Advanced SEO system',
        'High security + firewall',
        'PageSpeed score target 90+',
        'VPS setup + SSL',
        'Full client training',
      ],
      ar: [
        '٧–١٠ صفحات فاخرة',
        'مخططات كاملة + نظام واجهة وتجربة',
        'حركات GSAP و Lottie',
        'لوحة تحكم / CMS كاملة',
        'مدونة متقدمة + صفحات تسويق',
        'تكاملات: CRM، تسويق بالبريد، شات بوت، مدفوعات',
        'نظام SEO متقدم',
        'أمان عالٍ + جدار ناري',
        'هدف PageSpeed ٩٠+',
        'إعداد VPS + SSL',
        'تدريب كامل للعميل',
      ],
    },
    delivery: { en: '12–16 days', ar: '١٢–١٦ يوماً' },
    priceUSD: '960 – 1,600',
    priceEGP: '45,312 – 75,520 EGP',
    featured: false,
    order: 3,
  },
  {
    name: { en: 'E-COMMERCE PACKAGE', ar: 'باقة التجارة الإلكترونية' },
    title: { en: 'Pro Store', ar: 'متجر احترافي' },
    subtitle: {
      en: 'Ideal for: online stores and product-based businesses',
      ar: 'مثالية لـ: المتاجر الإلكترونية والأعمال القائمة على المنتجات',
    },
    icon: 'store',
    features: {
      en: [
        'WooCommerce / Shopify / Odoo store setup',
        'Add + configure 20 products + categories',
        'Payment gateways: Fawry, Paymob, Stripe',
        'Shipping integrations: Aramex, Bosta, DHL',
        'Discount coupons + sales analytics',
        'E-commerce SEO optimization',
        'Training on managing orders & products',
      ],
      ar: [
        'إعداد متجر WooCommerce / Shopify / Odoo',
        'إضافة وضبط ٢٠ منتجاً + التصنيفات',
        'بوابات دفع: فوري، باي موب، Stripe',
        'تكامل شحن: أرامكس، بوسطة، DHL',
        'كوبونات خصم + تحليلات مبيعات',
        'تحسين SEO للتجارة الإلكترونية',
        'تدريب على إدارة الطلبات والمنتجات',
      ],
    },
    delivery: { en: '10–14 days', ar: '١٠–١٤ يوماً' },
    priceUSD: '720 – 1,200',
    priceEGP: '33,984 – 56,640 EGP',
    featured: false,
    order: 4,
  },
];

const maintenancePlans = [
  {
    name: { en: 'Standard Plan', ar: 'الخطة القياسية' },
    features: {
      en: [
        'Monthly updates',
        'Weekly backups',
        'SSL support',
        'Performance & speed checks',
        '2 edits per month',
      ],
      ar: [
        'تحديثات شهرية',
        'نسخ احتياطي أسبوعي',
        'دعم شهادة SSL',
        'فحوصات أداء وسرعة',
        'تعديلان شهرياً',
      ],
    },
    priceUSD: '64',
    priceEGP: '3,020 EGP / month',
    order: 1,
  },
  {
    name: { en: 'Premium Plan', ar: 'الخطة المميزة' },
    features: {
      en: [
        '24/7 support',
        'Daily backups',
        'Uptime monitoring',
        'Monthly SEO improvements',
        '5 edits per month',
      ],
      ar: [
        'دعم على مدار الساعة',
        'نسخ احتياطي يومي',
        'مراقبة وقت التشغيل',
        'تحسينات SEO شهرية',
        '٥ تعديلات شهرياً',
      ],
    },
    priceUSD: '120',
    priceEGP: '5,664 EGP / month',
    order: 2,
  },
];

async function seedDatabase() {
  try {
    await runMigrations();

    await query('DELETE FROM packages');
    await query('DELETE FROM maintenance_plans');
    console.log('Cleared existing packages and maintenance plans');

    for (const pkg of packages) {
      await query(
        `INSERT INTO packages
          (name, title, subtitle, icon, features, delivery, price_usd, price_egp, featured, sort_order)
         VALUES ($1::jsonb, $2::jsonb, $3::jsonb, $4, $5::jsonb, $6::jsonb, $7, $8, $9, $10)`,
        [
          JSON.stringify(pkg.name),
          JSON.stringify(pkg.title),
          JSON.stringify(pkg.subtitle),
          pkg.icon,
          JSON.stringify(pkg.features),
          JSON.stringify(pkg.delivery),
          pkg.priceUSD,
          pkg.priceEGP,
          pkg.featured,
          pkg.order,
        ]
      );
    }

    for (const plan of maintenancePlans) {
      await query(
        `INSERT INTO maintenance_plans (name, features, price_usd, price_egp, sort_order)
         VALUES ($1::jsonb, $2::jsonb, $3, $4, $5)`,
        [
          JSON.stringify(plan.name),
          JSON.stringify(plan.features),
          plan.priceUSD,
          plan.priceEGP,
          plan.order,
        ]
      );
    }

    console.log(`Created ${packages.length} packages`);
    console.log(`Created ${maintenancePlans.length} maintenance plans`);
    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exitCode = 1;
  } finally {
    await closePool();
  }
}

seedDatabase();
