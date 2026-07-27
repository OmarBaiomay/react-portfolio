import jwt from 'jsonwebtoken';
import { query } from '../db/pg-connection.js';
import { mapUser } from '../lib/mappers.js';

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt_token;

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized - No Token Provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded?.userId) {
      return res.status(401).json({ message: 'Unauthorized - Invalid Token' });
    }

    const result = await query(
      `SELECT id, full_name, email, role, profile_pic, fcm_tokens, created_at, updated_at
       FROM users WHERE id = $1`,
      [decoded.userId]
    );

    const user = mapUser(result.rows[0]);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log('Error in protectRoute middleware:', error.message);
    res.status(401).json({ message: 'Unauthorized - Invalid Token' });
  }
};

export const requireAdmin = (req, res, next) => {
  if (!req.user || !['admin', 'editor'].includes(req.user.role)) {
    return res.status(403).json({ message: 'Forbidden - Admin access required' });
  }
  next();
};
