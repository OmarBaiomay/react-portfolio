# Deploy B-Code on a VPS (Cloudflare + Docker)

## Prerequisites

- Ubuntu VPS with Docker + Docker Compose
- Domain (e.g. `b-code.tech`) on Cloudflare DNS
- GitHub repo: `OmarBaiomay/react-portfolio`

## 1. Clone on the VPS

```bash
sudo mkdir -p /opt/b-code
sudo chown $USER:$USER /opt/b-code
git clone git@github.com:OmarBaiomay/react-portfolio.git /opt/b-code
cd /opt/b-code
```

## 2. Production env

```bash
cp .env.production.example .env.production
nano .env.production
```

Set at least: `POSTGRES_PASSWORD`, `JWT_SECRET`, `CLIENT_ORIGIN=https://b-code.tech`.

## 3. Start the stack

```bash
docker compose --env-file .env.production -f docker-compose.prod.yml up -d --build
curl http://127.0.0.1:3001/api/health
```

## 4. Cloudflare + TLS

Follow [deploy/ssl/CLOUDFLARE.md](deploy/ssl/CLOUDFLARE.md), then install nginx from [deploy/nginx.conf.example](deploy/nginx.conf.example).

## 5. First admin

Temporarily set `ALLOW_PUBLIC_SIGNUP=true`, recreate the app container, sign up at `https://b-code.tech/admin/`, then set it back to `false` and redeploy.

## 6. Auto-deploy webhook (optional)

```bash
chmod +x deploy/webhook/deploy.sh
# install systemd unit from deploy/webhook/bcode-webhook.service
# point a GitHub webhook at your VPS (or tunnel) → /webhook on port 9001
```

Push to `main` runs `git reset --hard origin/main` and rebuilds compose.
