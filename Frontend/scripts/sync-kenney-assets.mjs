/**
 * Copy Kenney isometric thumbnails + inspiration preview images into public/.
 * Run from Frontend: npm run sync:kenney-assets
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const KENNEY_KIT = path.resolve(ROOT, '..', '..', 'kenney_furniture-kit');
const THUMB_OUT = path.join(ROOT, 'public', 'thumbnails', 'kenney');
const INSPIRATION_OUT = path.join(ROOT, 'public', 'inspiration');

const INSPIRATION_PRESETS = [
  'scandinavian-living',
  'bohemian-living',
  'modern-bedroom',
  'japandi-bedroom',
  'midcentury-dining',
  'minimal-office',
];

function copyDirFiltered(srcDir, destDir, filter) {
  fs.mkdirSync(destDir, { recursive: true });
  let copied = 0;
  for (const name of fs.readdirSync(srcDir)) {
    if (!filter(name)) continue;
    fs.copyFileSync(path.join(srcDir, name), path.join(destDir, name));
    copied += 1;
  }
  return copied;
}

function main() {
  const isoDir = path.join(KENNEY_KIT, 'Isometric');
  if (!fs.existsSync(isoDir)) {
    console.error(`Kenney kit not found at ${KENNEY_KIT}`);
    process.exit(1);
  }

  const thumbCount = copyDirFiltered(isoDir, THUMB_OUT, (name) => name.endsWith('_NE.png'));
  console.log(`Copied ${thumbCount} isometric thumbnails -> public/thumbnails/kenney/`);

  fs.mkdirSync(INSPIRATION_OUT, { recursive: true });
  const preview = path.join(KENNEY_KIT, 'Preview.png');
  if (fs.existsSync(preview)) {
    INSPIRATION_PRESETS.forEach((id) => {
      fs.copyFileSync(preview, path.join(INSPIRATION_OUT, `${id}.jpg`));
    });
    console.log(`Copied preview image for ${INSPIRATION_PRESETS.length} inspiration rooms`);
  } else {
    console.warn('Preview.png not found — skipping inspiration images');
  }

  console.log('Done.');
}

main();
