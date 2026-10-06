import sharp from 'sharp';
import * as icons from 'lucide-static';
import { renderHtml } from './browser.js';

const FONTS =
  '<link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&family=Manrope:wght@400;600;700;800&family=Syne:wght@700;800&display=swap" rel="stylesheet">';

const esc = (s) =>
  String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

const dataUrl = async (png, width) =>
  `data:image/webp;base64,${(await sharp(png).resize({ width }).webp({ quality: 85 }).toBuffer()).toString('base64')}`;

/** Icons the model may pick for a blog cover. */
export const COVER_ICONS = [
  'Rocket', 'Code2', 'Globe', 'Search', 'TrendingUp', 'ShieldCheck', 'Layers', 'Boxes', 'Smartphone',
  'Palette', 'Database', 'Workflow', 'ShoppingCart', 'Megaphone', 'Lightbulb', 'BarChart3', 'Cpu', 'Users',
];

const iconSvg = (name, size, stroke = 1.5) =>
  String(icons[name] || icons.Sparkles || '')
    .replace(/width="\d+"/, `width="${size}"`)
    .replace(/height="\d+"/, `height="${size}"`)
    .replace(/stroke-width="[\d.]+"/, `stroke-width="${stroke}"`);

/** Mix a hex colour toward black/white for gradient stops. */
function shade(hex, amount) {
  const n = parseInt(String(hex).replace('#', '').padEnd(6, '0').slice(0, 6), 16);
  const ch = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((c) =>
    Math.round(amount < 0 ? c * (1 + amount) : c + (255 - c) * amount)
  );
  return `#${ch.map((c) => c.toString(16).padStart(2, '0')).join('')}`;
}

