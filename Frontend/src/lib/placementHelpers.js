const SNAP_DISTANCE_M = 0.25;

/**
 * Snap a floor-placed GLTF item flush to the nearest wall (within 25 cm).
 * Positions are in meters; blueprint walls use centimeters on the X/Z plane.
 * @param {{ x: number, z: number, rotationY?: number, depthCm?: number, widthCm?: number, placementMode?: string, type?: number }} entry
 * @param {object | null | undefined} floorplan
 * @returns {{ x: number, z: number, rotationY: number } | null}
 */
export function snapGltfItemToNearestWall(entry, floorplan) {
  if (!entry || !floorplan || entry.placementMode === 'wall') return null;
  if (Number(entry.type) !== 1 && entry.type != null) return null;

  const walls = floorplan.getWalls?.() ?? [];
  if (!walls.length) return null;

  const posX = entry.x;
  const posZ = entry.z;
  let bestDist = Infinity;
  /** @type {{ closestX: number, closestZ: number, dirX: number, dirZ: number } | null} */
  let bestWall = null;

  walls.forEach((wall) => {
    const start = wall.getStart?.();
    const end = wall.getEnd?.();
    if (!start || !end) return;

    const sx = start.x / 100;
    const sz = start.y / 100;
    const ex = end.x / 100;
    const ez = end.y / 100;
    const dirX = ex - sx;
    const dirZ = ez - sz;
    const len = Math.hypot(dirX, dirZ);
    if (!len) return;

    const ux = dirX / len;
    const uz = dirZ / len;
    const t = Math.max(0, Math.min(len, ((posX - sx) * ux) + ((posZ - sz) * uz)));
    const closestX = sx + ux * t;
    const closestZ = sz + uz * t;
    const dist = Math.hypot(posX - closestX, posZ - closestZ);

    if (dist < bestDist) {
      bestDist = dist;
      bestWall = { closestX, closestZ, dirX: ux, dirZ: uz };
    }
  });

  if (!bestWall || bestDist > SNAP_DISTANCE_M) return null;

  const normalX = -bestWall.dirZ;
  const normalZ = bestWall.dirX;
  const roomCentreX = (floorplan.getCenter?.()?.x ?? 0) / 100;
  const roomCentreZ = (floorplan.getCenter?.()?.z ?? floorplan.getCenter?.()?.y ?? 0) / 100;
  const toRoomX = roomCentreX - bestWall.closestX;
  const toRoomZ = roomCentreZ - bestWall.closestZ;
  const side = (toRoomX * normalX) + (toRoomZ * normalZ) > 0 ? 1 : -1;
  const inwardX = normalX * side;
  const inwardZ = normalZ * side;

  const halfDepthM = Math.max((entry.depthCm ?? 100) / 200, 0.05);

  return {
    x: bestWall.closestX + inwardX * halfDepthM,
    z: bestWall.closestZ + inwardZ * halfDepthM,
    rotationY: Math.atan2(inwardX, inwardZ),
  };
}
