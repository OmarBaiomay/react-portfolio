# Search Console + Bing Webmaster (sitemap submission)

The sitemap is already live at: `https://b-code.tech/sitemap.xml`  
(Robots: `https://b-code.tech/robots.txt`)

Google and Bing **require you to verify domain ownership** in your own account. This repo cannot submit on your behalf without those logins.

## 1. Google Search Console

1. Open [Google Search Console](https://search.google.com/search-console)
2. Add property → **URL prefix**: `https://b-code.tech`  
   (or **Domain** property `b-code.tech` via Cloudflare DNS TXT — preferred)
3. Verify:
   - **DNS (recommended):** add the TXT record Cloudflare shows
   - **HTML tag:** paste the token into `client/index.html` replacing `YOUR_GOOGLE_TOKEN`, then redeploy
4. After verification → **Sitemaps** → submit:
   ```
   https://b-code.tech/sitemap.xml
   ```
5. Optional: **URL Inspection** → request indexing for `/` and key `/work/...` pages

## 2. Bing Webmaster Tools

1. Open [Bing Webmaster Tools](https://www.bing.com/webmasters)
2. Add site `https://b-code.tech`
3. Fastest path: **Import from Google Search Console** (if GSC is already verified)
4. Or verify with the `msvalidate.01` meta tag (`YOUR_BING_TOKEN` in `client/index.html`) / DNS
5. **Sitemaps** → submit:
   ```
   https://b-code.tech/sitemap.xml
   ```

## 3. After deploy checklist

- [ ] `https://b-code.tech/sitemap.xml` returns 200
- [ ] `https://b-code.tech/robots.txt` lists the sitemap
- [ ] `https://b-code.tech/images/og-cover.png` is 1200×630
- [ ] `https://b-code.tech/llms.txt` is reachable
- [ ] GSC sitemap status is **Success**
- [ ] Bing sitemap status is **Success**

## 4. Env-based verification tokens (optional)

You can also inject tokens at build time later via Vite env:

```bash
VITE_GOOGLE_SITE_VERIFICATION=...
VITE_BING_SITE_VERIFICATION=...
```

Wire them into `Seo.jsx` / `index.html` when you have the values.
