# B-Code Website

Company website monorepo for **B-Code Tech**: public site, admin dashboard, and Express API — PostgreSQL + Docker.

## Structure

```
client/   # Public company website (Vite + React)
admin/    # Admin dashboard (Vite + React Router)
server/   # Express API + PostgreSQL
deploy/   # nginx, Cloudflare SSL, git webhook
```

## Local development

```bash
# 1. Postgres
npm run db:up

# 2. Install
npm run install:all

# 3. Server env
cp server/.env.example server/.env
# DATABASE_URL should be postgresql://postgres:postgres@localhost:5434/bcode

# 4. Seed pricing data
npm run seed

# 5. Run (three terminals)
npm run dev:server   # :5001
npm run dev:client   # :5173
npm run dev:admin    # :3000
```

Create the first admin via `POST /api/auth/signup` or the admin Login/Signup UI.

## Production (Docker)

```bash
cp .env.production.example .env.production
# edit secrets
docker compose --env-file .env.production -f docker-compose.prod.yml up -d --build
```

- Public site: `http://localhost:3001/`
- Admin: `http://localhost:3001/admin/`
- API health: `http://localhost:3001/api/health`

See [DEPLOY.md](DEPLOY.md) for Cloudflare + VPS.
