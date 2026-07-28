import { query } from '../db/pg-connection.js';
import { mapMilestone, mapProject, mapTask } from '../lib/crmMappers.js';

const PROJECT_STATUSES = ['planned', 'active', 'on_hold', 'done', 'cancelled'];
const MILESTONE_STATUSES = ['pending', 'in_progress', 'done'];
const TASK_STATUSES = ['todo', 'doing', 'done'];

export const getProjects = async (req, res) => {
  try {
    const { status } = req.query;
    const params = [];
    let where = '';
    if (status && PROJECT_STATUSES.includes(status)) {
      params.push(status);
      where = `WHERE status = $1`;
    }
    const result = await query(
      `SELECT * FROM projects ${where} ORDER BY updated_at DESC`,
      params
    );
    res.json(result.rows.map(mapProject));
  } catch (error) {
    console.error('Error in getProjects:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getProject = async (req, res) => {
  try {
    const projectRes = await query(`SELECT * FROM projects WHERE id = $1`, [req.params.id]);
    const project = mapProject(projectRes.rows[0]);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const milestones = await query(
      `SELECT * FROM milestones WHERE project_id = $1 ORDER BY sort_order ASC, created_at ASC`,
      [req.params.id]
    );
    const tasks = await query(
      `SELECT * FROM tasks WHERE project_id = $1 ORDER BY sort_order ASC, created_at ASC`,
      [req.params.id]
    );

    res.json({
      ...project,
      milestones: milestones.rows.map(mapMilestone),
      tasks: tasks.rows.map(mapTask),
    });
  } catch (error) {
    console.error('Error in getProject:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const createProject = async (req, res) => {
  try {
    const b = req.body || {};
    const title = String(b.title || '').trim();
    if (!title) return res.status(400).json({ message: 'Title is required' });

    const status = PROJECT_STATUSES.includes(b.status) ? b.status : 'planned';
    const result = await query(
      `INSERT INTO projects
        (title, description, status, lead_id, client_name, client_email, client_phone, start_date, due_date, budget)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [
        title,
        String(b.description || ''),
        status,
        b.leadId || null,
        String(b.clientName || ''),
        String(b.clientEmail || ''),
        String(b.clientPhone || ''),
        b.startDate || null,
        b.dueDate || null,
        b.budget != null && b.budget !== '' ? Number(b.budget) : null,
      ]
    );
    res.status(201).json(mapProject(result.rows[0]));
  } catch (error) {
    console.error('Error in createProject:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const updateProject = async (req, res) => {
  try {
    const existing = await query(`SELECT * FROM projects WHERE id = $1`, [req.params.id]);
    if (!existing.rows[0]) return res.status(404).json({ message: 'Project not found' });
    const cur = existing.rows[0];
    const b = req.body || {};
    const status =
      b.status !== undefined && PROJECT_STATUSES.includes(b.status) ? b.status : cur.status;

    const result = await query(
      `UPDATE projects SET
        title = $1, description = $2, status = $3, lead_id = $4,
        client_name = $5, client_email = $6, client_phone = $7,
        start_date = $8, due_date = $9, budget = $10, updated_at = CURRENT_TIMESTAMP
       WHERE id = $11 RETURNING *`,
      [
        b.title !== undefined ? String(b.title).trim() : cur.title,
        b.description !== undefined ? String(b.description) : cur.description,
        status,
        b.leadId !== undefined ? b.leadId || null : cur.lead_id,
        b.clientName !== undefined ? String(b.clientName) : cur.client_name,
        b.clientEmail !== undefined ? String(b.clientEmail) : cur.client_email,
        b.clientPhone !== undefined ? String(b.clientPhone) : cur.client_phone,
        b.startDate !== undefined ? b.startDate || null : cur.start_date,
        b.dueDate !== undefined ? b.dueDate || null : cur.due_date,
        b.budget !== undefined
          ? b.budget != null && b.budget !== ''
            ? Number(b.budget)
            : null
          : cur.budget,
        req.params.id,
      ]
    );
    res.json(mapProject(result.rows[0]));
  } catch (error) {
    console.error('Error in updateProject:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const result = await query(`DELETE FROM projects WHERE id = $1 RETURNING id`, [req.params.id]);
    if (!result.rows[0]) return res.status(404).json({ message: 'Project not found' });
    res.json({ message: 'Project deleted' });
  } catch (error) {
    console.error('Error in deleteProject:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const createMilestone = async (req, res) => {
  try {
    const projectId = req.params.id;
    const title = String(req.body?.title || '').trim();
    if (!title) return res.status(400).json({ message: 'Title is required' });

    const result = await query(
      `INSERT INTO milestones (project_id, title, description, status, due_date, sort_order)
       VALUES ($1, $2, $3, $4, $5, COALESCE($6, 0))
       RETURNING *`,
      [
        projectId,
        title,
        String(req.body?.description || ''),
        MILESTONE_STATUSES.includes(req.body?.status) ? req.body.status : 'pending',
        req.body?.dueDate || null,
        req.body?.sortOrder ?? 0,
      ]
    );
    res.status(201).json(mapMilestone(result.rows[0]));
  } catch (error) {
    console.error('Error in createMilestone:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const updateMilestone = async (req, res) => {
  try {
    const existing = await query(`SELECT * FROM milestones WHERE id = $1`, [req.params.milestoneId]);
    if (!existing.rows[0]) return res.status(404).json({ message: 'Milestone not found' });
    const cur = existing.rows[0];
    const b = req.body || {};
    const status =
      b.status !== undefined && MILESTONE_STATUSES.includes(b.status) ? b.status : cur.status;

    const result = await query(
      `UPDATE milestones SET
        title = $1, description = $2, status = $3, due_date = $4, sort_order = $5,
        updated_at = CURRENT_TIMESTAMP
       WHERE id = $6 RETURNING *`,
      [
        b.title !== undefined ? String(b.title).trim() : cur.title,
        b.description !== undefined ? String(b.description) : cur.description,
        status,
        b.dueDate !== undefined ? b.dueDate || null : cur.due_date,
        b.sortOrder !== undefined ? Number(b.sortOrder) : cur.sort_order,
        req.params.milestoneId,
      ]
    );
    res.json(mapMilestone(result.rows[0]));
  } catch (error) {
    console.error('Error in updateMilestone:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const deleteMilestone = async (req, res) => {
  try {
    const result = await query(`DELETE FROM milestones WHERE id = $1 RETURNING id`, [
      req.params.milestoneId,
    ]);
    if (!result.rows[0]) return res.status(404).json({ message: 'Milestone not found' });
    res.json({ message: 'Milestone deleted' });
  } catch (error) {
    console.error('Error in deleteMilestone:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const createTask = async (req, res) => {
  try {
    const projectId = req.params.id;
    const title = String(req.body?.title || '').trim();
    if (!title) return res.status(400).json({ message: 'Title is required' });

    const result = await query(
      `INSERT INTO tasks
        (project_id, milestone_id, title, status, assignee_id, due_date, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6, COALESCE($7, 0))
       RETURNING *`,
      [
        projectId,
        req.body?.milestoneId || null,
        title,
        TASK_STATUSES.includes(req.body?.status) ? req.body.status : 'todo',
        req.body?.assigneeId || null,
        req.body?.dueDate || null,
        req.body?.sortOrder ?? 0,
      ]
    );
    res.status(201).json(mapTask(result.rows[0]));
  } catch (error) {
    console.error('Error in createTask:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const updateTask = async (req, res) => {
  try {
    const existing = await query(`SELECT * FROM tasks WHERE id = $1`, [req.params.taskId]);
    if (!existing.rows[0]) return res.status(404).json({ message: 'Task not found' });
    const cur = existing.rows[0];
    const b = req.body || {};
    const status =
      b.status !== undefined && TASK_STATUSES.includes(b.status) ? b.status : cur.status;

    const result = await query(
      `UPDATE tasks SET
        title = $1, status = $2, milestone_id = $3, assignee_id = $4, due_date = $5,
        sort_order = $6, updated_at = CURRENT_TIMESTAMP
       WHERE id = $7 RETURNING *`,
      [
        b.title !== undefined ? String(b.title).trim() : cur.title,
        status,
        b.milestoneId !== undefined ? b.milestoneId || null : cur.milestone_id,
        b.assigneeId !== undefined ? b.assigneeId || null : cur.assignee_id,
        b.dueDate !== undefined ? b.dueDate || null : cur.due_date,
        b.sortOrder !== undefined ? Number(b.sortOrder) : cur.sort_order,
        req.params.taskId,
      ]
    );
    res.json(mapTask(result.rows[0]));
  } catch (error) {
    console.error('Error in updateTask:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const result = await query(`DELETE FROM tasks WHERE id = $1 RETURNING id`, [req.params.taskId]);
    if (!result.rows[0]) return res.status(404).json({ message: 'Task not found' });
    res.json({ message: 'Task deleted' });
  } catch (error) {
    console.error('Error in deleteTask:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getProjectStats = async (req, res) => {
  try {
    const projects = await query(
      `SELECT
         COUNT(*)::int AS total,
         COUNT(*) FILTER (WHERE status = 'active')::int AS active,
         COUNT(*) FILTER (WHERE status = 'done')::int AS completed
       FROM projects`
    );
    const tasks = await query(
      `SELECT COUNT(*)::int AS overdue
       FROM tasks
       WHERE status != 'done'
         AND due_date IS NOT NULL
         AND due_date < CURRENT_DATE`
    );
    res.json({
      total: projects.rows[0].total,
      active: projects.rows[0].active,
      completed: projects.rows[0].completed,
      overdueTasks: tasks.rows[0].overdue,
    });
  } catch (error) {
    console.error('Error in getProjectStats:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
