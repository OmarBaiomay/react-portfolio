import express from 'express';
import {
  createMilestone,
  createProject,
  createTask,
  deleteMilestone,
  deleteProject,
  deleteTask,
  getProject,
  getProjects,
  getProjectStats,
  updateMilestone,
  updateProject,
  updateTask,
} from '../controllers/projects.controller.js';
import { protectRoute, requireAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protectRoute, requireAdmin);

router.get('/stats', getProjectStats);
router.get('/', getProjects);
router.get('/:id', getProject);
router.post('/', createProject);
router.patch('/:id', updateProject);
router.delete('/:id', deleteProject);

router.post('/:id/milestones', createMilestone);
router.patch('/:id/milestones/:milestoneId', updateMilestone);
router.delete('/:id/milestones/:milestoneId', deleteMilestone);

router.post('/:id/tasks', createTask);
router.patch('/:id/tasks/:taskId', updateTask);
router.delete('/:id/tasks/:taskId', deleteTask);

export default router;
