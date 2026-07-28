import express from 'express';
import {
  createLeadAdmin,
  createLeadPublic,
  convertLeadToProject,
  deleteLead,
  getLead,
  getLeads,
  getLeadStats,
  updateLead,
} from '../controllers/leads.controller.js';
import { protectRoute, requireAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/', createLeadPublic);
router.get('/stats', protectRoute, requireAdmin, getLeadStats);
router.get('/', protectRoute, requireAdmin, getLeads);
router.get('/:id', protectRoute, requireAdmin, getLead);
router.post('/admin', protectRoute, requireAdmin, createLeadAdmin);
router.patch('/:id', protectRoute, requireAdmin, updateLead);
router.delete('/:id', protectRoute, requireAdmin, deleteLead);
router.post('/:id/convert', protectRoute, requireAdmin, convertLeadToProject);

export default router;
