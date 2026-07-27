import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { runMigrations } from './db/pg-migrate.js';
import { query } from './db/pg-connection.js';
import { initFirebase } from './lib/firebase.js';

import authRoutes from './routes/auth.route.js';
import packageRoutes from './routes/package.route.js';
import maintenanceRoutes from './routes/maintenance.route.js';
import notificationRoutes from './routes/notification.route.js';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 5001;

const defaultOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:5173',
];

const envOrigins = (process.env.CLIENT_ORIGIN || '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

const allowedOrigins = [...new Set([...defaultOrigins, ...envOrigins])];

app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use('/api/auth', authRoutes);
app.use('/api/packages', packageRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/notifications', notificationRoutes);

app.get('/api/health', async (req, res) => {
  try {
    await query('SELECT 1');
    res.json({
      status: 'ok',
      database: 'connected',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(503).json({
      status: 'error',
      database: 'disconnected',
      message: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

function resolveClientDist() {
  return (
    process.env.CLIENT_DIST_PATH ||
    path.resolve(__dirname, '../../client/dist')
  );
}

function resolveAdminDist() {
  return (
    process.env.ADMIN_DIST_PATH ||
    path.resolve(__dirname, '../../admin/dist')
  );
}

function serveSpas() {
  const serve =
    process.env.SERVE_CLIENT === 'true' || process.env.NODE_ENV === 'production';
  if (!serve) return;

  const clientDist = resolveClientDist();
  const adminDist = resolveAdminDist();

  if (fs.existsSync(adminDist)) {
    app.use(
      '/admin',
      express.static(adminDist, { index: false })
    );
    app.get(/^\/admin(\/.*)?$/, (req, res) => {
      res.sendFile(path.join(adminDist, 'index.html'));
    });
  }

  if (fs.existsSync(clientDist)) {
    app.use(express.static(clientDist, { index: ['index.html'] }));

    // Prefer prerendered HTML (e.g. /work/slug/index.html) before SPA shell
    app.get(/^(?!\/api)(?!\/admin).*/, (req, res, next) => {
      const clean = (req.path || '/').split('?')[0];
      if (clean.includes('..')) return next();

      const candidates = [];
      if (clean === '/' || clean === '') {
        candidates.push(path.join(clientDist, 'index.html'));
      } else {
        const noSlash = clean.replace(/\/$/, '');
        candidates.push(path.join(clientDist, noSlash, 'index.html'));
        candidates.push(path.join(clientDist, `${noSlash}.html`));
      }

      for (const file of candidates) {
        if (fs.existsSync(file) && file.startsWith(clientDist)) {
          return res.sendFile(file);
        }
      }

      return res.sendFile(path.join(clientDist, 'index.html'));
    });
  }
}

async function start() {
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL is required');
    process.exit(1);
  }

  if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET is required');
    process.exit(1);
  }

  await runMigrations();
  initFirebase();
  serveSpas();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`API available at http://localhost:${PORT}/api`);
  });
}

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
