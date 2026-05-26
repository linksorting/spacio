const DEFAULT_WALL_TEXTURE = {
  url: '/rooms/textures/wallmap.png',
  stretch: true,
  scale: 0,
};

/**
 * Convert a pointer position to Blueprint3D floorplan coordinates (cm).
 * @param {number} clientX
 * @param {number} clientY
 * @param {HTMLCanvasElement | null} canvasEl
 * @param {object | null} floorplanner
 * @param {number} snapCm
 * @param {boolean} snapOn
 */
export function clientToFloorplanCoords(clientX, clientY, canvasEl, floorplanner, snapCm = 10, snapOn = true) {
  if (!canvasEl || !floorplanner) return null;
  const rect = canvasEl.getBoundingClientRect();
  if (rect.width <= 0 || rect.height <= 0) return null;
  let x = (clientX - rect.left) * floorplanner.cmPerPixel + floorplanner.originX * floorplanner.cmPerPixel;
  let y = (clientY - rect.top) * floorplanner.cmPerPixel + floorplanner.originY * floorplanner.cmPerPixel;
  if (snapOn) {
    x = Math.round(x / snapCm) * snapCm;
    y = Math.round(y / snapCm) * snapCm;
  }
  return { x, y };
}

/** @param {{ x: number, z: number }} pointMeters */
export function snapWorldPointMeters(pointMeters, snapCm = 10, snapOn = true) {
  if (!pointMeters) return null;
  const snapM = snapCm / 100;
  let x = pointMeters.x;
  let z = pointMeters.z;
  if (snapOn) {
    x = Math.round(x / snapM) * snapM;
    z = Math.round(z / snapM) * snapM;
  }
  return { x: x * 100, z: z * 100 };
}

/**
 * Create a closed rectangular room from two opposite corners.
 * @param {object} floorplan
 * @param {number} x1
 * @param {number} y1
 * @param {number} x2
 * @param {number} y2
 * @param {{ minWidthCm?: number, minDepthCm?: number }} opts
 * @returns {boolean}
 */
export function createRectangularRoom(floorplan, x1, y1, x2, y2, opts = {}) {
  const minW = opts.minWidthCm ?? 100;
  const minD = opts.minDepthCm ?? 100;
  const minX = Math.min(x1, x2);
  const maxX = Math.max(x1, x2);
  const minY = Math.min(y1, y2);
  const maxY = Math.max(y1, y2);

  if (maxX - minX < minW || maxY - minY < minD) return false;

  const c1 = floorplan.newCorner(minX, minY);
  const c2 = floorplan.newCorner(maxX, minY);
  const c3 = floorplan.newCorner(maxX, maxY);
  const c4 = floorplan.newCorner(minX, maxY);

  [c1, c2, c3, c4].forEach((start, i) => {
    const end = [c2, c3, c4, c1][i];
    const wall = floorplan.newWall(start, end);
    wall.frontTexture = { ...DEFAULT_WALL_TEXTURE };
    wall.backTexture = { ...DEFAULT_WALL_TEXTURE };
  });

  floorplan.update();

  const rooms = floorplan.getRooms?.() ?? [];
  const room = rooms[rooms.length - 1];
  if (room) {
    room.setTexture('/rooms/textures/light_fine_wood.jpg', false, 300);
  }

  return true;
}
