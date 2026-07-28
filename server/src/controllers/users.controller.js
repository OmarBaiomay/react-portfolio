import bcrypt from 'bcryptjs';
import { query } from '../db/pg-connection.js';
import { mapUser } from '../lib/mappers.js';

const USER_COLUMNS = `id, full_name, email, role, profile_pic, details, fcm_tokens, created_at, updated_at`;

export async function listUsers(req, res) {
  try {
    const result = await query(
      `SELECT ${USER_COLUMNS} FROM users ORDER BY created_at ASC`
    );
    res.json(result.rows.map(mapUser));
  } catch (error) {
    console.error('listUsers:', error.message);
    res.status(500).json({ message: 'Failed to load users' });
  }
}

export async function getUser(req, res) {
  try {
    const result = await query(`SELECT ${USER_COLUMNS} FROM users WHERE id = $1`, [
      req.params.id,
    ]);
    const user = mapUser(result.rows[0]);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    console.error('getUser:', error.message);
    res.status(500).json({ message: 'Failed to load user' });
  }
}

export async function createUser(req, res) {
  try {
    const { fullName, email, password, role = 'editor', details = '' } = req.body || {};

    if (!fullName?.trim() || !email?.trim() || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }
    if (!['admin', 'editor'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const existing = await query('SELECT id FROM users WHERE email = $1', [
      email.toLowerCase(),
    ]);
    if (existing.rows.length) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const hashPass = await bcrypt.hash(password, 10);
    const result = await query(
      `INSERT INTO users (full_name, email, password_hash, role, details)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING ${USER_COLUMNS}`,
      [fullName.trim(), email.toLowerCase().trim(), hashPass, role, details?.trim() || '']
    );

    res.status(201).json(mapUser(result.rows[0]));
  } catch (error) {
    console.error('createUser:', error.message);
    res.status(500).json({ message: 'Failed to create user' });
  }
}

export async function updateUser(req, res) {
  try {
    const existing = await query(
      `SELECT id, full_name, email, role, details, password_hash FROM users WHERE id = $1`,
      [req.params.id]
    );
    const current = existing.rows[0];
    if (!current) return res.status(404).json({ message: 'User not found' });

    const {
      fullName = current.full_name,
      email = current.email,
      role = current.role,
      details = current.details,
      password,
    } = req.body || {};

    if (!fullName?.toString().trim() || !email?.toString().trim()) {
      return res.status(400).json({ message: 'Name and email are required' });
    }
    if (!['admin', 'editor'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const nextEmail = email.toLowerCase().trim();
    const emailTaken = await query(
      `SELECT id FROM users WHERE email = $1 AND id <> $2`,
      [nextEmail, req.params.id]
    );
    if (emailTaken.rows.length) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Prevent removing the last admin
    if (current.role === 'admin' && role !== 'admin') {
      const admins = await query(
        `SELECT COUNT(*)::int AS count FROM users WHERE role = 'admin'`
      );
      if (admins.rows[0].count <= 1) {
        return res.status(400).json({ message: 'Cannot demote the last admin' });
      }
    }

    let passwordHash = current.password_hash;
    if (password) {
      if (password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters long' });
      }
      passwordHash = await bcrypt.hash(password, 10);
    }

    const result = await query(
      `UPDATE users SET
        full_name = $1,
        email = $2,
        role = $3,
        details = $4,
        password_hash = $5,
        updated_at = CURRENT_TIMESTAMP
       WHERE id = $6
       RETURNING ${USER_COLUMNS}`,
      [
        fullName.toString().trim(),
        nextEmail,
        role,
        (details ?? '').toString().trim(),
        passwordHash,
        req.params.id,
      ]
    );

    res.json(mapUser(result.rows[0]));
  } catch (error) {
    console.error('updateUser:', error.message);
    res.status(500).json({ message: 'Failed to update user' });
  }
}

export async function deleteUser(req, res) {
  try {
    if (req.user.id === req.params.id) {
      return res.status(400).json({ message: 'You cannot delete your own account' });
    }

    const existing = await query(`SELECT id, role FROM users WHERE id = $1`, [req.params.id]);
    if (!existing.rows[0]) return res.status(404).json({ message: 'User not found' });

    if (existing.rows[0].role === 'admin') {
      const admins = await query(
        `SELECT COUNT(*)::int AS count FROM users WHERE role = 'admin'`
      );
      if (admins.rows[0].count <= 1) {
        return res.status(400).json({ message: 'Cannot delete the last admin' });
      }
    }

    await query(`DELETE FROM users WHERE id = $1`, [req.params.id]);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('deleteUser:', error.message);
    res.status(500).json({ message: 'Failed to delete user' });
  }
}
