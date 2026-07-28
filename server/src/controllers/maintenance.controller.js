import { query } from '../db/pg-connection.js';
import { mapMaintenance } from '../lib/mappers.js';
import { hasI18nList, hasI18nText, toI18nList, toI18nText } from '../lib/i18n.js';

export const getAllPlans = async (req, res) => {
  try {
    const result = await query(
      `SELECT * FROM maintenance_plans WHERE is_active = TRUE ORDER BY sort_order ASC`
    );
    res.status(200).json(result.rows.map(mapMaintenance));
  } catch (error) {
    console.error('Error in getAllPlans:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getPlan = async (req, res) => {
  try {
    const result = await query(`SELECT * FROM maintenance_plans WHERE id = $1`, [req.params.id]);
    const plan = mapMaintenance(result.rows[0]);

    if (!plan) {
      return res.status(404).json({ message: 'Plan not found' });
    }

    res.status(200).json(plan);
  } catch (error) {
    console.error('Error in getPlan:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const createPlan = async (req, res) => {
  try {
    const { name, features, priceUSD, priceEGP, order } = req.body;

    const nameI18n = toI18nText(name);
    const featuresI18n = toI18nList(features);

    if (!hasI18nText(nameI18n) || !hasI18nList(featuresI18n) || !priceUSD || !priceEGP) {
      return res.status(400).json({ message: 'All fields are required (EN or AR)' });
    }

    const result = await query(
      `INSERT INTO maintenance_plans (name, features, price_usd, price_egp, sort_order)
       VALUES ($1::jsonb, $2::jsonb, $3, $4, $5)
       RETURNING *`,
      [JSON.stringify(nameI18n), JSON.stringify(featuresI18n), priceUSD, priceEGP, order || 0]
    );

    res.status(201).json(mapMaintenance(result.rows[0]));
  } catch (error) {
    console.error('Error in createPlan:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const updatePlan = async (req, res) => {
  try {
    const existing = await query(`SELECT * FROM maintenance_plans WHERE id = $1`, [req.params.id]);
    if (!existing.rows[0]) {
      return res.status(404).json({ message: 'Plan not found' });
    }

    const current = existing.rows[0];
    const {
      name = current.name,
      features = current.features,
      priceUSD = current.price_usd,
      priceEGP = current.price_egp,
      order = current.sort_order,
      isActive = current.is_active,
    } = req.body;

    const result = await query(
      `UPDATE maintenance_plans SET
        name = $1::jsonb,
        features = $2::jsonb,
        price_usd = $3,
        price_egp = $4,
        sort_order = $5,
        is_active = $6,
        updated_at = CURRENT_TIMESTAMP
       WHERE id = $7
       RETURNING *`,
      [
        JSON.stringify(toI18nText(name)),
        JSON.stringify(toI18nList(features)),
        priceUSD,
        priceEGP,
        order,
        isActive,
        req.params.id,
      ]
    );

    res.status(200).json(mapMaintenance(result.rows[0]));
  } catch (error) {
    console.error('Error in updatePlan:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const deletePlan = async (req, res) => {
  try {
    const result = await query(`DELETE FROM maintenance_plans WHERE id = $1 RETURNING id`, [
      req.params.id,
    ]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Plan not found' });
    }

    res.status(200).json({ message: 'Plan deleted successfully' });
  } catch (error) {
    console.error('Error in deletePlan:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getMaintenanceStats = async (req, res) => {
  try {
    const result = await query(`
      SELECT
        COUNT(*)::int AS total_plans,
        COUNT(*) FILTER (WHERE is_active)::int AS active_plans
      FROM maintenance_plans
    `);

    const row = result.rows[0];
    res.status(200).json({
      totalPlans: row.total_plans,
      activePlans: row.active_plans,
    });
  } catch (error) {
    console.error('Error in getMaintenanceStats:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
