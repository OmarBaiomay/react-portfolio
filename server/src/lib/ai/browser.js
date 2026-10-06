import fs from 'fs';
import puppeteer from 'puppeteer-core';

const CANDIDATES = [
  process.env.CHROME_PATH,
  process.env.PUPPETEER_EXECUTABLE_PATH,
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
  '/usr/bin/google-chrome',
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
].filter(Boolean);

export function chromePath() {
  const found = CANDIDATES.find((p) => fs.existsSync(p));
  if (!found) {
    throw Object.assign(new Error('No Chrome/Chromium found on the server. Set CHROME_PATH.'), { status: 500 });
  }
  return found;
}

// One browser at a time keeps memory predictable on a small VPS.
let queue = Promise.resolve();
export function withBrowser(fn) {
  const run = queue.then(async () => {
    const browser = await puppeteer.launch({
      executablePath: chromePath(),
      headless: true,
      args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu', '--hide-scrollbars'],
    });
    try {
      return await fn(browser);
    } finally {
      await browser.close().catch(() => {});
    }
  });
  queue = run.catch(() => {});
  return run;
}

/** Only public http(s) sites — never localhost or private network addresses. */
export function assertPublicUrl(raw) {
  let url;
  try {
    url = new URL(String(raw).trim());
  } catch {
    throw Object.assign(new Error('That does not look like a valid link (include https://).'), { status: 400 });
  }
  if (!['http:', 'https:'].includes(url.protocol)) {
    throw Object.assign(new Error('Only http(s) links are supported.'), { status: 400 });
  }
  const host = url.hostname.toLowerCase();
  const privateHost =
    host === 'localhost' ||
    host.endsWith('.local') ||
    host.endsWith('.internal') ||
    /^(127\.|10\.|192\.168\.|169\.254\.|0\.)/.test(host) ||
    /^172\.(1[6-9]|2\d|3[01])\./.test(host) ||
    host === '[::1]' ||
    !host.includes('.');
  if (privateHost) throw Object.assign(new Error('Private or local addresses are not allowed.'), { status: 400 });
  return url;
}

const HIDE_OVERLAYS = `
  [id*=cookie i],[class*=cookie-consent i],[class*=cookie-banner i],[class*=cookieconsent i],
  #website_cookies_bar,#onetrust-banner-sdk,.cc-window,#CybotCookiebotDialog { display:none !important }
`;

async function settle(page) {
  await page.addStyleTag({ content: HIDE_OVERLAYS }).catch(() => {});
  // Scroll through once so lazy images and scroll animations load, then back to the top.
  await page
    .evaluate(async () => {
      const step = Math.max(400, window.innerHeight * 0.8);
      for (let y = 0; y < Math.min(document.body.scrollHeight, 12000); y += step) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 90));
      }
      window.scrollTo(0, 0);
    })
    .catch(() => {});
  await new Promise((r) => setTimeout(r, 1800));
  await page.addStyleTag({ content: HIDE_OVERLAYS }).catch(() => {});
}

async function open(browser, url, { width, height, scale = 1, mobile = false }) {
  const page = await browser.newPage();
  await page.setViewport({ width, height, deviceScaleFactor: scale, isMobile: mobile, hasTouch: mobile });
  if (mobile) {
    await page.setUserAgent(
      'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
    );
  }
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 }).catch(async (error) => {
    // Some sites never go network-idle (chat widgets, analytics); a loaded DOM is enough.
    if (!/timeout/i.test(error.message)) throw error;
  });
  await settle(page);
  return page;
}

const shot = (page) => page.screenshot({ type: 'png' });

