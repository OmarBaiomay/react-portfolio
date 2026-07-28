import { query } from '../db/pg-connection.js';

export const getOverviewStats = async (req, res) => {
  try {
    const leads = await query(
      `SELECT
         COUNT(*) FILTER (WHERE is_archived = FALSE)::int AS total,
         COUNT(*) FILTER (
           WHERE is_archived = FALSE
             AND created_at >= date_trunc('month', CURRENT_TIMESTAMP)
         )::int AS new_this_month,
         COUNT(*) FILTER (WHERE is_archived = FALSE AND status = 'new')::int AS new_count
       FROM leads`
    );

    const leadStatus = await query(
      `SELECT status, COUNT(*)::int AS count
       FROM leads WHERE is_archived = FALSE GROUP BY status`
    );

    const projects = await query(
      `SELECT
         COUNT(*)::int AS total,
         COUNT(*) FILTER (WHERE status = 'active')::int AS active,
         COUNT(*) FILTER (WHERE status = 'done')::int AS completed
       FROM projects`
    );

    const overdueTasks = await query(
      `SELECT COUNT(*)::int AS overdue
       FROM tasks
       WHERE status != 'done' AND due_date IS NOT NULL AND due_date < CURRENT_DATE`
    );

    const sales = await query(
      `SELECT
         (SELECT COALESCE(SUM(total), 0)::float FROM quotes WHERE status IN ('draft', 'sent')) AS open_quotes,
         (SELECT COALESCE(SUM(total), 0)::float FROM invoices WHERE status IN ('draft', 'sent', 'overdue')) AS unpaid,
         (SELECT COALESCE(SUM(total), 0)::float FROM invoices
            WHERE status = 'paid' AND updated_at >= date_trunc('month', CURRENT_TIMESTAMP)) AS paid_month`
    );

    const packages = await query(
      `SELECT COUNT(*)::int AS total, COUNT(*) FILTER (WHERE is_active)::int AS active FROM packages`
    );
    const maintenance = await query(
      `SELECT COUNT(*)::int AS total, COUNT(*) FILTER (WHERE is_active)::int AS active FROM maintenance_plans`
    );

    const byStatus = {};
    leadStatus.rows.forEach((r) => {
      byStatus[r.status] = r.count;
    });

    res.json({
      leads: {
        total: leads.rows[0].total,
        newThisMonth: leads.rows[0].new_this_month,
        newCount: leads.rows[0].new_count,
        byStatus,
      },
      projects: {
        total: projects.rows[0].total,
        active: projects.rows[0].active,
        completed: projects.rows[0].completed,
        overdueTasks: overdueTasks.rows[0].overdue,
      },
      sales: {
        openQuotesValue: sales.rows[0].open_quotes,
        unpaidInvoicesValue: sales.rows[0].unpaid,
        paidThisMonth: sales.rows[0].paid_month,
      },
      catalog: {
        packages: packages.rows[0].total,
        activePackages: packages.rows[0].active,
        maintenance: maintenance.rows[0].total,
        activePlans: maintenance.rows[0].active,
      },
    });
  } catch (error) {
    console.error('Error getOverviewStats:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
