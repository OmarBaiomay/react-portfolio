import { query } from '../db/pg-connection.js';
import { mapLead, mapProject } from '../lib/crmMappers.js';
import { sendLeadEmails } from '../lib/resend.js';

const LEAD_STATUSES = ['new', 'contacted', 'qualified', 'proposal', 'won', 'lost'];

const honeypotHits = new Map();

function isRateLimited(ip) {
  const now = Date.now();
  const windowMs = 60_000;
  const max = 8;
  const entry = honeypotHits.get(ip) || { count: 0, start: now };
  if (now - entry.start > windowMs) {
    honeypotHits.set(ip, { count: 1, start: now });
    return false;
  }
  entry.count += 1;
  honeypotHits.set(ip, entry);
  return entry.count > max;
}

export const createLeadPublic = async (req, res) => {
  try {
    const ip = req.ip || req.headers['x-forwarded-for'] || 'unknown';
    if (isRateLimited(String(ip))) {
      return res.status(429).json({ message: 'Too many requests. Please try again later.' });
    }

    const {
      name,
      email,
      phone,
      whatsapp,
      whatsappSameAsPhone,
      service,
      message,
      _gotcha,
    } = req.body || {};

    if (_gotcha) {
      return res.status(200).json({ ok: true });
    }

    const cleanName = String(name || '').trim();
    const cleanEmail = String(email || '').trim().toLowerCase();
    const cleanPhone = String(phone || '').trim();
    const same = Boolean(whatsappSameAsPhone);
    const cleanWhatsapp = same ? cleanPhone : String(whatsapp || '').trim();
    const cleanService = String(service || 'web').trim() || 'web';
    const cleanMessage = String(message || '').trim();

    if (!cleanName || !cleanEmail || !cleanPhone || !cleanWhatsapp || !cleanMessage) {
      return res.status(400).json({
        message: 'Name, email, phone, WhatsApp, and message are required',
      });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return res.status(400).json({ message: 'Invalid email address' });
    }

    const result = await query(
      `INSERT INTO leads
        (name, email, phone, whatsapp, whatsapp_same_as_phone, service, message, status, source)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'new', 'website')
       RETURNING *`,
      [cleanName, cleanEmail, cleanPhone, cleanWhatsapp, same, cleanService, cleanMessage]
    );

    const lead = mapLead(result.rows[0]);

    sendLeadEmails(lead).catch((err) => {
      console.error('[leads] notification emails failed:', err?.message || err);
    });

    res.status(201).json(lead);
  } catch (error) {
    console.error('Error in createLeadPublic:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getLeads = async (req, res) => {
  try {
    const { status, archived } = req.query;
    const clauses = [];
    const params = [];

    if (archived === 'true') {
      clauses.push('is_archived = TRUE');
    } else {
      clauses.push('is_archived = FALSE');
    }

    if (status && LEAD_STATUSES.includes(status)) {
      params.push(status);
      clauses.push(`status = $${params.length}`);
    }

    const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
    const result = await query(
      `SELECT * FROM leads ${where} ORDER BY created_at DESC`,
      params
    );
    res.json(result.rows.map(mapLead));
  } catch (error) {
    console.error('Error in getLeads:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getLead = async (req, res) => {
  try {
    const result = await query(`SELECT * FROM leads WHERE id = $1`, [req.params.id]);
    const lead = mapLead(result.rows[0]);
    if (!lead) return res.status(404).json({ message: 'Lead not found' });
    res.json(lead);
  } catch (error) {
    console.error('Error in getLead:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const createLeadAdmin = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      whatsapp,
      whatsappSameAsPhone,
      service,
      message,
      status,
      notes,
      assignedTo,
      source,
    } = req.body || {};

    const cleanName = String(name || '').trim();
    const cleanEmail = String(email || '').trim().toLowerCase();
    const cleanPhone = String(phone || '').trim();
    const same = Boolean(whatsappSameAsPhone);
    const cleanWhatsapp = same ? cleanPhone : String(whatsapp || '').trim();

    if (!cleanName || !cleanEmail || !cleanPhone || !cleanWhatsapp) {
      return res.status(400).json({ message: 'Name, email, phone, and WhatsApp are required' });
    }

    const st = LEAD_STATUSES.includes(status) ? status : 'new';

    const result = await query(
      `INSERT INTO leads
        (name, email, phone, whatsapp, whatsapp_same_as_phone, service, message, status, source, notes, assigned_to)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING *`,
      [
        cleanName,
        cleanEmail,
        cleanPhone,
        cleanWhatsapp,
        same,
        String(service || 'web'),
        String(message || ''),
        st,
        String(source || 'manual'),
        String(notes || ''),
        assignedTo || null,
      ]
    );

    res.status(201).json(mapLead(result.rows[0]));
  } catch (error) {
    console.error('Error in createLeadAdmin:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const updateLead = async (req, res) => {
  try {
    const existing = await query(`SELECT * FROM leads WHERE id = $1`, [req.params.id]);
    if (!existing.rows[0]) return res.status(404).json({ message: 'Lead not found' });

    const cur = existing.rows[0];
    const b = req.body || {};

    const same =
      b.whatsappSameAsPhone !== undefined
        ? Boolean(b.whatsappSameAsPhone)
        : cur.whatsapp_same_as_phone;
    const phone = b.phone !== undefined ? String(b.phone).trim() : cur.phone;
    const whatsapp = same
      ? phone
      : b.whatsapp !== undefined
        ? String(b.whatsapp).trim()
        : cur.whatsapp;

    const status =
      b.status !== undefined && LEAD_STATUSES.includes(b.status) ? b.status : cur.status;

    const result = await query(
      `UPDATE leads SET
        name = $1,
        email = $2,
        phone = $3,
        whatsapp = $4,
        whatsapp_same_as_phone = $5,
        service = $6,
        message = $7,
        status = $8,
        notes = $9,
        assigned_to = $10,
        is_archived = $11,
        updated_at = CURRENT_TIMESTAMP
       WHERE id = $12
       RETURNING *`,
      [
        b.name !== undefined ? String(b.name).trim() : cur.name,
        b.email !== undefined ? String(b.email).trim().toLowerCase() : cur.email,
        phone,
        whatsapp,
        same,
        b.service !== undefined ? String(b.service) : cur.service,
        b.message !== undefined ? String(b.message) : cur.message,
        status,
        b.notes !== undefined ? String(b.notes) : cur.notes,
        b.assignedTo !== undefined ? b.assignedTo || null : cur.assigned_to,
        b.isArchived !== undefined ? Boolean(b.isArchived) : cur.is_archived,
        req.params.id,
      ]
    );

    res.json(mapLead(result.rows[0]));
  } catch (error) {
    console.error('Error in updateLead:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const deleteLead = async (req, res) => {
  try {
    const result = await query(
      `UPDATE leads SET is_archived = TRUE, updated_at = CURRENT_TIMESTAMP
       WHERE id = $1 RETURNING *`,
      [req.params.id]
    );
    if (!result.rows[0]) return res.status(404).json({ message: 'Lead not found' });
    res.json({ message: 'Lead archived', lead: mapLead(result.rows[0]) });
  } catch (error) {
    console.error('Error in deleteLead:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getLeadStats = async (req, res) => {
  try {
    const byStatus = await query(
      `SELECT status, COUNT(*)::int AS count
       FROM leads WHERE is_archived = FALSE
       GROUP BY status`
    );
    const totals = await query(
      `SELECT
         COUNT(*) FILTER (WHERE is_archived = FALSE)::int AS total,
         COUNT(*) FILTER (
           WHERE is_archived = FALSE
             AND created_at >= date_trunc('month', CURRENT_TIMESTAMP)
         )::int AS new_this_month,
         COUNT(*) FILTER (WHERE is_archived = FALSE AND status = 'new')::int AS new_count
       FROM leads`
    );
    const statusMap = Object.fromEntries(LEAD_STATUSES.map((s) => [s, 0]));
    byStatus.rows.forEach((r) => {
      statusMap[r.status] = r.count;
    });
    res.json({
      total: totals.rows[0].total,
      newThisMonth: totals.rows[0].new_this_month,
      newCount: totals.rows[0].new_count,
      byStatus: statusMap,
    });
  } catch (error) {
    console.error('Error in getLeadStats:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const convertLeadToProject = async (req, res) => {
  try {
    const leadRes = await query(`SELECT * FROM leads WHERE id = $1`, [req.params.id]);
    const lead = leadRes.rows[0];
    if (!lead) return res.status(404).json({ message: 'Lead not found' });
    if (lead.converted_project_id) {
      return res.status(400).json({ message: 'Lead already converted', projectId: lead.converted_project_id });
    }

    const title =
      String(req.body?.title || '').trim() ||
      `Project — ${lead.name}`;

    const projectRes = await query(
      `INSERT INTO projects
        (title, description, status, lead_id, client_name, client_email, client_phone, start_date)
       VALUES ($1, $2, 'planned', $3, $4, $5, $6, CURRENT_DATE)
       RETURNING *`,
      [title, lead.message || '', lead.id, lead.name, lead.email, lead.phone]
    );

    const project = projectRes.rows[0];

    await query(
      `UPDATE leads SET
        status = 'won',
        converted_project_id = $1,
        updated_at = CURRENT_TIMESTAMP
       WHERE id = $2`,
      [project.id, lead.id]
    );

    res.status(201).json({
      project: mapProject(project),
      lead: mapLead({ ...lead, status: 'won', converted_project_id: project.id }),
    });
  } catch (error) {
    console.error('Error in convertLeadToProject:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
