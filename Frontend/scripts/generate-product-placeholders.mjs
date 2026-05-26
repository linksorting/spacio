import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { catalogProducts } from '../src/data/productCatalog.js';
import { spacioProducts } from '../src/data/spacioCatalog.js';
import { spacioCategoryPalette } from '../src/data/productAssets.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const thumbnailDir = join(root, 'public', 'assets', 'products', 'thumbnails');
const topViewDir = join(root, 'public', 'assets', 'products', 'top-view');
const modelDir = join(root, 'public', 'assets', 'products', 'models');

const palettes = {
  'sofas-sectionals': ['#d9d2c7', '#b8aa99', '#4a4039'],
  armchairs: ['#efe7dc', '#9b6a5b', '#4b342d'],
  tables: ['#c99b67', '#8b623f', '#4d3322'],
  beds: ['#e6dfd5', '#b8ab9c', '#6b5a4a'],
  lighting: ['#f4efe6', '#202020', '#d7b46a'],
  'storage-furniture': ['#d4b991', '#8a6a45', '#3a2d22'],
  doors: ['#c59b67', '#232323', '#dfe8ea'],
  windows: ['#e9f1f2', '#202020', '#9fb3b9'],
  decor: ['#f2eee7', '#9d9a8f', '#423b35'],
};

const esc = value => String(value).replace(/[&<>"']/g, char => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&apos;',
}[char]));

const shadow = `
  <defs>
    <filter id="softShadow" x="-40%" y="-40%" width="180%" height="180%">
      <feDropShadow dx="0" dy="14" stdDeviation="14" flood-color="#000" flood-opacity="0.24"/>
    </filter>
    <linearGradient id="studioBg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#fbfbfa"/>
      <stop offset="100%" stop-color="#e8e6e1"/>
    </linearGradient>
    <radialGradient id="floorFade" cx="50%" cy="60%" r="52%">
      <stop offset="0%" stop-color="#d4d0c8" stop-opacity="0.58"/>
      <stop offset="100%" stop-color="#d4d0c8" stop-opacity="0"/>
    </radialGradient>
  </defs>
`;

