import express from 'express';
import {
  listPublishedPosts,
  getPublishedPost,
  listAllPosts,
  createPost,
  updatePost,
  deletePost,
} from '../controllers/blog.controller.js';
import { protectRoute, requireAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/admin/all', protectRoute, requireAdmin, listAllPosts);
router.post('/', protectRoute, requireAdmin, createPost);
router.put('/:id', protectRoute, requireAdmin, updatePost);
router.delete('/:id', protectRoute, requireAdmin, deletePost);

router.get('/', listPublishedPosts);
router.get('/:slug', getPublishedPost);

export default router;