/** Text, links and technology hints from the home page. */
async function readPage(page) {
  return page.evaluate(() => {
    const meta = (sel) => document.querySelector(sel)?.getAttribute('content') || '';
    const origin = location.origin;
    const links = [...document.querySelectorAll('a[href]')]
      .map((a) => ({ href: a.href.split('#')[0], text: (a.textContent || '').trim().replace(/\s+/g, ' ') }))
      .filter((l) => l.href.startsWith(origin) && l.href !== origin + '/' && l.href !== location.href && l.text)
      .filter((l, i, all) => all.findIndex((x) => x.href === l.href) === i)
      .slice(0, 40);
    const html = document.documentElement.outerHTML;
    const scripts = [...document.scripts].map((s) => s.src).filter(Boolean);
    const hints = [];
    const gen = meta('meta[name="generator"]');
    if (gen) hints.push(`generator meta: ${gen}`);
    if (/wp-content|wp-includes/.test(html)) hints.push('WordPress (wp-content)');
    if (/elementor/i.test(html)) hints.push('Elementor');
    if (window.odoo || /\/web\/assets\//.test(html)) hints.push('Odoo');
    if (window.__NEXT_DATA__ || document.getElementById('__next')) hints.push('Next.js');
    if (document.getElementById('root') && /\/assets\/index-[\w-]+\.js/.test(html)) hints.push('React SPA (Vite build)');
    if (window.Shopify) hints.push('Shopify');
    if (/salla\.(sa|network)/.test(html)) hints.push('Salla');
    if (/zid\.(sa|store)/.test(html)) hints.push('Zid');
    if (/wix\.com|wixstatic/.test(html)) hints.push('Wix');
    if (/webflow/.test(html)) hints.push('Webflow');
    if (/bootstrap/i.test(scripts.join(' '))) hints.push('Bootstrap');
    if (/jquery/i.test(scripts.join(' '))) hints.push('jQuery');
    if (/googletagmanager/.test(html)) hints.push('Google Tag Manager');
    if (/connect\.facebook\.net/.test(html)) hints.push('Meta Pixel');
    if (/analytics\.tiktok/.test(html)) hints.push('TikTok Pixel');
    if (/clarity\.ms/.test(html)) hints.push('Microsoft Clarity');
    if (/wa\.me|api\.whatsapp/.test(html)) hints.push('WhatsApp links');
    return {
      url: location.href,
      title: document.title,
      lang: document.documentElement.lang || '',
      dir: document.documentElement.dir || getComputedStyle(document.documentElement).direction,
      description: meta('meta[name="description"]') || meta('meta[property="og:description"]'),
      themeColor: meta('meta[name="theme-color"]'),
      text: (document.body?.innerText || '').replace(/\n{3,}/g, '\n\n').trim().slice(0, 16000),
      links,
      hints: [...new Set(hints)],
    };
  });
}

/** Pick up to `n` internal pages worth screenshotting (services, products, projects…). */
function pickPages(links, n = 2) {
  const score = (l) => {
    const s = `${l.href} ${l.text}`.toLowerCase();
    if (/login|signin|register|cart|checkout|privacy|terms|policy|cookie|\.pdf$|mailto|tel:/.test(s)) return -1;
    // Language switchers and icon-only links are not real pages.
    if (l.text.length < 3 || /^(en|ar|eng|english|arabic|عربي|العربية|english version)$/i.test(l.text.trim())) return -1;
    if (/[?&](lang|language)=|\/(en|ar)\/?$/i.test(l.href)) return -1;
    let v = 0;
    if (/service|product|project|portfolio|work|course|solution|خدم|منتج|مشاريع|أعمال|دورات|حلول/.test(s)) v += 3;
    if (/about|من نحن|عن/.test(s)) v += 1;
    return v;
  };
  return links
    .map((l) => ({ ...l, s: score(l) }))
    .filter((l) => l.s >= 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, n);
}

/**
 * Visit a site and return { info, shots } where shots are PNG buffers:
 * desktop[] (1440×900), tablet[] (820×1180 @2x), mobile[] (390×844 @2x).
 */
export async function captureSite(rawUrl, onProgress = () => {}) {
  const url = assertPublicUrl(rawUrl).href;
  return withBrowser(async (browser) => {
    onProgress('Opening the website…');
    const home = await open(browser, url, { width: 1440, height: 900 });
    const info = await readPage(home);
    const shots = { desktop: [await shot(home)], tablet: [], mobile: [] };
    await home.close();

    const pages = pickPages(info.links, 2);
    for (const [i, p] of pages.entries()) {
      onProgress(`Capturing page ${i + 2} of ${pages.length + 1} on desktop…`);
      try {
        const page = await open(browser, p.href, { width: 1440, height: 900 });
        shots.desktop.push(await shot(page));
        await page.close();
      } catch {
        // skip pages that fail to load
      }
    }

    onProgress('Capturing tablet and phone views…');
    const tablet = await open(browser, url, { width: 820, height: 1180, scale: 2, mobile: true });
    shots.tablet.push(await shot(tablet));
    await tablet.close();

    for (const target of [url, ...pages.map((p) => p.href)]) {
      try {
        const page = await open(browser, target, { width: 390, height: 844, scale: 2, mobile: true });
        shots.mobile.push(await shot(page));
        await page.close();
      } catch {
        // skip
      }
    }

    return { info: { ...info, pages }, shots };
  });
}

/** Render an HTML document to a PNG buffer. */
export async function renderHtml(html, { width, height }) {
  return withBrowser(async (browser) => {
    const page = await browser.newPage();
    await page.setViewport({ width, height, deviceScaleFactor: 1 });
    await page.setContent(html, { waitUntil: 'load', timeout: 90000 });
    await page.evaluate(() => document.fonts.ready).catch(() => {});
    await new Promise((r) => setTimeout(r, 300));
    return page.screenshot({ type: 'png' });
  });
}
