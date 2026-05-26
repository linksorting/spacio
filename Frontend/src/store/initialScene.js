import { spacioMaterials } from '@/data/spacioMaterials';
import { polygonAreaM2 } from '@/utils/spacioGeometry';

const createdAt = '2026-05-23T09:00:00.000Z';
const roomPolygon = [{ x: 0, y: 0 }, { x: 720, y: 0 }, { x: 720, y: 520 }, { x: 0, y: 520 }];

const furniture = (id, productId, name, x, y, w, d, h, rotationY = 0) => ({
  id, productId, name, brand: '', category: '', position: { x, y, z: 0 }, rotationY,
  scale: { x: 1, y: 1, z: 1 }, dimensionsCm: { w, d, h }, materialOverrides: {},
  visible: true, locked: false, castShadow: true, receiveShadow: true,
});

const slugify = (name) => String(name).trim().toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'new-design';

export const createEmptyScene = (name = 'Untitled Project', id = slugify(name)) => {
  const now = new Date().toISOString();
  return {
    id,
    name,
    units: 'cm',
    createdAt: now,
    updatedAt: now,
    activeView: 'floorplan',
    selectedIds: [],
    activeTool: 'select',
    camera: {
      editor3d: { position: [0, 14, 14], target: [0, 0, 0], fov: 58 },
      walkthrough: { position: [0, 1.6, 0], yaw: 0, pitch: 0 },
    },
    settings: {
      theme: 'dark', snapToGrid: true, gridSizeCm: 25, wallThicknessCm: 18,
      ceilingHeightCm: 280, showCeiling: false, showLightHelpers: false,
      renderQuality: 'high', environmentPreset: 'Studio White',
      postFx: { ssao: false, bloom: false, depthOfField: false, vignette: false, chromaticAberration: false, exposure: 1 },
    },
    walls: {},
    openings: {},
    rooms: {},
    furniture: {},
    lights: {},
    materials: spacioMaterials,
    measurements: {},
    moodboards: { primary: { id: 'primary', name: 'Moodboard', elements: [] } },
  };
};

export const SAMPLE_PROJECT_ID = 'modern-scandinavian-living-room';

