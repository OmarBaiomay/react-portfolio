import express from 'express';
import {
  getAllPackages,
  getPackage,
  createPackage,
  updatePackage,
  deletePackage,
  getPackageStats,
} from '../controllers/package.controller.js';
import { protectRoute, requireAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', getAllPackages);
router.get('/stats', getPackageStats);
router.get('/:id', getPackage);

router.post('/', protectRoute, requireAdmin, createPackage);
router.put('/:id', protectRoute, requireAdmin, updatePackage);
router.delete('/:id', protectRoute, requireAdmin, deletePackage);

export default router;
