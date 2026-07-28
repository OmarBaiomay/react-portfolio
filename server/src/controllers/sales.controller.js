import { query } from '../db/pg-connection.js';
import { computeLineTotals, mapSalesDoc } from '../lib/crmMappers.js';

const STATUSES = {
  quotes: ['draft', 'sent', 'accepted', 'rejected', 'expired'],
  contracts: ['draft', 'sent', 'signed', 'cancelled'],
  invoices: ['draft', 'sent', 'paid', 'overdue', 'cancelled'],
};

const PREFIX = { quotes: 'Q', contracts: 'C', invoices: 'INV' };

async function nextNumber(table, prefix) {
  const year = new Date().getFullYear();
  const like = `${prefix}-${year}-%`;
  const result = await query(
    `SELECT number FROM ${table} WHERE number LIKE $1 ORDER BY number DESC LIMIT 1`,
    [like]
  );
  let seq = 1;
  if (result.rows[0]?.number) {
    const parts = result.rows[0].number.split('-');
    const n = parseInt(parts[2], 10);
    if (!Number.isNaN(n)) seq = n + 1;
  }
  return `${prefix}-${year}-${String(seq).padStart(4, '0')}`;
}

function makeController(table, type) {
  const statuses = STATUSES[table];

  const list = async (req, res) => {
    try {
      const { status } = req.query;
      const params = [];
      let where = '';
      if (status && statuses.includes(status)) {
        params.push(status);
        where = `WHERE status = $1`;
      }
      const result = await query(
        `SELECT * FROM ${table} ${where} ORDER BY created_at DESC`,
        params
      );
      res.json(result.rows.map((r) => mapSalesDoc(r, type)));
    } catch (error) {
      console.error(`Error listing ${table}:`, error.message);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };

  const getOne = async (req, res) => {
    try {
      const result = await query(`SELECT * FROM ${table} WHERE id = $1`, [req.params.id]);
      const doc = mapSalesDoc(result.rows[0], type);
      if (!doc) return res.status(404).json({ message: 'Not found' });
      res.json(doc);
    } catch (error) {
      console.error(`Error get ${table}:`, error.message);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };

  const create = async (req, res) => {
    try {
      const b = req.body || {};
      const { lineItems, subtotal, tax, total } = computeLineTotals(b.lineItems, b.tax);
      const number = b.number || (await nextNumber(table, PREFIX[table]));
      const status = statuses.includes(b.status) ? b.status : 'draft';

      let result;
      if (table === 'quotes') {
        result = await query(
          `INSERT INTO quotes
            (number, lead_id, project_id, status, currency, subtotal, tax, total, issue_date, valid_until, notes, line_items)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12::jsonb) RETURNING *`,
          [
            number,
            b.leadId || null,
            b.projectId || null,
            status,
            b.currency || 'EGP',
            subtotal,
            tax,
            total,
            b.issueDate || new Date().toISOString().slice(0, 10),
            b.validUntil || null,
            String(b.notes || ''),
            JSON.stringify(lineItems),
          ]
        );
      } else if (table === 'contracts') {
        result = await query(
          `INSERT INTO contracts
            (number, lead_id, project_id, quote_id, status, currency, subtotal, tax, total, issue_date, valid_until, notes, line_items)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13::jsonb) RETURNING *`,
          [
            number,
            b.leadId || null,
            b.projectId || null,
            b.quoteId || null,
            status,
            b.currency || 'EGP',
            subtotal,
            tax,
            total,
            b.issueDate || new Date().toISOString().slice(0, 10),
            b.validUntil || null,
            String(b.notes || ''),
            JSON.stringify(lineItems),
          ]
        );
      } else {
        result = await query(
          `INSERT INTO invoices
            (number, lead_id, project_id, quote_id, contract_id, status, currency, subtotal, tax, total, issue_date, due_date, notes, line_items)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14::jsonb) RETURNING *`,
          [
            number,
            b.leadId || null,
            b.projectId || null,
            b.quoteId || null,
            b.contractId || null,
            status,
            b.currency || 'EGP',
            subtotal,
            tax,
            total,
            b.issueDate || new Date().toISOString().slice(0, 10),
            b.dueDate || null,
            String(b.notes || ''),
            JSON.stringify(lineItems),
          ]
        );
      }

      res.status(201).json(mapSalesDoc(result.rows[0], type));
    } catch (error) {
      console.error(`Error create ${table}:`, error.message);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };

  const update = async (req, res) => {
    try {
      const existing = await query(`SELECT * FROM ${table} WHERE id = $1`, [req.params.id]);
      if (!existing.rows[0]) return res.status(404).json({ message: 'Not found' });
      const cur = existing.rows[0];
      const b = req.body || {};

      const lineSource = b.lineItems !== undefined ? b.lineItems : cur.line_items;
      const taxSource = b.tax !== undefined ? b.tax : cur.tax;
      const { lineItems, subtotal, tax, total } = computeLineTotals(lineSource, taxSource);
      const status =
        b.status !== undefined && statuses.includes(b.status) ? b.status : cur.status;

      let result;
      if (table === 'quotes') {
        result = await query(
          `UPDATE quotes SET
            lead_id=$1, project_id=$2, status=$3, currency=$4, subtotal=$5, tax=$6, total=$7,
            issue_date=$8, valid_until=$9, notes=$10, line_items=$11::jsonb, updated_at=CURRENT_TIMESTAMP
           WHERE id=$12 RETURNING *`,
          [
            b.leadId !== undefined ? b.leadId || null : cur.lead_id,
            b.projectId !== undefined ? b.projectId || null : cur.project_id,
            status,
            b.currency || cur.currency,
            subtotal,
            tax,
            total,
            b.issueDate !== undefined ? b.issueDate : cur.issue_date,
            b.validUntil !== undefined ? b.validUntil || null : cur.valid_until,
            b.notes !== undefined ? String(b.notes) : cur.notes,
            JSON.stringify(lineItems),
            req.params.id,
          ]
        );
      } else if (table === 'contracts') {
        result = await query(
          `UPDATE contracts SET
            lead_id=$1, project_id=$2, quote_id=$3, status=$4, currency=$5, subtotal=$6, tax=$7, total=$8,
            issue_date=$9, valid_until=$10, notes=$11, line_items=$12::jsonb, updated_at=CURRENT_TIMESTAMP
           WHERE id=$13 RETURNING *`,
          [
            b.leadId !== undefined ? b.leadId || null : cur.lead_id,
            b.projectId !== undefined ? b.projectId || null : cur.project_id,
            b.quoteId !== undefined ? b.quoteId || null : cur.quote_id,
            status,
            b.currency || cur.currency,
            subtotal,
            tax,
            total,
            b.issueDate !== undefined ? b.issueDate : cur.issue_date,
            b.validUntil !== undefined ? b.validUntil || null : cur.valid_until,
            b.notes !== undefined ? String(b.notes) : cur.notes,
            JSON.stringify(lineItems),
            req.params.id,
          ]
        );
      } else {
        result = await query(
          `UPDATE invoices SET
            lead_id=$1, project_id=$2, quote_id=$3, contract_id=$4, status=$5, currency=$6,
            subtotal=$7, tax=$8, total=$9, issue_date=$10, due_date=$11, notes=$12,
            line_items=$13::jsonb, updated_at=CURRENT_TIMESTAMP
           WHERE id=$14 RETURNING *`,
          [
            b.leadId !== undefined ? b.leadId || null : cur.lead_id,
            b.projectId !== undefined ? b.projectId || null : cur.project_id,
            b.quoteId !== undefined ? b.quoteId || null : cur.quote_id,
            b.contractId !== undefined ? b.contractId || null : cur.contract_id,
            status,
            b.currency || cur.currency,
            subtotal,
            tax,
            total,
            b.issueDate !== undefined ? b.issueDate : cur.issue_date,
            b.dueDate !== undefined ? b.dueDate || null : cur.due_date,
            b.notes !== undefined ? String(b.notes) : cur.notes,
            JSON.stringify(lineItems),
            req.params.id,
          ]
        );
      }

      res.json(mapSalesDoc(result.rows[0], type));
    } catch (error) {
      console.error(`Error update ${table}:`, error.message);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };

  const remove = async (req, res) => {
    try {
      const result = await query(`DELETE FROM ${table} WHERE id = $1 RETURNING id`, [req.params.id]);
      if (!result.rows[0]) return res.status(404).json({ message: 'Not found' });
      res.json({ message: 'Deleted' });
    } catch (error) {
      console.error(`Error delete ${table}:`, error.message);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };

  return { list, getOne, create, update, remove };
}

export const quotes = makeController('quotes', 'quote');
export const contracts = makeController('contracts', 'contract');
export const invoices = makeController('invoices', 'invoice');

export const createContractFromQuote = async (req, res) => {
  try {
    const q = await query(`SELECT * FROM quotes WHERE id = $1`, [req.params.id]);
    if (!q.rows[0]) return res.status(404).json({ message: 'Quote not found' });
    const quote = q.rows[0];
    const number = await nextNumber('contracts', 'C');
    const result = await query(
      `INSERT INTO contracts
        (number, lead_id, project_id, quote_id, status, currency, subtotal, tax, total, issue_date, notes, line_items)
       VALUES ($1,$2,$3,$4,'draft',$5,$6,$7,$8,CURRENT_DATE,$9,$10::jsonb) RETURNING *`,
      [
        number,
        quote.lead_id,
        quote.project_id,
        quote.id,
        quote.currency,
        quote.subtotal,
        quote.tax,
        quote.total,
        quote.notes,
        JSON.stringify(quote.line_items || []),
      ]
    );
    await query(
      `UPDATE quotes SET status = 'accepted', updated_at = CURRENT_TIMESTAMP WHERE id = $1`,
      [quote.id]
    );
    res.status(201).json(mapSalesDoc(result.rows[0], 'contract'));
  } catch (error) {
    console.error('Error createContractFromQuote:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const createInvoiceFromContract = async (req, res) => {
  try {
    const c = await query(`SELECT * FROM contracts WHERE id = $1`, [req.params.id]);
    if (!c.rows[0]) return res.status(404).json({ message: 'Contract not found' });
    const contract = c.rows[0];
    const number = await nextNumber('invoices', 'INV');
    const result = await query(
      `INSERT INTO invoices
        (number, lead_id, project_id, quote_id, contract_id, status, currency, subtotal, tax, total, issue_date, notes, line_items)
       VALUES ($1,$2,$3,$4,$5,'draft',$6,$7,$8,$9,CURRENT_DATE,$10,$11::jsonb) RETURNING *`,
      [
        number,
        contract.lead_id,
        contract.project_id,
        contract.quote_id,
        contract.id,
        contract.currency,
        contract.subtotal,
        contract.tax,
        contract.total,
        contract.notes,
        JSON.stringify(contract.line_items || []),
      ]
    );
    res.status(201).json(mapSalesDoc(result.rows[0], 'invoice'));
  } catch (error) {
    console.error('Error createInvoiceFromContract:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const createInvoiceFromQuote = async (req, res) => {
  try {
    const q = await query(`SELECT * FROM quotes WHERE id = $1`, [req.params.id]);
    if (!q.rows[0]) return res.status(404).json({ message: 'Quote not found' });
    const quote = q.rows[0];
    const number = await nextNumber('invoices', 'INV');
    const result = await query(
      `INSERT INTO invoices
        (number, lead_id, project_id, quote_id, status, currency, subtotal, tax, total, issue_date, notes, line_items)
       VALUES ($1,$2,$3,$4,'draft',$5,$6,$7,$8,CURRENT_DATE,$9,$10::jsonb) RETURNING *`,
      [
        number,
        quote.lead_id,
        quote.project_id,
        quote.id,
        quote.currency,
        quote.subtotal,
        quote.tax,
        quote.total,
        quote.notes,
        JSON.stringify(quote.line_items || []),
      ]
    );
    res.status(201).json(mapSalesDoc(result.rows[0], 'invoice'));
  } catch (error) {
    console.error('Error createInvoiceFromQuote:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getSalesStats = async (req, res) => {
  try {
    const openQuotes = await query(
      `SELECT COALESCE(SUM(total), 0)::float AS value
       FROM quotes WHERE status IN ('draft', 'sent')`
    );
    const unpaid = await query(
      `SELECT COALESCE(SUM(total), 0)::float AS value
       FROM invoices WHERE status IN ('draft', 'sent', 'overdue')`
    );
    const paidMonth = await query(
      `SELECT COALESCE(SUM(total), 0)::float AS value
       FROM invoices
       WHERE status = 'paid'
         AND updated_at >= date_trunc('month', CURRENT_TIMESTAMP)`
    );
    res.json({
      openQuotesValue: openQuotes.rows[0].value,
      unpaidInvoicesValue: unpaid.rows[0].value,
      paidThisMonth: paidMonth.rows[0].value,
    });
  } catch (error) {
    console.error('Error getSalesStats:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
