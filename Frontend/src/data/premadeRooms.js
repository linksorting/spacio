import { spacioMaterials } from '@/data/spacioMaterials';
import { polygonAreaM2 } from '@/utils/spacioGeometry';

const furniture = (id, productId, name, x, y, w, d, h, rotationY = 0) => ({
  id, productId, name, brand: '', category: '', position: { x, y, z: 0 }, rotationY,
  scale: { x: 1, y: 1, z: 1 }, dimensionsCm: { w, d, h }, materialOverrides: {},
  visible: true, locked: false, castShadow: true, receiveShadow: true,
});

const rectRoom = (id, name, roomType, polygon, style = 'Scandinavian') => ({
  id,
  name,
  roomType,
  style,
  wallLoop: [`${id}_n`, `${id}_e`, `${id}_s`, `${id}_w`],
  polygon,
  floorMaterialId: 'oak',
  wallMaterialId: 'plaster',
  ceilingMaterialId: 'plaster',
  heightCm: 280,
  areaM2: polygonAreaM2(polygon),
  visible: true,
  locked: false,
});

const rectWalls = (prefix, polygon, thickness = 18, height = 280) => {
  const [a, b, c, d] = polygon;
  return {
    [`${prefix}_n`]: { id: `${prefix}_n`, name: 'North Wall', start: { x: a.x, y: a.y }, end: { x: b.x, y: b.y }, thicknessCm: thickness, heightCm: height, materialId: 'plaster', visible: true, locked: false },
    [`${prefix}_e`]: { id: `${prefix}_e`, name: 'East Wall', start: { x: b.x, y: b.y }, end: { x: c.x, y: c.y }, thicknessCm: thickness, heightCm: height, materialId: 'plaster', visible: true, locked: false },
    [`${prefix}_s`]: { id: `${prefix}_s`, name: 'South Wall', start: { x: c.x, y: c.y }, end: { x: d.x, y: d.y }, thicknessCm: thickness, heightCm: height, materialId: 'plaster', visible: true, locked: false },
    [`${prefix}_w`]: { id: `${prefix}_w`, name: 'West Wall', start: { x: d.x, y: d.y }, end: { x: a.x, y: a.y }, thicknessCm: thickness, heightCm: height, materialId: 'plaster', visible: true, locked: false },
  };
};

const baseScene = (id, name, walls, rooms, openings, furnitureItems, camera = {}) => ({
  id,
  name,
  units: 'cm',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  activeView: 'floorplan',
  selectedIds: [],
  activeTool: 'select',
  camera: {
    editor3d: { position: [4.2, 7.5, 5.8], target: [3.6, 0.4, 2.6], fov: 58 },
    walkthrough: { position: [1.45, 1.6, 3.05], yaw: 0, pitch: 0 },
    ...camera,
  },
  settings: {
    theme: 'dark', snapToGrid: true, gridSizeCm: 25, wallThicknessCm: 18,
    ceilingHeightCm: 280, showCeiling: false, showLightHelpers: false,
    renderQuality: 'high', environmentPreset: 'Studio White',
    postFx: { ssao: false, bloom: false, depthOfField: false, vignette: false, chromaticAberration: false, exposure: 1 },
  },
  walls,
  openings,
  rooms,
  furniture: furnitureItems,
  lights: {},
  materials: spacioMaterials,
  measurements: {},
  moodboards: { primary: { id: 'primary', name: 'Moodboard', elements: [] } },
});

const livingPoly = [{ x: 0, y: 0 }, { x: 720, y: 0 }, { x: 720, y: 520 }, { x: 0, y: 520 }];

