import express from 'express';
import {
  getAllPlans,
  getPlan,
  createPlan,
  updatePlan,
  deletePlan,
  getMaintenanceStats,
} from '../controllers/maintenance.controller.js';
import { protectRoute, requireAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', getAllPlans);
router.get('/stats', getMaintenanceStats);
router.get('/:id', getPlan);

router.post('/', protectRoute, requireAdmin, createPlan);
router.put('/:id', protectRoute, requireAdmin, updatePlan);
router.delete('/:id', protectRoute, requireAdmin, deletePlan);

export default router;
