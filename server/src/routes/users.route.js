import express from 'express';
import {
  listUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} from '../controllers/users.controller.js';
import { protectRoute, requireSuperAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protectRoute, requireSuperAdmin);

router.get('/', listUsers);
router.get('/:id', getUser);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;
