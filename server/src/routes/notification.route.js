import express from 'express';
import {
  sendToUser,
  sendToAllAdmins,
  sendToTopic,
} from '../controllers/notification.controller.js';
import { protectRoute, requireAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/send-to-user', protectRoute, requireAdmin, sendToUser);
router.post('/send-to-admins', protectRoute, requireAdmin, sendToAllAdmins);
router.post('/send-to-topic', protectRoute, requireAdmin, sendToTopic);

export default router;
