import { mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { CATALOG_CATEGORIES } from '../src/lib/catalogData.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const frontendRoot = join(__dirname, '..');
const projectRoot = join(frontendRoot, '..');
const finalAssetsRoot = join(projectRoot, 'assets', 'finalassets');
const outDir = join(frontendRoot, 'public', 'assets', 'products', 'thumbnails');

const slugify = (value) => String(value)
  .normalize('NFKD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .replace(/&/g, ' and ')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '');

const walk = async (dir, files = []) => {
  const { readdir } = await import('node:fs/promises');
  const entries = await readdir(dir, { withFileTypes: true });
  await Promise.all(entries.map((entry) => {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) return walk(full, files);
    if (/\.(png|jpe?g|webp)$/i.test(entry.name)) files.push(full);
    return null;
  }));
  return files;
};

const scoreFolder = (folderName, item) => {
  const folderSlug = slugify(folderName);
  const itemSlug = slugify(item.id.replace(/^obj-/, ''));
  const catalogSlug = slugify(item.name);
  const modelSlug = slugify(item.modelUrl.split('/').at(-2) ?? '');
  const fileSlug = slugify(item.modelUrl.split('/').pop()?.replace(/\.[^.]+$/, '') ?? '');

  if (folderSlug === itemSlug || folderSlug === catalogSlug || folderSlug === modelSlug || folderSlug === fileSlug) return 100;
  if (folderSlug.includes(catalogSlug) || catalogSlug.includes(folderSlug)) return 80;
  if (folderSlug.includes(itemSlug) || itemSlug.includes(folderSlug)) return 70;
  if (folderSlug.includes(fileSlug) || fileSlug.includes(folderSlug)) return 60;
  return 0;
};

const scoreImage = (filePath, item, folderName) => {
  const rel = relative(finalAssetsRoot, filePath).toLowerCase();
  const name = slugify(filePath.split(/[\\/]/).pop()?.replace(/\.[^.]+$/, '') ?? '');
  const itemSlug = slugify(item.name);
  const folderSlug = slugify(folderName);

  let score = 0;
  if (name === 'preview-image' || name === 'preview') score += 100;
  if (name === itemSlug || name === folderSlug) score += 90;
  if (name.includes(itemSlug) || itemSlug.includes(name)) score += 45;
  if (/\b(render|beauty|thumbnail|thumb|preview)\b/.test(name)) score += 25;

  if (rel.includes('\\map\\') || rel.includes('/map/')) score -= 90;
  if (rel.includes('\\texture\\') || rel.includes('/texture/') || rel.includes('\\textures\\') || rel.includes('/textures/')) score -= 90;
  if (rel.includes('\\extras\\') || rel.includes('/extras/')) score -= 40;
  if (rel.includes('[obj]') || rel.includes('[fbx]')) score -= 35;
  if (/(diffuse|normal|rough|roughness|gloss|glossiness|metal|metallic|specular|ao|height|bump|basecolor|opacity|refraction|occlusion)/.test(name)) score -= 120;

  return score;
};

const items = CATALOG_CATEGORIES.flatMap((category) => category.items)
  .filter((item) => item.source === 'imported' && item.id.startsWith('obj-'));

const folderEntries = existsSync(finalAssetsRoot)
  ? (await import('node:fs/promises')).readdir(finalAssetsRoot, { withFileTypes: true })
  : [];

const folders = folderEntries
  .filter((entry) => entry.isDirectory())
  .map((entry) => ({ name: entry.name, path: join(finalAssetsRoot, entry.name) }));

await mkdir(outDir, { recursive: true });

let copied = 0;
let missed = 0;

for (const item of items) {
  const folder = folders
    .map((candidate) => ({ ...candidate, score: scoreFolder(candidate.name, item) }))
    .filter((candidate) => candidate.score > 0)
    .sort((a, b) => b.score - a.score)[0];

  if (!folder) {
    missed += 1;
    console.warn(`miss  ${item.id} (${item.name})`);
    continue;
  }

  const imageFiles = await walk(folder.path);
  const image = imageFiles
    .map((filePath) => ({ filePath, score: scoreImage(filePath, item, folder.name) }))
    .filter((candidate) => candidate.score > -20)
    .sort((a, b) => b.score - a.score)[0];

  if (!image) {
    missed += 1;
    console.warn(`miss  ${item.id} (${item.name}) - no preview image in ${folder.name}`);
    continue;
  }

  const outPath = join(outDir, `${item.id}.png`);
  await sharp(image.filePath)
    .resize(512, 512, { fit: 'contain', background: { r: 247, g: 244, b: 240, alpha: 1 } })
    .png({ compressionLevel: 9 })
    .toFile(outPath);

  copied += 1;
  console.log(`copy  ${item.id} <- ${relative(projectRoot, image.filePath)}`);
}

console.log(`Done. Synced ${copied} finalasset thumbnails${missed ? `, ${missed} missed` : ''}.`);
