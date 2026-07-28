import { query } from '../db/pg-connection.js';
import { mapPackage } from '../lib/mappers.js';
import { hasI18nList, hasI18nText, toI18nList, toI18nText } from '../lib/i18n.js';

export const getAllPackages = async (req, res) => {
  try {
    const result = await query(
      `SELECT * FROM packages WHERE is_active = TRUE ORDER BY sort_order ASC`
    );
    res.status(200).json(result.rows.map(mapPackage));
  } catch (error) {
    console.error('Error in getAllPackages:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getPackage = async (req, res) => {
  try {
    const result = await query(`SELECT * FROM packages WHERE id = $1`, [req.params.id]);
    const packageItem = mapPackage(result.rows[0]);

    if (!packageItem) {
      return res.status(404).json({ message: 'Package not found' });
    }

    res.status(200).json(packageItem);
  } catch (error) {
    console.error('Error in getPackage:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const createPackage = async (req, res) => {
  try {
    const {
      name,
      title,
      subtitle,
      icon,
      features,
      delivery,
      priceUSD,
      priceEGP,
      featured,
      order,
    } = req.body;

    const nameI18n = toI18nText(name);
    const titleI18n = toI18nText(title);
    const subtitleI18n = toI18nText(subtitle);
    const deliveryI18n = toI18nText(delivery);
    const featuresI18n = toI18nList(features);

    if (
      !hasI18nText(nameI18n) ||
      !hasI18nText(titleI18n) ||
      !hasI18nText(subtitleI18n) ||
      !icon ||
      !hasI18nList(featuresI18n) ||
      !hasI18nText(deliveryI18n) ||
      !priceUSD ||
      !priceEGP
    ) {
      return res.status(400).json({ message: 'All fields are required (EN or AR)' });
    }

    const result = await query(
      `INSERT INTO packages
        (name, title, subtitle, icon, features, delivery, price_usd, price_egp, featured, sort_order)
       VALUES ($1::jsonb, $2::jsonb, $3::jsonb, $4, $5::jsonb, $6::jsonb, $7, $8, $9, $10)
       RETURNING *`,
      [
        JSON.stringify(nameI18n),
        JSON.stringify(titleI18n),
        JSON.stringify(subtitleI18n),
        icon,
        JSON.stringify(featuresI18n),
        JSON.stringify(deliveryI18n),
        priceUSD,
        priceEGP,
        featured || false,
        order || 0,
      ]
    );

    res.status(201).json(mapPackage(result.rows[0]));
  } catch (error) {
    console.error('Error in createPackage:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const updatePackage = async (req, res) => {
  try {
    const existing = await query(`SELECT * FROM packages WHERE id = $1`, [req.params.id]);
    if (!existing.rows[0]) {
      return res.status(404).json({ message: 'Package not found' });
    }

    const current = existing.rows[0];
    const {
      name = current.name,
      title = current.title,
      subtitle = current.subtitle,
      icon = current.icon,
      features = current.features,
      delivery = current.delivery,
      priceUSD = current.price_usd,
      priceEGP = current.price_egp,
      featured = current.featured,
      order = current.sort_order,
      isActive = current.is_active,
    } = req.body;

    const result = await query(
      `UPDATE packages SET
        name = $1::jsonb,
        title = $2::jsonb,
        subtitle = $3::jsonb,
        icon = $4,
        features = $5::jsonb,
        delivery = $6::jsonb,
        price_usd = $7,
        price_egp = $8,
        featured = $9,
        sort_order = $10,
        is_active = $11,
        updated_at = CURRENT_TIMESTAMP
       WHERE id = $12
       RETURNING *`,
      [
        JSON.stringify(toI18nText(name)),
        JSON.stringify(toI18nText(title)),
        JSON.stringify(toI18nText(subtitle)),
        icon,
        JSON.stringify(toI18nList(features)),
        JSON.stringify(toI18nText(delivery)),
        priceUSD,
        priceEGP,
        featured,
        order,
        isActive,
        req.params.id,
      ]
    );

    res.status(200).json(mapPackage(result.rows[0]));
  } catch (error) {
    console.error('Error in updatePackage:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const deletePackage = async (req, res) => {
  try {
    const result = await query(`DELETE FROM packages WHERE id = $1 RETURNING id`, [req.params.id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Package not found' });
    }

    res.status(200).json({ message: 'Package deleted successfully' });
  } catch (error) {
    console.error('Error in deletePackage:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getPackageStats = async (req, res) => {
  try {
    const result = await query(`
      SELECT
        COUNT(*)::int AS total_packages,
        COUNT(*) FILTER (WHERE is_active)::int AS active_packages,
        COUNT(*) FILTER (WHERE featured)::int AS featured_packages
      FROM packages
    `);

    const row = result.rows[0];
    res.status(200).json({
      totalPackages: row.total_packages,
      activePackages: row.active_packages,
      featuredPackages: row.featured_packages,
    });
  } catch (error) {
    console.error('Error in getPackageStats:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