export const premadeRoomTemplates = [
  {
    id: 'scandinavian-living-room',
    name: 'Scandinavian Living Room',
    roomType: 'living_room',
    style: 'Scandinavian',
    summary: 'Warm neutrals, layered seating, curated decor',
    furnitureCount: 11,
    areaM2: 37.4,
  },
  {
    id: 'japandi-bedroom',
    name: 'Japandi Bedroom',
    roomType: 'bedroom',
    style: 'Japandi',
    summary: 'Low bed, calm palette, minimal storage',
    furnitureCount: 9,
    areaM2: 28.8,
  },
  {
    id: 'modern-kitchen-dining',
    name: 'Modern Kitchen + Dining',
    roomType: 'kitchen',
    style: 'Modern',
    summary: 'Island seating with adjacent dining zone',
    furnitureCount: 10,
    areaM2: 42.0,
  },
  {
    id: 'compact-home-office',
    name: 'Compact Home Office',
    roomType: 'office',
    style: 'Scandinavian',
    summary: 'Desk, storage, task lighting',
    furnitureCount: 7,
    areaM2: 18.5,
  },
  {
    id: 'luxury-bathroom',
    name: 'Luxury Bathroom',
    roomType: 'bathroom',
    style: 'Luxury',
    summary: 'Vanity, tub, refined fixtures',
    furnitureCount: 8,
    areaM2: 12.6,
  },
];

