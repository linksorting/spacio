/** @typedef {{ id: string, name: string, thumbnail: string, modelUrl: string, previewModelUrl?: string, type: number, widthCm: number, depthCm: number, heightCm: number, source: 'legacy' | 'imported' }} FurnitureItem */
/** @typedef {{ id: string, name: string, thumbnail: string, itemCount: number, items: FurnitureItem[] }} CategoryCard */
/** @typedef {{ id: string, name: string, thumbnail: string, style: string, presetId?: string, editablePresetId?: string, sceneModelUrl?: string, roomWidthCm?: number, roomDepthCm?: number }} InspirationRoom */
/** @typedef {{ id: string, label: string, rooms: InspirationRoom[] }} InspirationCategory */

export const CATALOG_FILTERS = [
  'All',
  'Living Room',
  'Bedroom',
  'Kitchen',
  'Bathroom',
  'Office',
];

function imported(id, name, slug, modelFile, thumbnail, widthCm, depthCm, heightCm, type = 1) {
  const modelUrl = `/models/imported-products/${slug}/${modelFile}`;
  let thumb;
  if (thumbnail.startsWith('/')) {
    thumb = thumbnail;
  } else if (modelFile.endsWith('.glb') || thumbnail === 'preview.png') {
    thumb = `/models/imported-products/${slug}/${thumbnail}`;
  } else {
    thumb = `/models/imported-products/${slug}/textures/${thumbnail}`;
  }
  return {
    id,
    name,
    thumbnail: thumb,
    modelUrl,
    previewModelUrl: modelUrl,
    type,
    widthCm,
    depthCm,
    heightCm,
    source: 'imported',
  };
}

