import express from 'express';
import { getOverviewStats } from '../controllers/stats.controller.js';
import { protectRoute, requireAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/overview', protectRoute, requireAdmin, getOverviewStats);

export default router;