const productShape = (product, colors) => {
  const [primary, secondary, accent] = colors;

  switch (product.category) {
    case 'sofas-sectionals':
      return `
        <g filter="url(#softShadow)" transform="translate(0 4)">
          <rect x="132" y="142" width="248" height="62" rx="28" fill="${primary}"/>
          <rect x="154" y="106" width="204" height="62" rx="26" fill="${secondary}"/>
          <rect x="122" y="152" width="46" height="76" rx="20" fill="${secondary}"/>
          <rect x="344" y="152" width="46" height="76" rx="20" fill="${secondary}"/>
          <rect x="178" y="160" width="58" height="46" rx="14" fill="#eee8de" opacity="0.78"/>
          <rect x="238" y="160" width="58" height="46" rx="14" fill="#eee8de" opacity="0.62"/>
          <rect x="298" y="160" width="58" height="46" rx="14" fill="#eee8de" opacity="0.78"/>
          <rect x="170" y="219" width="18" height="22" rx="5" fill="${accent}"/>
          <rect x="324" y="219" width="18" height="22" rx="5" fill="${accent}"/>
        </g>`;
    case 'armchairs':
      return `
        <g filter="url(#softShadow)" transform="translate(0 2)">
          <path d="M182 190 C182 126 211 96 257 96 C304 96 334 126 334 190 L334 213 C334 228 322 240 307 240 L209 240 C194 240 182 228 182 213 Z" fill="${primary}"/>
          <path d="M207 174 C207 134 228 115 257 115 C287 115 308 134 308 174 L308 205 L207 205 Z" fill="${secondary}"/>
          <rect x="162" y="164" width="46" height="72" rx="22" fill="${secondary}"/>
          <rect x="306" y="164" width="46" height="72" rx="22" fill="${secondary}"/>
          <path d="M203 239 L186 274 M312 239 L330 274" stroke="${accent}" stroke-width="8" stroke-linecap="round"/>
        </g>`;
    case 'tables':
      return `
        <g filter="url(#softShadow)">
          <ellipse cx="256" cy="142" rx="118" ry="42" fill="${primary}"/>
          <ellipse cx="256" cy="137" rx="108" ry="32" fill="${secondary}" opacity="0.72"/>
          <path d="M202 174 L184 260 M310 174 L330 260" stroke="${accent}" stroke-width="12" stroke-linecap="round"/>
          <path d="M220 216 H294" stroke="${accent}" stroke-width="8" stroke-linecap="round" opacity="0.65"/>
        </g>`;
    case 'beds':
      return `
        <g filter="url(#softShadow)">
          <rect x="142" y="93" width="228" height="54" rx="14" fill="${accent}"/>
          <rect x="132" y="136" width="248" height="112" rx="20" fill="${primary}"/>
          <rect x="154" y="154" width="86" height="42" rx="12" fill="#fffaf3"/>
          <rect x="272" y="154" width="86" height="42" rx="12" fill="#fffaf3"/>
          <path d="M152 218 C218 236 288 236 360 218" stroke="${secondary}" stroke-width="16" stroke-linecap="round"/>
        </g>`;
    case 'lighting':
      return `
        <g filter="url(#softShadow)">
          <path d="M256 71 V238" stroke="${accent}" stroke-width="10" stroke-linecap="round"/>
          <ellipse cx="256" cy="247" rx="62" ry="18" fill="${accent}"/>
          <path d="M207 103 C220 68 292 68 305 103 L287 155 H225 Z" fill="${primary}"/>
          <ellipse cx="256" cy="155" rx="34" ry="10" fill="${secondary}" opacity="0.5"/>
        </g>`;
    case 'storage-furniture':
      return `
        <g filter="url(#softShadow)">
          <rect x="128" y="128" width="256" height="112" rx="10" fill="${primary}"/>
          <rect x="148" y="146" width="96" height="76" rx="4" fill="${secondary}" opacity="0.7"/>
          <rect x="268" y="146" width="96" height="76" rx="4" fill="${secondary}" opacity="0.56"/>
          <circle cx="238" cy="184" r="5" fill="${accent}"/>
          <circle cx="274" cy="184" r="5" fill="${accent}"/>
          <rect x="154" y="244" width="26" height="16" rx="4" fill="${accent}"/>
          <rect x="332" y="244" width="26" height="16" rx="4" fill="${accent}"/>
        </g>`;
    case 'doors':
      return `
        <g filter="url(#softShadow)">
          <path d="M197 246 V109 C197 72 226 48 256 48 C286 48 315 72 315 109 V246 Z" fill="${primary}"/>
          <path d="M218 232 V111 C218 86 236 72 256 72 C276 72 294 86 294 111 V232 Z" fill="#e7eff0" opacity="0.9"/>
          <path d="M197 246 H315" stroke="${accent}" stroke-width="12" stroke-linecap="round"/>
          <circle cx="296" cy="171" r="5" fill="${accent}"/>
        </g>`;
    case 'windows':
      return `
        <g filter="url(#softShadow)">
          <rect x="156" y="76" width="200" height="168" rx="8" fill="${accent}"/>
          <rect x="174" y="94" width="164" height="132" rx="4" fill="${primary}"/>
          <path d="M256 94 V226 M174 160 H338" stroke="${accent}" stroke-width="9"/>
          <path d="M190 108 L322 218" stroke="#fff" stroke-width="7" opacity="0.36"/>
        </g>`;
    default:
      return `
        <g filter="url(#softShadow)">
          <path d="M225 113 C225 90 287 90 287 113 L274 229 C272 247 240 247 238 229 Z" fill="${primary}"/>
          <path d="M231 122 C246 133 266 133 281 122" stroke="${secondary}" stroke-width="8" stroke-linecap="round"/>
          <ellipse cx="256" cy="235" rx="45" ry="14" fill="${accent}" opacity="0.72"/>
        </g>`;
  }
};