/** @type {CategoryCard[]} */
export const CATALOG_CATEGORIES = [
  {
    id: 'imported-sofas',
    name: 'Detailed Sofas',
    thumbnail: '/models/imported-products/sofa-01/textures/Sofa_01_diff_1k.jpg',
    itemCount: 7,
    items: [
      imported('imported-sofa-01', 'Textured Sofa 01', 'sofa-01', 'Sofa_01_1k.gltf', 'Sofa_01_diff_1k.jpg', 220, 92, 85),
      imported('imported-sofa-02', 'Textured Sofa 02', 'sofa-02', 'sofa_02_1k.gltf', 'sofa_02_diff_1k.jpg', 220, 92, 85),
      imported('imported-sofa-03', 'Textured Sofa 03', 'sofa-03', 'sofa_03_1k.gltf', 'sofa_03_diff_1k.jpg', 235, 95, 88),
      imported('imported-realistic-sofa-004', 'Realistic Sofa 004', 'realistic-sofa-004', 'realistic-sofa-004.glb', 'preview.png', 220, 92, 85),
      imported('imported-realistic-sofa-005', 'Realistic Sofa 005', 'realistic-sofa-005', 'realistic-sofa-005.glb', 'preview.png', 220, 92, 85),
      imported('imported-realistic-sofa-009', 'Realistic Sofa 009', 'realistic-sofa-009', 'realistic-sofa-009.glb', 'preview.png', 220, 92, 85),
      imported('imported-realistic-sofa-010', 'Realistic Sofa 010', 'realistic-sofa-010', 'realistic-sofa-010.glb', 'preview.png', 235, 95, 88),
    ],
  },
  {
    id: 'imported-feature-seating',
    name: 'Detailed Seating',
    thumbnail: '/models/imported-products/modern-arm-chair-01/textures/modern_arm_chair_01_pillow_diff_1k.jpg',
    itemCount: 3,
    items: [
      imported('imported-modern-arm-chair', 'Modern Textured Arm Chair', 'modern-arm-chair-01', 'modern_arm_chair_01_1k.gltf', 'modern_arm_chair_01_pillow_diff_1k.jpg', 82, 88, 86),
      imported('imported-chair-032', 'Ergonomic Chair 032', 'chair-032', 'chair-032.glb', 'preview.png', 65, 70, 85),
      imported('imported-3-seater-sectional', '3-Seater Sectional Sofa', '3-seater-sectional-sofa', '3-seater-sectional-sofa.glb', 'preview.png', 240, 95, 85),
    ],
  },
  {
    id: 'imported-tables',
    name: 'Detailed Tables',
    thumbnail: '/models/imported-products/coffee-table-round-01/textures/coffee_table_round_01_diff_1k.jpg',
    itemCount: 3,
    items: [
      imported('imported-coffee-table-round', 'Round Coffee Table', 'coffee-table-round-01', 'coffee_table_round_01_1k.gltf', 'coffee_table_round_01_diff_1k.jpg', 105, 105, 42),
      imported('imported-round-wood-table', 'Round Wooden Dining Table', 'round-wooden-table-01', 'round_wooden_table_01_1k.gltf', 'round_wooden_table_01_diff_1k.jpg', 120, 120, 76),
      imported('imported-modern-dining-set', 'Modern Dining Table Set', 'modern-dining-set', 'modern-dining-set.glb', 'preview.png', 160, 90, 75),
    ],
  },
  {
    id: 'imported-bedroom',
    name: 'Detailed Bedroom',
    thumbnail: '/models/imported-products/gothic-bed-01/textures/GothicBed_01_diff_1k.jpg',
    itemCount: 1,
    items: [
      imported('imported-gothic-bed', 'Gothic Bed', 'gothic-bed-01', 'GothicBed_01_1k.gltf', 'GothicBed_01_diff_1k.jpg', 190, 220, 110),
    ],
  },
  {
    id: 'imported-storage',
    name: 'Detailed Storage',
    thumbnail: '/models/imported-products/chinese-cabinet/textures/chinese_cabinet_diff_1k.jpg',
    itemCount: 5,
    items: [
      imported('imported-chinese-cabinet', 'Chinese Cabinet', 'chinese-cabinet', 'chinese_cabinet_1k.gltf', 'chinese_cabinet_diff_1k.jpg', 115, 55, 190),
      imported('imported-detailed-cupboard-015', 'Detailed Cupboard 015', 'detailed-cupboard-015', 'detailed-cupboard-015.glb', 'preview.png', 100, 45, 180),
      imported('imported-detailed-cupboard-020', 'Detailed Cupboard 020', 'detailed-cupboard-020', 'detailed-cupboard-020.glb', 'preview.png', 100, 45, 180),
      imported('imported-detailed-cupboard-043', 'Detailed Cupboard 043', 'detailed-cupboard-043', 'detailed-cupboard-043.glb', 'preview.png', 100, 45, 180),
      imported('imported-under-sink-storage', 'Under-Sink Storage Organizer', 'under-sink-storage', 'under-sink-storage.glb', 'preview.png', 45, 45, 40),
    ],
  },
  {
    id: 'imported-architecture',
    name: 'Architecture & Doors',
    thumbnail: '/assets/products/thumbnails/wooden-door.png',
    itemCount: 3,
    items: [
      imported('imported-realistic-bathtub', 'Realistic Bathtub', 'realistic-bathtub', 'realistic-bathtub.glb', '/assets/products/thumbnails/realistic-bathtub.png', 170, 80, 58),
      imported('imported-casement-window', 'Casement Window', 'casement-window', 'casement-window.glb', '/assets/products/thumbnails/casement-window.png', 100, 10, 120),
      imported('imported-wooden-door', 'Wooden Door', 'wooden-door', 'wooden-door.glb', '/assets/products/thumbnails/wooden-door.png', 90, 10, 210),
    ],
  },
  {
    id: 'imported-decor',
    name: 'Decor & Art',
    thumbnail: '/assets/products/thumbnails/fancy-picture-frame.png',
    itemCount: 3,
    items: [
      imported('imported-fancy-picture-frame', 'Fancy Picture Frame', 'fancy-picture-frame', 'fancy_picture_frame_02_1k.gltf', '/assets/products/thumbnails/fancy-picture-frame.png', 60, 5, 80),
      imported('imported-marble-bust', 'Marble Bust', 'marble-bust', 'marble_bust_01_1k.gltf', '/assets/products/thumbnails/marble-bust.png', 30, 30, 50),
      imported('imported-standing-picture-frame', 'Standing Picture Frame', 'standing-picture-frame', 'standing_picture_frame_01_1k.gltf', '/assets/products/thumbnails/standing-picture-frame.png', 50, 30, 100),
    ],
  },
  {
    id: 'imported-plants',
    name: 'Plants & Greenery',
    thumbnail: '/assets/products/thumbnails/potted-plant.png',
    itemCount: 1,
    items: [
      imported('imported-potted-plant', 'Potted Plant', 'potted-plant', 'potted_plant_02_1k.gltf', '/assets/products/thumbnails/potted-plant.png', 40, 40, 80),
    ],
  },
];

