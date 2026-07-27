import sharp from 'sharp';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const src = process.argv[2];
const out = process.argv[3] || path.join(__dirname, '../public/images/og-cover.png');

if (!src) {
  console.error('Usage: node scripts/make-og-cover.mjs <source.png> [out.png]');
  process.exit(1);
}

await sharp(src)
  .resize(1200, 630, { fit: 'cover', position: 'centre' })
  .png({ compressionLevel: 9 })
  .toFile(out);

const meta = await sharp(out).metadata();
console.log(`Wrote ${out} (${meta.width}x${meta.height})`);
