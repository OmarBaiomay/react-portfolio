import bcrypt from 'bcryptjs';
import { query } from '../db/pg-connection.js';
import { generateToken } from '../lib/utils.js';
import cloudinary from '../lib/cloudinary.js';
import { mapUser } from '../lib/mappers.js';

const USER_RETURNING = `id, full_name, email, role, profile_pic, details, fcm_tokens, created_at, updated_at`;

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    if (process.env.ALLOW_PUBLIC_SIGNUP === 'false') {
      const count = await query('SELECT COUNT(*)::int AS count FROM users');
      if (count.rows[0].count > 0) {
        return res.status(403).json({ message: 'Public signup is disabled' });
      }
    }

    const existing = await query('SELECT id FROM users WHERE email = $1', [email.toLowerCase()]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ message: 'Email already exists!' });
    }

    const hashPass = await bcrypt.hash(password, 10);

    const result = await query(
      `INSERT INTO users (full_name, email, password_hash, role)
       VALUES ($1, $2, $3, 'admin')
       RETURNING ${USER_RETURNING}`,
      [fullName, email.toLowerCase(), hashPass]
    );

    const user = mapUser(result.rows[0]);
    const token = generateToken(user.id, res);

    res.status(201).json({ ...user, token });
  } catch (error) {
    console.error('Error in Sign Up Controller:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const login = async (req, res) => {
  const { email, password, fcmToken } = req.body;

  try {
    const result = await query(
      `SELECT id, full_name, email, password_hash, role, profile_pic, details, fcm_tokens, created_at, updated_at
       FROM users WHERE email = $1`,
      [email?.toLowerCase()]
    );

    const row = result.rows[0];
    if (!row) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }

    const isPassCorrect = await bcrypt.compare(password, row.password_hash);
    if (!isPassCorrect) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }

    let fcmTokens = row.fcm_tokens || [];
    if (fcmToken && !fcmTokens.includes(fcmToken)) {
      fcmTokens = [...fcmTokens, fcmToken];
      await query(
        `UPDATE users SET fcm_tokens = $1::jsonb, updated_at = CURRENT_TIMESTAMP WHERE id = $2`,
        [JSON.stringify(fcmTokens), row.id]
      );
      row.fcm_tokens = fcmTokens;
    }

    const user = mapUser(row);
    const token = generateToken(user.id, res);

    res.status(200).json({ ...user, token });
  } catch (error) {
    console.log('Error in login Controller', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const logout = (req, res) => {
  try {
    res.cookie('jwt_token', '', { maxAge: 0 });
    res.status(200).json({ message: 'Logged out Successfully' });
  } catch (error) {
    console.log('Error in logout Controller', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user.id;

    if (!profilePic) {
      return res.status(400).json({ message: 'Profile pic is required' });
    }

    const uploadRes = await cloudinary.uploader.upload(profilePic);

    const result = await query(
      `UPDATE users SET profile_pic = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING ${USER_RETURNING}`,
      [uploadRes.secure_url, userId]
    );

    return res.status(200).json(mapUser(result.rows[0]));
  } catch (error) {
    console.log('Error in Update Profile Controller', error.message);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const updateAccount = async (req, res) => {
  try {
    const userId = req.user.id;
    const { fullName, email, details, currentPassword, newPassword } = req.body || {};

    const existing = await query(
      `SELECT id, full_name, email, details, password_hash FROM users WHERE id = $1`,
      [userId]
    );
    const current = existing.rows[0];
    if (!current) return res.status(404).json({ message: 'User not found' });

    const nextName = (fullName ?? current.full_name).toString().trim();
    const nextEmail = (email ?? current.email).toString().trim().toLowerCase();
    const nextDetails = (details ?? current.details ?? '').toString().trim();

    if (!nextName || !nextEmail) {
      return res.status(400).json({ message: 'Name and email are required' });
    }

    const emailTaken = await query(
      `SELECT id FROM users WHERE email = $1 AND id <> $2`,
      [nextEmail, userId]
    );
    if (emailTaken.rows.length) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    let passwordHash = current.password_hash;
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ message: 'Current password is required' });
      }
      if (newPassword.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters long' });
      }
      const ok = await bcrypt.compare(currentPassword, current.password_hash);
      if (!ok) {
        return res.status(400).json({ message: 'Current password is incorrect' });
      }
      passwordHash = await bcrypt.hash(newPassword, 10);
    }

    const result = await query(
      `UPDATE users SET
        full_name = $1,
        email = $2,
        details = $3,
        password_hash = $4,
        updated_at = CURRENT_TIMESTAMP
       WHERE id = $5
       RETURNING ${USER_RETURNING}`,
      [nextName, nextEmail, nextDetails, passwordHash, userId]
    );

    res.json(mapUser(result.rows[0]));
  } catch (error) {
    console.error('updateAccount:', error.message);
    res.status(500).json({ message: 'Failed to update account' });
  }
};

export const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log('Error in Check Auth Controller', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
