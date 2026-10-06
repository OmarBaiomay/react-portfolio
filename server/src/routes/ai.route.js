import express from 'express';
import {
  getSettings,
  updateSettings,
  testProvider,
  createProjectJob,
  createBlogJob,
  getJobStatus,
  getJobs,
} from '../controllers/ai.controller.js';
import { protectRoute, requireAdmin, requireSuperAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protectRoute, requireAdmin);

// API keys: admins only (editors can still run the assistant).
router.get('/settings', getSettings);
router.put('/settings', requireSuperAdmin, updateSettings);
router.post('/test', testProvider);

router.post('/jobs/project', createProjectJob);
router.post('/jobs/blog', createBlogJob);
router.get('/jobs', getJobs);
router.get('/jobs/:id', getJobStatus);

export default router;
