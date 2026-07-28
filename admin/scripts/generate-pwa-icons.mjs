import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const src = path.join(root, 'public/images/favicon.svg');
const outDir = path.join(root, 'public/icons');

const sizes = [192, 512];

async function main() {
  if (!fs.existsSync(src)) {
    console.warn('[pwa-icons] favicon.svg missing — skipping');
    return;
  }

  fs.mkdirSync(outDir, { recursive: true });

  for (const size of sizes) {
    const out = path.join(outDir, `icon-${size}.png`);
    await sharp(src).resize(size, size, { fit: 'contain', background: '#050505' }).png().toFile(out);
    console.log('[pwa-icons] wrote', out);
  }
}

main().catch((err) => {
  console.error('[pwa-icons] failed:', err);
  process.exit(1);
});