const topViewShape = (product, colors) => {
  const [primary, secondary, accent] = colors;

  switch (product.category) {
    case 'sofas-sectionals':
      return `<rect x="70" y="78" width="372" height="146" rx="20" fill="${primary}" stroke="${accent}" stroke-width="8"/><rect x="94" y="102" width="324" height="72" rx="14" fill="${secondary}" opacity="0.6"/>`;
    case 'armchairs':
      return `<rect x="162" y="70" width="188" height="184" rx="34" fill="${primary}" stroke="${accent}" stroke-width="8"/><rect x="202" y="110" width="108" height="106" rx="20" fill="${secondary}" opacity="0.6"/>`;
    case 'tables':
      return `<ellipse cx="256" cy="160" rx="142" ry="88" fill="${primary}" stroke="${accent}" stroke-width="8"/><ellipse cx="256" cy="160" rx="92" ry="52" fill="${secondary}" opacity="0.45"/>`;
    case 'beds':
      return `<rect x="128" y="50" width="256" height="230" rx="18" fill="${primary}" stroke="${accent}" stroke-width="8"/><rect x="150" y="72" width="104" height="58" rx="12" fill="#fffaf3"/><rect x="258" y="72" width="104" height="58" rx="12" fill="#fffaf3"/>`;
    case 'lighting':
      return `<circle cx="256" cy="160" r="76" fill="${primary}" stroke="${accent}" stroke-width="8"/><circle cx="256" cy="160" r="24" fill="${secondary}"/>`;
    case 'storage-furniture':
      return `<rect x="86" y="104" width="340" height="112" rx="10" fill="${primary}" stroke="${accent}" stroke-width="8"/><line x1="256" y1="104" x2="256" y2="216" stroke="${accent}" stroke-width="6"/>`;
    case 'doors':
      return `<rect x="110" y="142" width="292" height="36" rx="6" fill="${primary}" stroke="${accent}" stroke-width="6"/><path d="M110 178 A150 150 0 0 1 260 28" fill="none" stroke="${accent}" stroke-width="5" stroke-dasharray="10 8"/>`;
    case 'windows':
      return `<rect x="96" y="126" width="320" height="68" rx="8" fill="${primary}" stroke="${accent}" stroke-width="8"/><line x1="256" y1="126" x2="256" y2="194" stroke="${accent}" stroke-width="6"/>`;
    default:
      return `<circle cx="256" cy="160" r="72" fill="${primary}" stroke="${accent}" stroke-width="8"/><circle cx="256" cy="160" r="34" fill="${secondary}" opacity="0.5"/>`;
  }
};

const thumbnailSvg = (product) => {
  const colors = palettes[product.category] || palettes.decor;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="320" viewBox="0 0 512 320" role="img" aria-label="${esc(product.name)}">
  ${shadow}
  <rect width="512" height="320" fill="url(#studioBg)"/>
  <ellipse cx="256" cy="255" rx="172" ry="38" fill="url(#floorFade)"/>
  ${productShape(product, colors)}
</svg>`;
};

const topViewSvg = (product) => {
  const colors = palettes[product.category] || palettes.decor;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="320" viewBox="0 0 512 320" role="img" aria-label="${esc(product.name)} top view">
  <rect width="512" height="320" fill="none"/>
  ${topViewShape(product, colors)}
</svg>`;
};

await mkdir(thumbnailDir, { recursive: true });
await mkdir(topViewDir, { recursive: true });
await mkdir(modelDir, { recursive: true });

const allProducts = [...catalogProducts, ...spacioProducts.map((product) => ({
  id: product.id,
  name: product.name,
  category: spacioCategoryPalette[product.category] || 'decor',
}))].reduce((map, product) => {
  if (!map.has(product.id)) map.set(product.id, product);
  return map;
}, new Map());

await Promise.all([...allProducts.values()].flatMap((product) => [
  writeFile(join(thumbnailDir, `${product.id}.svg`), thumbnailSvg(product), 'utf8'),
  writeFile(join(topViewDir, `${product.id}.svg`), topViewSvg(product), 'utf8'),
]));

const total = new Set([...catalogProducts.map((p) => p.id), ...spacioProducts.map((p) => p.id)]).size;
console.log(`Generated ${total} studio placeholder thumbnail sets.`);
