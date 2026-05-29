import { getThumbnail } from './thumbnails';

/** @typedef {import('./catalogData').FurnitureItem} FurnitureItem */
/** @typedef {import('./catalogData').CategoryCard} CategoryCard */

const DIM_MAP = {
  bed: { w: 180, d: 215, h: 90, type: 1 },
  sofa: { w: 200, d: 90, h: 85, type: 1 },
  couch: { w: 200, d: 90, h: 85, type: 1 },
  chair: { w: 75, d: 75, h: 90, type: 1 },
  armchair: { w: 80, d: 80, h: 85, type: 1 },
  lounge: { w: 85, d: 90, h: 85, type: 1 },
  stool: { w: 40, d: 40, h: 75, type: 1 },
  table: { w: 120, d: 60, h: 45, type: 1 },
  coffee: { w: 120, d: 60, h: 45, type: 1 },
  desk: { w: 140, d: 65, h: 75, type: 1 },
  dining: { w: 160, d: 90, h: 75, type: 1 },
  side: { w: 50, d: 50, h: 55, type: 1 },
  nightstand: { w: 50, d: 45, h: 55, type: 1 },
  lamp: { w: 35, d: 35, h: 165, type: 1 },
  pendant: { w: 30, d: 30, h: 40, type: 4 },
  ceiling: { w: 40, d: 40, h: 20, type: 4 },
  chandelier: { w: 60, d: 60, h: 60, type: 4 },
  sconce: { w: 20, d: 15, h: 30, type: 2 },
  wardrobe: { w: 120, d: 55, h: 200, type: 1 },
  cabinet: { w: 100, d: 45, h: 180, type: 1 },
  bookcase: { w: 80, d: 35, h: 180, type: 1 },
  shelf: { w: 80, d: 30, h: 180, type: 1 },
  dresser: { w: 100, d: 50, h: 100, type: 1 },
  sideboard: { w: 160, d: 45, h: 80, type: 1 },
  plant: { w: 50, d: 50, h: 120, type: 1 },
  rug: { w: 200, d: 140, h: 2, type: 1 },
  mirror: { w: 60, d: 5, h: 80, type: 2 },
  door: { w: 90, d: 10, h: 210, type: 3 },
  window: { w: 120, d: 10, h: 120, type: 3 },
  sink: { w: 50, d: 45, h: 85, type: 1 },
  toilet: { w: 40, d: 70, h: 80, type: 1 },
  bathtub: { w: 160, d: 75, h: 60, type: 1 },
  shower: { w: 100, d: 100, h: 220, type: 1 },
  fridge: { w: 70, d: 70, h: 180, type: 1 },
  stove: { w: 60, d: 60, h: 90, type: 1 },
  television: { w: 120, d: 10, h: 70, type: 2 },
  tv: { w: 120, d: 10, h: 70, type: 2 },
};

const CAT_META = {
  beds: { name: 'Beds', icon: '🛏' },
  sofas: { name: 'Sofas & Seating', icon: '🛋' },
  chairs: { name: 'Chairs & Stools', icon: '🪑' },
  tables: { name: 'Tables & Desks', icon: '📋' },
  storage: { name: 'Storage', icon: '🗄' },
  lighting: { name: 'Lighting', icon: '💡' },
  decor: { name: 'Decor & Plants', icon: '🌿' },
  kitchen: { name: 'Kitchen', icon: '🍳' },
  bathroom: { name: 'Bathroom', icon: '🛁' },
  'doors-windows': { name: 'Doors & Windows', icon: '🚪' },
  office: { name: 'Office', icon: '💻' },
  outdoor: { name: 'Outdoor', icon: '🌳' },
  kenney: { name: 'Kenney Furniture', icon: '📦' },
  'imported-products': { name: 'Imported Products', icon: '✨' },
  'imported-scenes': { name: 'Scene Assets', icon: '🏠' },
  inspiration: { name: 'Inspiration', icon: '💫' },
};

function getDims(filename) {
  const lower = filename.toLowerCase();
  for (const [key, dims] of Object.entries(DIM_MAP)) {
    if (lower.includes(key)) return dims;
  }
  return { w: 100, d: 100, h: 100, type: 1 };
}

function toName(filename) {
  return filename
    .replace(/\.(glb|gltf|obj)$/i, '')
    .replace(/[-_]/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * @returns {Promise<CategoryCard[]>}
 */
export async function buildDynamicCatalog() {
  let files = [];
  try {
    const res = await fetch('/api/catalog/files');
    if (!res.ok) return [];
    const payload = await res.json();
    files = payload.files ?? [];
  } catch (error) {
    console.warn('Could not load catalog files:', error);
    return [];
  }

  const groups = new Map();
  for (const fileUrl of files) {
    const parts = fileUrl.replace(/^\/models\//, '').split('/');
    const cat = parts.length > 1 ? parts[0] : 'uncategorized';
    if (!groups.has(cat)) groups.set(cat, []);
    groups.get(cat).push(fileUrl);
  }

  return [...groups.entries()].map(([catId, modelFiles]) => {
    const meta = CAT_META[catId] ?? { name: catId.replace(/-/g, ' '), icon: '📦' };
    /** @type {FurnitureItem[]} */
    const items = modelFiles.map((fileUrl) => {
      const filename = fileUrl.split('/').pop() ?? fileUrl;
      const dims = getDims(filename);
      return {
        id: fileUrl.replace(/\W/g, '_'),
        name: toName(filename),
        thumbnail: getThumbnail(fileUrl),
        modelUrl: fileUrl,
        previewModelUrl: fileUrl,
        type: dims.type,
        widthCm: dims.w,
        depthCm: dims.d,
        heightCm: dims.h,
        tags: [catId],
        source: 'imported',
      };
    });

    return {
      id: `dynamic-${catId}`,
      name: meta.name,
      thumbnail: items[0]?.thumbnail ?? '/thumbnails/placeholder.png',
      itemCount: items.length,
      items,
    };
  }).filter((cat) => cat.items.length > 0);
}
