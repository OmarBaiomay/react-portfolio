# Cloudflare DNS + SSL for B-Code

Move DNS to Cloudflare (free). Domain registration can stay with your registrar.

## 1. Add the domain to Cloudflare

1. Create an account at https://dash.cloudflare.com
2. Add site: `b-code.tech` → Free plan
3. Cloudflare shows 2 nameservers — set those at your registrar

## 2. DNS records

| Type | Name | Content | Proxy |
|------|------|---------|-------|
| A | `@` | `YOUR_VPS_IP` | DNS only (grey) during first SSL issue |
| A | `app` | `YOUR_VPS_IP` | DNS only (grey) — admin PWA |
| CNAME | `www` | `b-code.tech` | DNS only (grey) |

After certificates work, you can orange-cloud the A record (Full Strict SSL).

## 3. Issue certificate (certbot DNS-01)

```bash
apt update && apt install -y python3-certbot-dns-cloudflare
echo 'dns_cloudflare_api_token = PASTE_TOKEN' > /etc/bcode-cloudflare.ini
chmod 600 /etc/bcode-cloudflare.ini

certbot certonly \
  --dns-cloudflare \
  --dns-cloudflare-credentials /etc/bcode-cloudflare.ini \
  -d b-code.tech \
  -d www.b-code.tech \
  -d app.b-code.tech
```

## 4. Cloudflare SSL mode

Dashboard → SSL/TLS → Overview → **Full (strict)** once origin has a valid cert.

## 5. App behind nginx

Copy `deploy/nginx.conf.example` to `/etc/nginx/sites-available/b-code`, enable it, reload nginx.
Point it at `127.0.0.1:3002` (docker compose prod app — use a free port if 3001 is playstation-lounge).