const PLACEHOLDER = (text) =>
  `https://placehold.co/160x120/252525/666666?text=${encodeURIComponent(text)}`;

const LEGACY_CATEGORY_DEFS = [
  { id: 'legacy-sofas', name: 'Classic Sofas', keywords: ['sofa', 'sectional'] },
  { id: 'legacy-chairs', name: 'Classic Chairs', keywords: ['chair'] },
  { id: 'legacy-tables', name: 'Classic Tables', keywords: ['table', 'console'] },
  { id: 'legacy-bedroom', name: 'Classic Bedroom', keywords: ['bed'] },
  { id: 'legacy-storage', name: 'Classic Storage', keywords: ['dresser', 'wardrobe', 'bookshelf', 'trunk', 'media console'] },
  { id: 'legacy-lighting', name: 'Classic Lighting', keywords: ['lamp'] },
  { id: 'legacy-rugs', name: 'Classic Rugs', keywords: ['rug'] },
  { id: 'legacy-openings', name: 'Doors & Windows', keywords: ['door', 'window'] },
  { id: 'legacy-decor', name: 'Classic Decor', keywords: ['poster'] },
];

/**
 * Map a blueprint items.json entry to a catalog furniture item.
 * @param {object} entry
 * @param {number} index
 * @returns {FurnitureItem}
 */
export function mapBlueprintItemToFurniture(entry, index) {
  const modelUrl = entry.model?.startsWith('/') ? entry.model : `/${entry.model ?? ''}`;
  return {
    id: `legacy-${index}-${entry.name?.replace(/\s+/g, '-').toLowerCase() ?? index}`,
    name: entry.name ?? 'Item',
    thumbnail: entry.thumbnail ?? PLACEHOLDER(entry.name ?? 'Item'),
    modelUrl,
    type: Number(entry.type ?? 1),
    widthCm: 80,
    depthCm: 80,
    heightCm: 80,
    source: 'legacy',
  };
}

/**
 * Build category cards from legacy Blueprint3D items.json entries.
 * @param {object[]} blueprintItems
 * @returns {CategoryCard[]}
 */
export function buildLegacyCatalogCategories(blueprintItems = []) {
  /** @type {CategoryCard[]} */
  const categories = LEGACY_CATEGORY_DEFS.map((def) => ({
    id: def.id,
    name: def.name,
    thumbnail: PLACEHOLDER(def.name),
    itemCount: 0,
    items: [],
  }));

  blueprintItems.forEach((entry, index) => {
    const furniture = mapBlueprintItemToFurniture(entry, index);
    const lower = (entry.name ?? '').toLowerCase();
    const def = LEGACY_CATEGORY_DEFS.find((c) => c.keywords.some((kw) => lower.includes(kw)));
    const catId = def?.id ?? 'legacy-decor';
    const cat = categories.find((c) => c.id === catId);
    if (cat) {
      cat.items.push(furniture);
      cat.itemCount = cat.items.length;
      if (cat.items.length === 1 && entry.thumbnail) {
        cat.thumbnail = entry.thumbnail;
      }
    }
  });

  return categories.filter((cat) => cat.items.length > 0);
}

/** @param {CategoryCard[]} categories */
export function buildCatalogFlat(categories) {
  return categories.flatMap((cat) =>
    cat.items.map((item) => ({
      name: item.name,
      model: item.modelUrl,
      thumbnail: item.thumbnail,
      type: item.type,
    })),
  );
}

/** Default catalog flat list (GLTF/GLB imported products). */
export const DEFAULT_CATALOG_FLAT = buildCatalogFlat(CATALOG_CATEGORIES);