/** Dominant colour of a screenshot, nudged so it reads well as a background. */
export async function brandColor(png, themeColor) {
  if (/^#[0-9a-f]{6}$/i.test(themeColor || '')) return themeColor;
  const { dominant } = await sharp(png).resize(64).stats();
  const hex = `#${[dominant.r, dominant.g, dominant.b].map((c) => c.toString(16).padStart(2, '0')).join('')}`;
  const lum = (0.2126 * dominant.r + 0.7152 * dominant.g + 0.0722 * dominant.b) / 255;
  // Near-white or near-black sites get the B-Code blue as a neutral accent.
  return lum > 0.85 || lum < 0.08 ? '#3b82f6' : hex;
}

/** 1200×1200 device mockup cover (browser + tablet + phone) for a portfolio project. */
export async function projectCover({ title, subtitle, host, desktop, tablet, mobile, color }) {
  const [d, t, m] = await Promise.all([dataUrl(desktop, 1440), dataUrl(tablet, 820), dataUrl(mobile, 780)]);
  const html = `<!doctype html><html><head><meta charset="utf-8">${FONTS}<style>
*{box-sizing:border-box;margin:0}
body{width:1200px;height:1200px;overflow:hidden;font-family:Manrope,Cairo,system-ui;
 background:radial-gradient(ellipse at 30% 20%,${shade(color, 0.25)} 0%,transparent 55%),radial-gradient(ellipse at 85% 90%,${shade(color, 0.45)} 0%,transparent 45%),linear-gradient(160deg,${shade(color, -0.35)} 0%,${shade(color, -0.6)} 55%,${shade(color, -0.8)} 100%)}
.grid{position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,.06) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.06) 1px,transparent 1px);background-size:60px 60px;-webkit-mask:radial-gradient(ellipse at 50% 45%,#000 30%,transparent 75%)}
.browser{position:absolute;left:150px;top:250px;width:960px;border-radius:18px;overflow:hidden;background:#fff;box-shadow:0 40px 90px rgba(0,0,0,.45),0 0 0 1px rgba(255,255,255,.15)}
.bar{height:40px;background:#f1f1f4;display:flex;align-items:center;gap:8px;padding:0 16px}
.bar i{width:12px;height:12px;border-radius:50%;display:block}
.url{margin-left:14px;background:#fff;border-radius:6px;padding:4px 14px;font:13px ui-monospace,monospace;color:#555}
.browser img{display:block;width:100%;height:600px;object-fit:cover;object-position:top}
.tablet{position:absolute;left:60px;top:560px;width:330px;padding:14px;border-radius:30px;background:#111;box-shadow:0 40px 80px rgba(0,0,0,.5),0 0 0 1px rgba(255,255,255,.12)}
.tablet img{display:block;width:100%;aspect-ratio:820/1180;object-fit:cover;object-position:top;border-radius:16px}
.phone{position:absolute;right:70px;top:540px;width:250px;padding:11px;border-radius:40px;background:#111;box-shadow:0 40px 80px rgba(0,0,0,.5),0 0 0 1px rgba(255,255,255,.12)}
.phone img{display:block;width:100%;aspect-ratio:390/844;object-fit:cover;object-position:top;border-radius:30px}
.notch{position:absolute;left:50%;top:20px;transform:translateX(-50%);width:76px;height:20px;border-radius:12px;background:#111}
.label{position:absolute;left:150px;top:110px;right:90px;color:#fff}
.label b{display:block;font-size:56px;letter-spacing:-1px;line-height:1.1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.label span{display:block;margin-top:8px;font-size:22px;opacity:.75}
</style></head><body><div class="grid"></div>
<div class="label"><b>${esc(title)}</b><span>${esc(subtitle)}</span></div>
<div class="browser"><div class="bar"><i style="background:#ff5f57"></i><i style="background:#febc2e"></i><i style="background:#28c840"></i><span class="url">${esc(host)}</span></div><img src="${d}"></div>
<div class="tablet"><img src="${t}"></div>
<div class="phone"><div class="notch"></div><img src="${m}"></div>
</body></html>`;
  const png = await renderHtml(html, { width: 1200, height: 1200 });
  return sharp(png).jpeg({ quality: 84, mozjpeg: true }).toBuffer();
}

/** 1600×900 branded blog cover with the English title, tags and an icon motif. */
export async function blogCover({ title, tagEn, tagAr, icon }) {
  const motif = COVER_ICONS.includes(icon) ? icon : 'Lightbulb';
  const html = `<!doctype html><html><head><meta charset="utf-8">${FONTS}<style>
*{box-sizing:border-box;margin:0}
body{width:1600px;height:900px;overflow:hidden;background:#060a14;color:#f1f5f9;font-family:Manrope,Cairo,system-ui;position:relative}
.grid{position:absolute;inset:0;background-image:linear-gradient(rgba(148,163,184,.07) 1px,transparent 1px),linear-gradient(90deg,rgba(148,163,184,.07) 1px,transparent 1px);background-size:64px 64px;-webkit-mask:radial-gradient(ellipse 75% 70% at 50% 45%,#000 35%,transparent 85%)}
.glow{position:absolute;border-radius:50%;filter:blur(90px)}
.chip{display:inline-flex;border:1px solid rgba(148,163,184,.2);border-radius:999px;padding:10px 18px;font-size:20px;font-weight:600;background:rgba(255,255,255,.04)}
.title{font-family:Syne,Manrope,sans-serif;font-weight:800;font-size:72px;line-height:1.08;letter-spacing:-.02em;max-width:900px;display:-webkit-box;-webkit-line-clamp:4;-webkit-box-orient:vertical;overflow:hidden}
.motif{position:absolute;right:120px;top:50%;transform:translateY(-50%);width:420px;height:420px;border-radius:96px;display:grid;place-items:center;color:#fff;background:linear-gradient(135deg,#3b82f6,#6366f1);box-shadow:0 50px 120px rgba(59,130,246,.45)}
.ring{position:absolute;right:60px;top:50%;transform:translateY(-50%);width:540px;height:540px;border-radius:130px;border:1px dashed rgba(96,165,250,.35)}
.brand{position:absolute;left:96px;bottom:56px;font-size:22px;font-weight:700;color:#94a3b8;display:flex;align-items:center;gap:12px}
.brand b{color:#f1f5f9}
</style></head><body><div class="grid"></div>
<div class="glow" style="width:700px;height:700px;left:-120px;top:-260px;background:#3b82f6;opacity:.35"></div>
<div class="glow" style="width:620px;height:620px;right:-160px;bottom:-280px;background:#6366f1;opacity:.3"></div>
<div style="position:absolute;left:96px;top:92px;display:flex;gap:14px">
  ${tagEn ? `<span class="chip">${esc(tagEn)}</span>` : ''}${tagAr ? `<span class="chip" dir="rtl" style="font-family:Cairo">${esc(tagAr)}</span>` : ''}
</div>
<div style="position:absolute;left:96px;top:50%;transform:translateY(-50%)"><div class="title">${esc(title)}</div></div>
<div class="ring"></div><div class="motif">${iconSvg(motif, 200)}</div>
<div class="brand"><span style="width:12px;height:12px;border-radius:50%;background:#3b82f6"></span><b>B-Code</b> · Blog · المدونة</div>
</body></html>`;
  const png = await renderHtml(html, { width: 1600, height: 900 });
  return sharp(png).webp({ quality: 84 }).toBuffer();
}

/** Screenshot PNG → compressed WebP at the given width. */
export const toWebp = (png, width) => sharp(png).resize({ width }).webp({ quality: 80 }).toBuffer();
