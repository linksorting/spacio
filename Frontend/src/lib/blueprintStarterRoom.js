/** Empty floorplan — no walls, no items. */
export const BLANK_ROOM = JSON.stringify({
  floorplan: {
    corners: {},
    walls: [],
    wallTextures: [],
    floorTextures: {},
    newFloorTextures: {},
  },
  items: [],
});

/** Default rectangular room shipped with Blueprint3D example (textures use absolute paths). */
export const STARTER_ROOM = JSON.stringify({
  floorplan: {
    corners: {
      'f90da5e3-9e0e-eba7-173d-eb0b071e838e': { x: 204.851, y: 289.052 },
      'da026c08-d76a-a944-8e7b-096b752da9ed': { x: 672.211, y: 289.052 },
      '4e3d65cb-54c0-0681-28bf-bddcc7bdb571': { x: 672.211, y: -178.308 },
      '71d4f128-ae80-3d58-9bd2-711c6ce6cdf2': { x: 204.851, y: -178.308 },
    },
    walls: [
      { corner1: '71d4f128-ae80-3d58-9bd2-711c6ce6cdf2', corner2: 'f90da5e3-9e0e-eba7-173d-eb0b071e838e', frontTexture: { url: '/rooms/textures/wallmap.png', stretch: true, scale: 0 }, backTexture: { url: '/rooms/textures/wallmap.png', stretch: true, scale: 0 } },
      { corner1: 'f90da5e3-9e0e-eba7-173d-eb0b071e838e', corner2: 'da026c08-d76a-a944-8e7b-096b752da9ed', frontTexture: { url: '/rooms/textures/wallmap.png', stretch: true, scale: 0 }, backTexture: { url: '/rooms/textures/wallmap.png', stretch: true, scale: 0 } },
      { corner1: 'da026c08-d76a-a944-8e7b-096b752da9ed', corner2: '4e3d65cb-54c0-0681-28bf-bddcc7bdb571', frontTexture: { url: '/rooms/textures/wallmap.png', stretch: true, scale: 0 }, backTexture: { url: '/rooms/textures/wallmap.png', stretch: true, scale: 0 } },
      { corner1: '4e3d65cb-54c0-0681-28bf-bddcc7bdb571', corner2: '71d4f128-ae80-3d58-9bd2-711c6ce6cdf2', frontTexture: { url: '/rooms/textures/wallmap.png', stretch: true, scale: 0 }, backTexture: { url: '/rooms/textures/wallmap.png', stretch: true, scale: 0 } },
    ],
    wallTextures: [],
    floorTextures: {},
    newFloorTextures: {},
  },
  items: [],
});

export const isEmptyBlueprintDesign = (serialized) => {
  if (!serialized) return true;
  try {
    const data = JSON.parse(serialized);
    const walls = data?.floorplan?.walls;
    const corners = data?.floorplan?.corners;
    const hasWalls = Array.isArray(walls) && walls.length > 0;
    const hasCorners = corners && Object.keys(corners).length >= 3;
    return !hasWalls && !hasCorners;
  } catch {
    return true;
  }
};

export const storageKeyForProject = (projectId) => `bp3d_v2_${projectId || 'default'}`;
