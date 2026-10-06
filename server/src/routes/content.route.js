import express from 'express';
import {
  getContent,
  getContentDefaults,
  updateContentPart,
  resetContentPart,
} from '../controllers/content.controller.js';
import { protectRoute, requireAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', getContent);
router.get('/defaults', protectRoute, requireAdmin, getContentDefaults);
router.put('/:part', protectRoute, requireAdmin, updateContentPart);
router.delete('/:part', protectRoute, requireAdmin, resetContentPart);

export default router;
