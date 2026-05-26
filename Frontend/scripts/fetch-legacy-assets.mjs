/**
 * Download legacy Blueprint3D model textures + catalog thumbnails.
 * Run from Frontend: npm run fetch:legacy-assets
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const TARGETS = [
  {
    dir: path.join(ROOT, 'public', 'models', 'js'),
    api: 'https://api.github.com/repos/furnishup/blueprint3d/contents/example/models/js',
  },
  {
    dir: path.join(ROOT, 'public', 'models', 'thumbnails'),
    api: 'https://api.github.com/repos/furnishup/blueprint3d/contents/example/models/thumbnails',
  },
];

const TEXTURE_EXT = /\.(png|jpe?g|gif)$/i;

async function listGithubFiles(apiUrl) {
  const res = await fetch(apiUrl, {
    headers: { 'User-Agent': 'designer-pro-asset-sync' },
  });
  if (!res.ok) throw new Error(`GitHub list failed: ${apiUrl} (${res.status})`);
  return res.json();
}

async function downloadFile(url, dest) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Download failed: ${url} (${res.status})`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(dest, buf);
}

async function syncTextures({ dir, api }) {
  fs.mkdirSync(dir, { recursive: true });
  const files = await listGithubFiles(api);

  let ok = 0;
  let skip = 0;
  for (const file of files) {
    if (file.type !== 'file' || !TEXTURE_EXT.test(file.name)) continue;
    const dest = path.join(dir, file.name);
    if (fs.existsSync(dest) && fs.statSync(dest).size > 0) {
      skip++;
      continue;
    }
    await downloadFile(file.download_url, dest);
    ok++;
    console.log(`  + ${file.name}`);
  }
  return { ok, skip };
}

async function main() {
  console.log('Fetching legacy Blueprint3D textures & thumbnails...\n');
  for (const target of TARGETS) {
    console.log(target.dir);
    const { ok, skip } = await syncTextures(target);
    console.log(`  Downloaded ${ok}, skipped ${skip}\n`);
  }
  console.log('Done.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
