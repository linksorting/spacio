import sharp from 'sharp';
import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';

const THUMB_DIR = 'public/assets/products/thumbnails';
const TOP_DIR = 'public/assets/products/top-view';
const MAX_W = 400;

async function processFile(filepath) {
  const buf = readFileSync(filepath);
  const meta = await sharp(buf).metadata();
  if (meta.width <= MAX_W && meta.format === 'png') return;
  const resized = await sharp(buf)
    .resize({ width: MAX_W, withoutEnlargement: true })
    .png({ palette: true, compressionLevel: 9 })
    .toBuffer();
  if (resized.length < buf.length || meta.width > MAX_W) {
    writeFileSync(filepath, resized);
    console.log(`  ${filepath.split('/').pop()} ${meta.width}x${meta.height} -> ${(resized.length/1024).toFixed(0)}KB (was ${(buf.length/1024).toFixed(0)}KB)`);
  } else {
    console.log(`  ${filepath.split('/').pop()} unchanged (${(buf.length/1024).toFixed(0)}KB)`);
  }
}

async function main() {
  for (const dir of [THUMB_DIR, TOP_DIR]) {
    console.log(`\n=== ${dir} ===`);
    const files = readdirSync(dir).filter(f => /\.(png|jpg|jpeg)$/i.test(f));
    for (const file of files) {
      try { await processFile(join(dir, file)); } catch (e) { console.error(`  SKIP ${file}: ${e.message}`); }
    }
  }
}

main();
