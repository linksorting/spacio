const TEX = { url: '/rooms/textures/wallmap.png', stretch: true, scale: 0 };

/** Empty floorplan — no walls, no items. */
export const BLANK_ROOM = JSON.stringify({
  floorplan: { corners: {}, walls: [], wallTextures: [], floorTextures: {}, newFloorTextures: {} },
  items: [],
});

// ─── HELPERS ─────────────────────────────────────────────────────────────────

let _idCounter = 1;
const uid = () => `room-corner-${Date.now()}-${_idCounter++}`;

function rectRoom(widthCm, depthCm) {
  const hw = widthCm / 2;
  const hd = depthCm / 2;
  const [c1, c2, c3, c4] = [uid(), uid(), uid(), uid()];
  return JSON.stringify({
    floorplan: {
      corners: {
        [c1]: { x: -hw, y: -hd },
        [c2]: { x:  hw, y: -hd },
        [c3]: { x:  hw, y:  hd },
        [c4]: { x: -hw, y:  hd },
      },
      walls: [
        { corner1: c1, corner2: c2, frontTexture: TEX, backTexture: TEX },
        { corner1: c2, corner2: c3, frontTexture: TEX, backTexture: TEX },
        { corner1: c3, corner2: c4, frontTexture: TEX, backTexture: TEX },
        { corner1: c4, corner2: c1, frontTexture: TEX, backTexture: TEX },
      ],
      wallTextures: [],
      floorTextures: {},
      newFloorTextures: {},
    },
    items: [],
  });
}

// ─── NAMED PRESETS ────────────────────────────────────────────────────────────
// Each preset has a distinct shape/size so new projects always feel unique.

/** Compact square living room — 3.8 × 3.6 m */
export const ROOM_COMPACT_SQUARE   = () => rectRoom(380, 360);
/** Standard living room — 4.4 × 3.8 m (most common residential) */
export const ROOM_STANDARD_LIVING  = () => rectRoom(440, 380);
/** Wide open-plan — 5.6 × 4.0 m */
export const ROOM_OPEN_PLAN        = () => rectRoom(560, 400);
/** Long narrow room — 5.0 × 3.2 m (terrace / shotgun layout) */
export const ROOM_LONG_NARROW      = () => rectRoom(500, 320);
/** Square studio — 4.2 × 4.2 m */
export const ROOM_STUDIO_SQUARE    = () => rectRoom(420, 420);
/** Generous master suite — 4.8 × 4.0 m */
export const ROOM_MASTER_SUITE     = () => rectRoom(480, 400);

export const ROOM_PRESETS = [
  { id: 'compact-square',   label: 'Compact Square',   desc: '3.8 × 3.6 m',  fn: ROOM_COMPACT_SQUARE },
  { id: 'standard-living',  label: 'Standard Room',    desc: '4.4 × 3.8 m',  fn: ROOM_STANDARD_LIVING },
  { id: 'open-plan',        label: 'Open Plan',        desc: '5.6 × 4.0 m',  fn: ROOM_OPEN_PLAN },
  { id: 'long-narrow',      label: 'Long & Narrow',    desc: '5.0 × 3.2 m',  fn: ROOM_LONG_NARROW },
  { id: 'studio-square',    label: 'Studio Square',    desc: '4.2 × 4.2 m',  fn: ROOM_STUDIO_SQUARE },
  { id: 'master-suite',     label: 'Master Suite',     desc: '4.8 × 4.0 m',  fn: ROOM_MASTER_SUITE },
];

/**
 * Returns a new rectangular room JSON each time — cycles through the 6 presets
 * so every new blank project starts with a different shape.
 */
let _presetIndex = 0;
export function getStarterRoom() {
  const preset = ROOM_PRESETS[_presetIndex % ROOM_PRESETS.length];
  _presetIndex++;
  return preset.fn();
}

/**
 * Returns the starter room for a given preset id (or cycles if id is null).
 */
export function getStarterRoomById(id) {
  const preset = ROOM_PRESETS.find((p) => p.id === id);
  return preset ? preset.fn() : getStarterRoom();
}

// Keep STARTER_ROOM for any legacy code that imports it — defaults to standard.
export const STARTER_ROOM = ROOM_STANDARD_LIVING();

export const isEmptyBlueprintDesign = (serialized) => {
  if (!serialized) return true;
  try {
    const data = typeof serialized === 'string' ? JSON.parse(serialized) : serialized;
    const walls = data?.floorplan?.walls;
    const corners = data?.floorplan?.corners;
    const hasWalls = Array.isArray(walls) && walls.length > 0;
    const hasCorners = corners && Object.keys(corners).length >= 3;
    const hasLegacyItems = Array.isArray(data?.items) && data.items.length > 0;
    const hasGltfItems = Array.isArray(data?.designerGltfItems) && data.designerGltfItems.length > 0;
    const hasOpenings = Array.isArray(data?.designerWallOpenings) && data.designerWallOpenings.length > 0;
    const hasImportedTemplate = Boolean(data?.designerImportedTemplateId);
    return !hasWalls
      && !hasCorners
      && !hasLegacyItems
      && !hasGltfItems
      && !hasOpenings
      && !hasImportedTemplate;
  } catch {
    return true;
  }
};

export const storageKeyForProject = (projectId) => `bp3d_v2_${projectId || 'default'}`;
