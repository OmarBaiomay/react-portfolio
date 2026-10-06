import express from 'express';
import {
  uploadMedia,
  getMedia,
  listMedia,
  deleteMedia,
  MAX_UPLOAD_BYTES,
} from '../controllers/media.controller.js';
import { protectRoute, requireAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', protectRoute, requireAdmin, listMedia);
router.get('/:id', getMedia);
router.post(
  '/',
  protectRoute,
  requireAdmin,
  express.raw({ type: 'image/*', limit: MAX_UPLOAD_BYTES }),
  uploadMedia
);
router.delete('/:id', protectRoute, requireAdmin, deleteMedia);

export default router;
