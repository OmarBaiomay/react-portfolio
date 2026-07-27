import dotenv from 'dotenv';
import { query, closePool } from '../db/pg-connection.js';
import { runMigrations } from '../db/pg-migrate.js';

dotenv.config();

const packages = [
  {
    name: 'BASIC PACKAGE',
    title: 'Launch Starter',
    subtitle: 'Ideal for: small projects, landing pages, personal brands',
    icon: 'rocket',
    features: [
      'Single Landing Page',
      'Premium responsive design',
      'Sections: Hero, About, Services, Contact',
      'WhatsApp click-to-chat',
      'Google Maps integration',
      'Basic SEO optimization',
      'Performance & speed optimization',
    ],
    delivery: '3 days',
    priceUSD: '200 – 280',
    priceEGP: '9,440 – 16,520 EGP',
    featured: false,
    order: 1,
  },
  {
    name: 'STANDARD PACKAGE',
    title: 'Business Boost',
    subtitle: 'Ideal for: small and medium businesses',
    icon: 'crown',
    features: [
      'Up to 5 pages (Home, About, Services, Blog, Contact)',
      'Fully custom Luxury UI/UX design',
      'Simple content management panel',
      'Blog system with categories',
      'Contact forms + WhatsApp',
      'Google Analytics setup',
      'Medium-level SEO optimization',
      'Optimized loading + optional CDN',
    ],
    delivery: '7 days',
    priceUSD: '400 – 560',
    priceEGP: '18,880 – 26,432 EGP',
    featured: true,
    order: 2,
  },
  {
    name: 'PREMIUM PACKAGE',
    title: 'Ultimate Brand Website',
    subtitle: 'Ideal for: corporate brands and high-end websites',
    icon: 'shield',
    features: [
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
    delivery: '12–16 days',
    priceUSD: '960 – 1,600',
    priceEGP: '45,312 – 75,520 EGP',
    featured: false,
    order: 3,
  },
  {
    name: 'E-COMMERCE PACKAGE',
    title: 'Pro Store',
    subtitle: 'Ideal for: online stores and product-based businesses',
    icon: 'store',
    features: [
      'WooCommerce / Shopify / Odoo store setup',
      'Add + configure 20 products + categories',
      'Payment gateways: Fawry, Paymob, Stripe',
      'Shipping integrations: Aramex, Bosta, DHL',
      'Discount coupons + sales analytics',
      'E-commerce SEO optimization',
      'Training on managing orders & products',
    ],
    delivery: '10–14 days',
    priceUSD: '720 – 1,200',
    priceEGP: '33,984 – 56,640 EGP',
    featured: false,
    order: 4,
  },
];

const maintenancePlans = [
  {
    name: 'Standard Plan',
    features: [
      'Monthly updates',
      'Weekly backups',
      'SSL support',
      'Performance & speed checks',
      '2 edits per month',
    ],
    priceUSD: '64',
    priceEGP: '3,020 EGP / month',
    order: 1,
  },
  {
    name: 'Premium Plan',
    features: [
      '24/7 support',
      'Daily backups',
      'Uptime monitoring',
      'Monthly SEO improvements',
      '5 edits per month',
    ],
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
         VALUES ($1, $2, $3, $4, $5::jsonb, $6, $7, $8, $9, $10)`,
        [
          pkg.name,
          pkg.title,
          pkg.subtitle,
          pkg.icon,
          JSON.stringify(pkg.features),
          pkg.delivery,
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
         VALUES ($1, $2::jsonb, $3, $4, $5)`,
        [
          plan.name,
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