export const buildPremadeScene = (templateId) => {
  switch (templateId) {
    case 'scandinavian-living-room':
      return baseScene(
        'scandinavian-living-room',
        'Scandinavian Living Room',
        rectWalls('lr', livingPoly),
        { living: rectRoom('living', 'Living Room', 'living_room', livingPoly, 'Scandinavian') },
        {
          door_entry: { id: 'door_entry', wallId: 'lr_s', type: 'door', offsetCm: 90, widthCm: 92, heightCm: 210, sillHeightCm: 0, swingDirection: 'left', openAngleDeg: 20, visible: true, locked: false },
          window_1: { id: 'window_1', wallId: 'lr_n', type: 'window', offsetCm: 180, widthCm: 140, heightCm: 130, sillHeightCm: 82, visible: true, locked: false },
          window_2: { id: 'window_2', wallId: 'lr_n', type: 'window', offsetCm: 480, widthCm: 140, heightCm: 130, sillHeightCm: 82, visible: true, locked: false },
        },
        {
          sofa: furniture('sofa', 'moderno-sofa', 'Moderno 3-Seat Sofa', 220, 380, 220, 90, 80),
          chair: furniture('chair', 'vale-armchair', 'Vale Lounge Armchair', 520, 340, 82, 86, 78),
          coffee: furniture('coffee', 'carrara-table', 'Carrara Round Coffee Table', 295, 235, 90, 90, 38),
          rug: furniture('rug', 'woven-rug', 'Handwoven Area Rug', 210, 175, 240, 170, 1),
          lamp: furniture('lamp', 'arc-lamp', 'Arc Brass Floor Lamp', 580, 320, 72, 42, 180),
          shelf: furniture('shelf', 'grid-media', 'Grid Media Unit', 42, 42, 200, 42, 55),
          plant: furniture('plant', 'fiddle-leaf', 'Fiddle Leaf Fig', 610, 48, 70, 70, 160),
          art: furniture('art', 'gradient-art', 'Framed Gradient Wall Art', 310, 8, 80, 4, 110),
          side: furniture('side', 'sol-side-table', 'Sol Glass Side Table', 520, 250, 48, 48, 52),
          vase: furniture('vase', 'ceramic-vase', 'Ceramic Vase', 305, 245, 22, 22, 42),
          curtains: furniture('curtains', 'linen-curtains', 'Linen Curtains', 160, 4, 280, 4, 260),
        },
      );
    case 'japandi-bedroom': {
      const poly = [{ x: 0, y: 0 }, { x: 540, y: 0 }, { x: 540, y: 480 }, { x: 0, y: 480 }];
      return baseScene(
        'japandi-bedroom',
        'Japandi Bedroom',
        rectWalls('br', poly),
        { bedroom: rectRoom('bedroom', 'Bedroom', 'bedroom', poly, 'Japandi') },
        {
          door: { id: 'door', wallId: 'br_s', type: 'door', offsetCm: 420, widthCm: 86, heightCm: 210, sillHeightCm: 0, swingDirection: 'right', openAngleDeg: 0, visible: true, locked: false },
          window: { id: 'window', wallId: 'br_n', type: 'window', offsetCm: 270, widthCm: 160, heightCm: 120, sillHeightCm: 90, visible: true, locked: false },
        },
        {
          bed: furniture('bed', 'lowline-bed', 'Lowline Platform Bed', 145, 210, 160, 210, 42),
          ns1: furniture('ns1', 'sol-side-table', 'Sol Glass Side Table', 48, 220, 48, 48, 52),
          ns2: furniture('ns2', 'sol-side-table', 'Sol Glass Side Table', 352, 220, 48, 48, 52),
          lamp1: furniture('lamp1', 'ceramic-lamp', 'Ceramic Table Lamp', 52, 218, 32, 32, 58),
          lamp2: furniture('lamp2', 'ceramic-lamp', 'Ceramic Table Lamp', 356, 218, 32, 32, 58),
          wardrobe: furniture('wardrobe', 'emery-wardrobe', 'Emery Wardrobe', 390, 42, 120, 60, 220),
          rug: furniture('rug', 'woven-rug', 'Handwoven Area Rug', 120, 280, 200, 140, 1),
          plant: furniture('plant', 'fiddle-leaf', 'Fiddle Leaf Fig', 48, 48, 70, 70, 160),
          art: furniture('art', 'gradient-art', 'Framed Gradient Wall Art', 220, 8, 80, 4, 110),
          bench: furniture('bench', 'entry-bench', 'Entry Bench Storage', 180, 420, 120, 40, 48),
          curtains: furniture('curtains', 'linen-curtains', 'Linen Curtains', 200, 4, 200, 4, 260),
        },
        { editor3d: { position: [3.2, 6.8, 4.6], target: [2.7, 0.4, 2.4], fov: 58 } },
      );
    }
    case 'modern-kitchen-dining': {
      const poly = [{ x: 0, y: 0 }, { x: 780, y: 0 }, { x: 780, y: 420 }, { x: 0, y: 420 }];
      return baseScene(
        'modern-kitchen-dining',
        'Modern Kitchen + Dining',
        rectWalls('kd', poly),
        { kitchen: rectRoom('kitchen', 'Kitchen + Dining', 'kitchen', poly, 'Modern') },
        {
          door: { id: 'door', wallId: 'kd_s', type: 'door', offsetCm: 120, widthCm: 92, heightCm: 210, sillHeightCm: 0, swingDirection: 'left', visible: true, locked: false },
          window: { id: 'window', wallId: 'kd_n', type: 'window', offsetCm: 200, widthCm: 180, heightCm: 110, sillHeightCm: 100, visible: true, locked: false },
        },
        {
          island: furniture('island', 'kitchen-island', 'Kitchen Island', 280, 120, 180, 90, 92),
          stool1: furniture('stool1', 'alto-stool', 'Alto Bar Stool', 300, 230, 42, 42, 92),
          stool2: furniture('stool2', 'alto-stool', 'Alto Bar Stool', 360, 230, 42, 42, 92),
          stool3: furniture('stool3', 'alto-stool', 'Alto Bar Stool', 420, 230, 42, 42, 92),
          pendant1: furniture('pendant1', 'globe-pendant', 'Globe Pendant', 310, 160, 40, 40, 60),
          pendant2: furniture('pendant2', 'globe-pendant', 'Globe Pendant', 370, 160, 40, 40, 60),
          shelf: furniture('shelf', 'stringline-shelf', 'Stringline Shelf System', 42, 42, 120, 35, 200),
          table: furniture('table', 'atlas-table', 'Atlas Dining Table', 520, 280, 220, 95, 75),
          chair1: furniture('chair1', 'slat-chair', 'Slat Dining Chair', 490, 220, 48, 52, 82),
          chair2: furniture('chair2', 'slat-chair', 'Slat Dining Chair', 560, 220, 48, 52, 82),
          chair3: furniture('chair3', 'slat-chair', 'Slat Dining Chair', 630, 280, 48, 52, 82, 90),
          chair4: furniture('chair4', 'slat-chair', 'Slat Dining Chair', 560, 360, 48, 52, 82, 180),
          plant: furniture('plant', 'succulent', 'Succulent Cluster', 680, 48, 24, 24, 22),
          vase: furniture('vase', 'ceramic-vase', 'Ceramic Vase', 295, 115, 22, 22, 42),
        },
      );
    }
    case 'compact-home-office': {
      const poly = [{ x: 0, y: 0 }, { x: 360, y: 0 }, { x: 360, y: 320 }, { x: 0, y: 320 }];
      return baseScene(
        'compact-home-office',
        'Compact Home Office',
        rectWalls('of', poly),
        { office: rectRoom('office', 'Home Office', 'office', poly, 'Scandinavian') },
        {
          door: { id: 'door', wallId: 'of_s', type: 'door', offsetCm: 280, widthCm: 86, heightCm: 210, sillHeightCm: 0, swingDirection: 'left', visible: true, locked: false },
          window: { id: 'window', wallId: 'of_n', type: 'window', offsetCm: 180, widthCm: 140, heightCm: 120, sillHeightCm: 88, visible: true, locked: false },
        },
        {
          desk: furniture('desk', 'northline-desk', 'Northline Desk', 48, 80, 150, 70, 76),
          chair: furniture('chair', 'slat-chair', 'Slat Dining Chair', 110, 180, 48, 52, 82),
          shelf: furniture('shelf', 'cube-bookshelf', 'Open Cube Bookshelf', 250, 42, 100, 35, 180),
          lamp: furniture('lamp', 'office-task-lamp', 'Task Desk Lamp', 72, 72, 28, 28, 48),
          rug: furniture('rug', 'woven-rug', 'Handwoven Area Rug', 60, 140, 180, 140, 1),
          art: furniture('art', 'gradient-art', 'Framed Gradient Wall Art', 130, 8, 80, 4, 110),
          plant: furniture('plant', 'fiddle-leaf', 'Fiddle Leaf Fig', 280, 220, 70, 70, 160),
        },
      );
    }
    case 'luxury-bathroom': {
      const poly = [{ x: 0, y: 0 }, { x: 360, y: 0 }, { x: 360, y: 280 }, { x: 0, y: 280 }];
      return baseScene(
        'luxury-bathroom',
        'Luxury Bathroom',
        rectWalls('ba', poly),
        { bathroom: rectRoom('bathroom', 'Bathroom', 'bathroom', poly, 'Luxury') },
        {
          door: { id: 'door', wallId: 'ba_s', type: 'door', offsetCm: 280, widthCm: 78, heightCm: 210, sillHeightCm: 0, swingDirection: 'right', visible: true, locked: false },
          window: { id: 'window', wallId: 'ba_n', type: 'window', offsetCm: 180, widthCm: 80, heightCm: 60, sillHeightCm: 160, visible: true, locked: false },
        },
        {
          vanity: furniture('vanity', 'marble-vanity', 'Marble Vanity', 42, 42, 120, 52, 86),
          mirror: furniture('mirror', 'round-mirror', 'Round Mirror', 90, 8, 90, 4, 90),
          tub: furniture('tub', 'freestanding-tub', 'Freestanding Tub', 200, 120, 170, 80, 58),
          toilet: furniture('toilet', 'wall-toilet', 'Wall-Hung Toilet', 280, 42, 38, 58, 42),
          towel: furniture('towel', 'brass-towel-rack', 'Brass Towel Rack', 300, 8, 60, 8, 12),
          sconce1: furniture('sconce1', 'wall-sconce', 'Sculptural Wall Sconce', 70, 8, 22, 16, 38),
          sconce2: furniture('sconce2', 'wall-sconce', 'Sculptural Wall Sconce', 130, 8, 22, 16, 38),
          mat: furniture('mat', 'bath-mat', 'Woven Bath Mat', 180, 210, 80, 50, 1),
          vase: furniture('vase', 'ceramic-vase', 'Ceramic Vase', 150, 48, 22, 22, 42),
        },
        { editor3d: { position: [2.2, 5.5, 3.2], target: [1.8, 0.4, 1.4], fov: 58 } },
      );
    }
    default:
      return null;
  }
};

export const loadPremadeScene = (templateId) => buildPremadeScene(templateId);
