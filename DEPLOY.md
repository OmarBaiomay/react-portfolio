# Deploy B-Code on a VPS (Cloudflare + Docker)

Runs **alongside** other stacks (e.g. playstation-lounge at `/opt/arena`).

| App | Path | Host port (default) |
|-----|------|---------------------|
| playstation-lounge | `/opt/arena` | `3001` |
| **B-Code** | `/opt/b-code` | **`3002`** |

## Prerequisites

- Ubuntu VPS with Docker + Docker Compose
- Domain (e.g. `b-code.tech`) on Cloudflare DNS
- GitHub repo: `OmarBaiomay/react-portfolio`
- SSH access as root (or a user in the `docker` group)

## 1. Clone on the VPS (separate from arena)

```bash
sudo mkdir -p /opt/b-code
sudo chown "$USER:$USER" /opt/b-code
git clone git@github.com:OmarBaiomay/react-portfolio.git /opt/b-code
cd /opt/b-code
```

If HTTPS clone is easier:

```bash
git clone https://github.com/OmarBaiomay/react-portfolio.git /opt/b-code
cd /opt/b-code
```

## 2. Production env

```bash
cp .env.production.example .env.production
nano .env.production
```

Set at least:

```bash
APP_PORT=3002
POSTGRES_PASSWORD='…strong…'
JWT_SECRET='…long-random…'
CLIENT_ORIGIN=https://b-code.tech
ALLOW_PUBLIC_SIGNUP=true   # only for first admin, then set false
```

## 3. Start the stack

```bash
cd /opt/b-code
docker compose --env-file .env.production -f docker-compose.prod.yml up -d --build
curl -fsS http://127.0.0.1:3002/api/health
docker ps --filter name=bcode
```

Expected containers: `bcode-app`, `bcode-pg-prod` (arena’s containers stay untouched).

## 4. Cloudflare + TLS + nginx

1. DNS A record `@` → VPS IP (see [deploy/ssl/CLOUDFLARE.md](deploy/ssl/CLOUDFLARE.md))
2. Issue cert for `b-code.tech` + `www.b-code.tech`
3. Install a **separate** nginx site (do not edit arena’s site):

```bash
sudo cp /opt/b-code/deploy/nginx.conf.example /etc/nginx/sites-available/b-code
sudo nano /etc/nginx/sites-available/b-code   # confirm proxy → 127.0.0.1:3002
sudo ln -sf /etc/nginx/sites-available/b-code /etc/nginx/sites-enabled/b-code
sudo nginx -t && sudo systemctl reload nginx
```

## 5. First admin

1. With `ALLOW_PUBLIC_SIGNUP=true`, open `https://b-code.tech/admin/`
2. Create the admin account
3. Set `ALLOW_PUBLIC_SIGNUP=false` in `.env.production`
4. Recreate app:

```bash
cd /opt/b-code
docker compose --env-file .env.production -f docker-compose.prod.yml up -d --force-recreate app
```

## 6. Auto-deploy webhook (optional)

Use a **different** webhook port than arena (example: `9002`).

```bash
chmod +x /opt/b-code/deploy/webhook/deploy.sh
# edit deploy/webhook/bcode-webhook.service → WorkingDirectory=/opt/b-code, port 9002
# GitHub webhook → http://VPS:9002/webhook
```

`deploy.sh` defaults to `REPO_DIR=/opt/b-code`.

## 7. SEO after go-live

- OG: `https://b-code.tech/images/og-cover.png`
- Sitemap: `https://b-code.tech/sitemap.xml`
- AI: `https://b-code.tech/llms.txt`
- Submit in Google/Bing: [client/SEO.md](client/SEO.md)

## Useful commands

```bash
cd /opt/b-code
docker compose --env-file .env.production -f docker-compose.prod.yml logs -f app
docker compose --env-file .env.production -f docker-compose.prod.yml ps
curl -fsS http://127.0.0.1:3002/api/health
```
