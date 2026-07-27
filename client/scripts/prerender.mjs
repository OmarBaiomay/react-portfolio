/**
 * Post-build prerender for public SEO routes.
 * Serves dist/, renders each route in Chromium, writes HTML back into dist/.
 */
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import puppeteer from 'puppeteer';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, '../dist');
const projectsPath = path.resolve(__dirname, '../src/data/projects.js');

function loadProjectSlugs() {
  const source = fs.readFileSync(projectsPath, 'utf8');
  const slugs = [...source.matchAll(/slug:\s*'([^']+)'/g)].map((m) => m[1]);
  return [...new Set(slugs)];
}

function contentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return (
    {
      '.html': 'text/html; charset=utf-8',
      '.js': 'text/javascript; charset=utf-8',
      '.css': 'text/css; charset=utf-8',
      '.json': 'application/json',
      '.svg': 'image/svg+xml',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.webp': 'image/webp',
      '.ico': 'image/x-icon',
      '.txt': 'text/plain; charset=utf-8',
      '.xml': 'application/xml; charset=utf-8',
      '.woff': 'font/woff',
      '.woff2': 'font/woff2',
    }[ext] || 'application/octet-stream'
  );
}

function startStaticServer() {
  const server = http.createServer((req, res) => {
    const urlPath = decodeURIComponent((req.url || '/').split('?')[0]);
    let filePath = path.join(distDir, urlPath);

    if (urlPath.endsWith('/') || !path.extname(filePath)) {
      const asFile = path.join(distDir, urlPath.replace(/^\//, ''), 'index.html');
      const spaFallback = path.join(distDir, 'index.html');
      filePath = fs.existsSync(asFile) ? asFile : spaFallback;
    }

    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end('Not found');
        return;
      }
      res.writeHead(200, { 'Content-Type': contentType(filePath) });
      res.end(data);
    });
  });

  return new Promise((resolve) => {
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address();
      resolve({ server, port });
    });
  });
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

async function renderRoute(browser, baseUrl, route) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  // Skip remote fonts/analytics so networkidle isn't blocked
  await page.setRequestInterception(true);
  page.on('request', (req) => {
    const type = req.resourceType();
    const url = req.url();
    if (
      type === 'font' ||
      type === 'media' ||
      /\/api\//i.test(url) ||
      /fonts\.googleapis\.com|fonts\.gstatic\.com|google-analytics|googletagmanager/i.test(url)
    ) {
      return req.abort();
    }
    return req.continue();
  });

  page.on('pageerror', (err) => {
    console.warn(`[prerender] pageerror ${route}:`, err.message);
  });

  const url = `${baseUrl}${route}`;
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });

  await page.waitForSelector('#root', { timeout: 15000 });

  try {
    await page.waitForFunction(
      () => {
        const root = document.getElementById('root');
        if (!root) return false;
        const text = (root.innerText || '').replace(/\s+/g, ' ').trim();
        return text.length > 30 || root.querySelector('h1, h2, main, header');
      },
      { timeout: 25000 }
    );
  } catch {
    console.warn(`[prerender] soft-timeout waiting for content on ${route}, saving anyway`);
  }

  await new Promise((r) => setTimeout(r, 500));

  const html = await page.content();
  await page.close();

  const outPath =
    route === '/'
      ? path.join(distDir, 'index.html')
      : path.join(distDir, route.replace(/^\//, ''), 'index.html');

  ensureDir(path.dirname(outPath));
  fs.writeFileSync(outPath, html, 'utf8');
  console.log(`prerendered ${route} → ${path.relative(distDir, outPath)}`);
}

async function main() {
  if (!fs.existsSync(distDir)) {
    console.error('dist/ missing — run vite build first');
    process.exit(1);
  }

  const routes = ['/', ...loadProjectSlugs().map((slug) => `/work/${slug}`)];
  const { server, port } = await startStaticServer();
  const baseUrl = `http://127.0.0.1:${port}`;

  const browser = await puppeteer.launch({
    headless: true,
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--use-gl=swiftshader',
    ],
  });

  try {
    for (const route of routes) {
      await renderRoute(browser, baseUrl, route);
    }
    console.log(`Prerender complete (${routes.length} routes)`);
  } finally {
    await browser.close();
    server.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