/** @type {InspirationCategory[]} */
export const INSPIRATION_CATEGORIES = [
  {
    id: 'living-room',
    label: 'Living Room',
    rooms: [
      {
        id: 'imported-premium-floorplan',
        name: 'Premium Floorplan C10',
        thumbnail: '/inspiration/imported-floorplan.svg',
        style: 'Imported 3D',
        sceneModelUrl: '/models/imported-scenes/premium-floorplan-c10.glb',
        roomWidthCm: 1050,
        roomDepthCm: 700,
        colorTreatment: 'Original embedded textures',
      },
      {
        id: 'coastal-lounge',
        name: 'Coastal Lounge',
        thumbnail: '/models/imported-products/realistic-sofa-005/preview.png',
        style: 'Coastal',
        presetId: 'coastal-lounge',
      },
      {
        id: 'luxury-loft',
        name: 'Luxury Loft Living',
        thumbnail: '/models/imported-products/3-seater-sectional-sofa/preview.png',
        style: 'Luxury',
        presetId: 'luxury-loft',
      },
      {
        id: 'patio-social',
        name: 'Patio Social Lounge',
        thumbnail: '/models/imported-products/realistic-sofa-009/preview.png',
        style: 'Indoor-Outdoor',
        presetId: 'patio-social',
      },
    ],
  },
  {
    id: 'bedroom',
    label: 'Bedroom',
    rooms: [
      {
        id: 'gothic-suite',
        name: 'Gothic Master Suite',
        thumbnail: '/models/imported-products/gothic-bed-01/textures/GothicBed_01_diff_1k.jpg',
        style: 'Gothic',
        presetId: 'gothic-suite',
      },
      {
        id: 'modern-bedroom',
        name: 'Modern Dark Bedroom',
        thumbnail: '/models/imported-products/detailed-cupboard-015/preview.png',
        style: 'Modern',
        presetId: 'modern-bedroom',
      },
      {
        id: 'japandi-bedroom',
        name: 'Japandi Minimal Bedroom',
        thumbnail: '/models/imported-products/gothic-bed-01/textures/GothicBed_01_diff_1k.jpg',
        style: 'Japandi',
        presetId: 'japandi-bedroom',
      },
    ],
  },
  {
    id: 'dining',
    label: 'Dining & Kitchen',
    rooms: [
      {
        id: 'imported-kitchen-assets',
        name: 'Editable Modern Kitchen',
        thumbnail: '/inspiration/imported-kitchen.svg',
        style: 'Modern',
        presetId: 'modern-kitchen',
      },
      {
        id: 'family-gathering',
        name: 'Family Gathering Dining',
        thumbnail: '/models/imported-products/modern-dining-set/preview.png',
        style: 'Contemporary',
        presetId: 'family-gathering',
      },
      {
        id: 'midcentury-dining',
        name: 'Mid-Century Dining Room',
        thumbnail: '/models/imported-products/chinese-cabinet/textures/chinese_cabinet_diff_1k.jpg',
        style: 'Mid-Century',
        presetId: 'midcentury-dining',
      },
    ],
  },
  {
    id: 'office',
    label: 'Office',
    rooms: [
      {
        id: 'executive-studio',
        name: 'Executive Studio',
        thumbnail: '/models/imported-products/chair-032/preview.png',
        style: 'Executive',
        presetId: 'executive-studio',
      },
      {
        id: 'minimal-office',
        name: 'Minimal Home Office',
        thumbnail: '/models/imported-products/round-wooden-table-01/textures/round_wooden_table_01_diff_1k.jpg',
        style: 'Minimal',
        presetId: 'minimal-office',
      },
    ],
  },
];

export function findInspirationRoom(roomId) {
  return INSPIRATION_CATEGORIES
    .flatMap((category) => category.rooms)
    .find((room) => room.id === roomId) ?? null;
}

/** Curated templates for the new-project flow (preset or scene shells). */
export const PROJECT_START_TEMPLATES = INSPIRATION_CATEGORIES.flatMap((category) =>
  category.rooms
    .filter((room) => room.presetId || room.sceneModelUrl)
    .map((room) => ({
      id: room.id,
      name: room.name,
      style: room.style,
      category: category.label,
      thumbnail: room.thumbnail,
      presetId: room.presetId,
      sceneModelUrl: room.sceneModelUrl,
      roomWidthCm: room.roomWidthCm,
      roomDepthCm: room.roomDepthCm,
    })),
);
