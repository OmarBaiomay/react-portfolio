import express from 'express';
import {
  getPublicTheme,
  updateTheme,
  getPublicManifesto,
  updateManifesto,
  getPublicHeroScene,
  updateHeroScene,
} from '../controllers/settings.controller.js';
import { protectRoute, requireAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/theme', getPublicTheme);
router.put('/theme', protectRoute, requireAdmin, updateTheme);

router.get('/manifesto', getPublicManifesto);
router.put('/manifesto', protectRoute, requireAdmin, updateManifesto);

router.get('/hero-scene', getPublicHeroScene);
router.put('/hero-scene', protectRoute, requireAdmin, updateHeroScene);

export default router;