export const createSampleScene = (name = 'Modern Scandinavian Living Room', id = SAMPLE_PROJECT_ID) => ({
  id,
  name,
  units: 'cm',
  createdAt,
  updatedAt: createdAt,
  activeView: 'floorplan',
  selectedIds: [],
  activeTool: 'select',
  camera: {
    editor3d: { position: [4.9, 8.2, 6.4], target: [3.6, 0.4, 2.6], fov: 58 },
    walkthrough: { position: [1.45, 1.6, 3.05], yaw: 0, pitch: 0 },
  },
  settings: {
    theme: 'dark', snapToGrid: true, gridSizeCm: 25, wallThicknessCm: 18,
    ceilingHeightCm: 280, showCeiling: false, showLightHelpers: false,
    renderQuality: 'high', environmentPreset: 'Golden Hour',
    postFx: { ssao: true, bloom: true, depthOfField: false, vignette: true, chromaticAberration: false, exposure: 1.06 },
  },
  walls: {
    wall_north: { id: 'wall_north', name: 'North Wall', start: { x: 0, y: 0 }, end: { x: 720, y: 0 }, thicknessCm: 18, heightCm: 280, materialId: 'plaster', visible: true, locked: false },
    wall_east: { id: 'wall_east', name: 'East Wall', start: { x: 720, y: 0 }, end: { x: 720, y: 520 }, thicknessCm: 18, heightCm: 280, materialId: 'plaster', visible: true, locked: false },
    wall_south: { id: 'wall_south', name: 'South Wall', start: { x: 720, y: 520 }, end: { x: 0, y: 520 }, thicknessCm: 18, heightCm: 280, materialId: 'plaster', visible: true, locked: false },
    wall_west: { id: 'wall_west', name: 'West Wall', start: { x: 0, y: 520 }, end: { x: 0, y: 0 }, thicknessCm: 18, heightCm: 280, materialId: 'plaster', visible: true, locked: false },
  },
  openings: {
    door_entry: { id: 'door_entry', wallId: 'wall_south', type: 'door', offsetCm: 90, widthCm: 92, heightCm: 210, sillHeightCm: 0, swingDirection: 'left', visible: true, locked: false },
    window_1: { id: 'window_1', wallId: 'wall_north', type: 'window', offsetCm: 150, widthCm: 150, heightCm: 130, sillHeightCm: 82, visible: true, locked: false },
    window_2: { id: 'window_2', wallId: 'wall_north', type: 'window', offsetCm: 420, widthCm: 150, heightCm: 130, sillHeightCm: 82, visible: true, locked: false },
  },
  rooms: {
    living: {
      id: 'living', name: 'Living Room', roomType: 'living_room', style: 'Scandinavian',
      wallLoop: ['wall_north', 'wall_east', 'wall_south', 'wall_west'],
      polygon: roomPolygon, floorMaterialId: 'oak', wallMaterialId: 'plaster', ceilingMaterialId: 'plaster',
      heightCm: 280, areaM2: polygonAreaM2(roomPolygon), visible: true, locked: false,
    },
  },
  furniture: {
    sofa: furniture('sofa', 'moderno-sofa', 'Moderno 3-Seat Sofa', 235, 392, 220, 90, 80),
    coffee: furniture('coffee', 'carrara-table', 'Carrara Round Coffee Table', 300, 242, 90, 90, 38),
    lamp: furniture('lamp', 'arc-lamp', 'Arc Brass Floor Lamp', 585, 350, 72, 42, 180),
    shelf: furniture('shelf', 'stringline-shelf', 'Stringline Shelf System', 46, 42, 120, 35, 200),
    rug: furniture('rug', 'woven-rug', 'Handwoven Area Rug', 225, 185, 240, 170, 1),
    plant: furniture('plant', 'fiddle-leaf', 'Fiddle Leaf Fig', 615, 54, 70, 70, 160),
    art: furniture('art', 'gradient-art', 'Framed Gradient Wall Art', 400, 12, 80, 4, 110),
    vase: furniture('vase', 'ceramic-vase', 'Ceramic Vase', 318, 252, 22, 22, 42),
  },
  lights: {
    ceiling: {
      id: 'ceiling', type: 'point', name: 'Globe Pendant', position: { x: 360, y: 245, z: 260 },
      rotation: { x: 0, y: 0, z: 0 }, target: { x: 360, y: 0, z: 260 }, intensity: 34,
      kelvin: 3000, color: '#ffd59a', range: 420, angle: 0, penumbra: 0,
      castShadow: true, enabled: true, visible: true, locked: false,
    },
    ambient: {
      id: 'ambient', type: 'hemisphere', name: 'Ambient Light', position: { x: 0, y: 280, z: 0 },
      rotation: { x: 0, y: 0, z: 0 }, target: { x: 0, y: 0, z: 0 }, intensity: 0.45,
      kelvin: 5000, color: '#fff3df', range: 0, angle: 0, penumbra: 0,
      castShadow: false, enabled: true, visible: true, locked: true,
    },
    sunlight: {
      id: 'sunlight', type: 'directional', name: 'Directional Sunlight', position: { x: 180, y: 410, z: -120 },
      rotation: { x: 0, y: 0, z: 0 }, target: { x: 360, y: 0, z: 260 }, intensity: 2.1,
      kelvin: 4200, color: '#ffe5bf', range: 0, angle: 0, penumbra: 0,
      castShadow: true, enabled: true, visible: true, locked: false,
    },
  },
  materials: spacioMaterials,
  measurements: {},
  moodboards: {
    primary: { id: 'primary', name: 'Warm Minimal', elements: [] },
  },
});
