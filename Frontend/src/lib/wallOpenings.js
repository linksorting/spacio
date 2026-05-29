/** @typedef {'door' | 'window' | 'doorway'} WallOpeningType */
/** @typedef {{
 *   id: string,
 *   wallId: string,
 *   startCornerId?: string | number,
 *   endCornerId?: string | number,
 *   type: WallOpeningType,
 *   offsetAlongWall: number,
 *   widthCm: number,
 *   heightCm: number,
 *   elevationCm: number,
 *   swingDir?: 'left' | 'right',
 * }} WallOpening */

/** @typedef {{
 *   type: WallOpeningType,
 *   widthCm: number,
 *   heightCm: number,
 *   elevCm: number,
 *   label: string,
 * }} WallPlacementConfig */

export const OPENING_TYPES = [
  { type: 'doorway', widthCm: 90, heightCm: 210, elevCm: 0, label: 'Doorway (no door)' },
  { type: 'doorway', widthCm: 120, heightCm: 210, elevCm: 0, label: 'Wide Doorway' },
  { type: 'door', widthCm: 90, heightCm: 210, elevCm: 0, label: 'Single Door' },
  { type: 'door', widthCm: 160, heightCm: 210, elevCm: 0, label: 'Double Door' },
  { type: 'window', widthCm: 120, heightCm: 120, elevCm: 90, label: 'Window (120cm)' },
  { type: 'window', widthCm: 180, heightCm: 140, elevCm: 90, label: 'Large Window' },
  { type: 'window', widthCm: 60, heightCm: 80, elevCm: 120, label: 'High Window' },
];

export function getWallId(wall) {
  const start = wall?.getStart?.();
  const end = wall?.getEnd?.();
  if (start?.id != null && end?.id != null) {
    return `${start.id}${end.id}`;
  }
  return null;
}

/** @param {string | null | undefined} wallIdA @param {string | null | undefined} wallIdB */
export function wallIdsMatch(wallIdA, wallIdB) {
  if (!wallIdA || !wallIdB) return false;
  if (wallIdA === wallIdB) return true;

  if (wallIdA.includes(':') || wallIdB.includes(':')) {
    const normalize = (wallId) => wallId.split(':').sort().join(':');
    return normalize(wallIdA) === normalize(wallIdB);
  }

  if (wallIdA.length !== wallIdB.length || wallIdA.length % 2 !== 0) return false;
  const half = wallIdA.length / 2;
  const a0 = wallIdA.slice(0, half);
  const a1 = wallIdA.slice(half);
  const b0 = wallIdB.slice(0, half);
  const b1 = wallIdB.slice(half);
  return (a0 === b0 && a1 === b1) || (a0 === b1 && a1 === b0);
}

/**
 * @param {object | null | undefined} wall
 * @param {WallOpening[]} openings
 */
export function getOpeningsForWall(wall, openings = []) {
  if (!wall || !openings.length) return [];
  const forward = getWallId(wall);
  const startId = wall.getStart?.()?.id;
  const endId = wall.getEnd?.()?.id;
  const reverse = startId != null && endId != null ? `${endId}${startId}` : null;
  return openings.filter((opening) => (
    opening.wallId === forward
    || (reverse && opening.wallId === reverse)
    || wallIdsMatch(opening.wallId, forward)
    || (opening.startCornerId != null && opening.endCornerId != null && startId != null && endId != null && (
      (opening.startCornerId === startId && opening.endCornerId === endId)
      || (opening.startCornerId === endId && opening.endCornerId === startId)
    ))
  ));
}

/**
 * @param {WallOpening} opening
 * @param {number} wallLenCm
 */
export function getOpeningSpan(opening, wallLenCm) {
  const offset = Number.isFinite(opening.offsetAlongWall) ? opening.offsetAlongWall : 0.5;
  const half = (opening.widthCm / 2) / Math.max(wallLenCm, 1);
  const t0 = Math.max(0, offset - half);
  const t1 = Math.min(1, offset + half);
  if (!Number.isFinite(t0) || !Number.isFinite(t1) || t1 <= t0) {
    return { t0: 0.4, t1: 0.6 };
  }
  return { t0, t1 };
}

function projectPointToSegment(pointX, pointZ, startX, startZ, endX, endZ) {
  const dx = endX - startX;
  const dz = endZ - startZ;
  const lenSq = (dx * dx) + (dz * dz);
  if (!lenSq) return null;

  const t = Math.max(0, Math.min(1, (((pointX - startX) * dx) + ((pointZ - startZ) * dz)) / lenSq));
  return {
    t,
    x: startX + (dx * t),
    z: startZ + (dz * t),
    lengthCm: Math.sqrt(lenSq) * 100,
  };
}

export function getWallLengthCm(wall) {
  if (!wall) return 0;
  const dx = (wall.getEndX?.() ?? 0) - (wall.getStartX?.() ?? 0);
  const dy = (wall.getEndY?.() ?? 0) - (wall.getStartY?.() ?? 0);
  return Math.hypot(dx, dy);
}

export function getWallAngle(wall) {
  const startX = wall.getStartX?.() ?? 0;
  const startY = wall.getStartY?.() ?? 0;
  const endX = wall.getEndX?.() ?? 0;
  const endY = wall.getEndY?.() ?? 0;
  return Math.atan2(endY - startY, endX - startX);
}

/**
 * @param {object} floorplan
 * @param {number} worldXMeters
 * @param {number} worldZMeters
 * @param {number} [maxDistCm=80]
 */
export function getWallHitFromWorldPoint(floorplan, worldXMeters, worldZMeters, maxDistCm = 80) {
  const walls = floorplan?.getWalls?.() ?? [];
  const pointX = worldXMeters * 100;
  const pointZ = worldZMeters * 100;

  let closestWall = null;
  let closestDist = Infinity;
  let closestOffset = 0;
  let closestWorld = { x: worldXMeters, z: worldZMeters };

  walls.forEach((wall) => {
    const edge = wall.frontEdge || wall.backEdge;
    const interiorStart = edge?.interiorStart?.();
    const interiorEnd = edge?.interiorEnd?.();
    const startX = interiorStart?.x ?? wall.getStartX?.() ?? 0;
    const startY = interiorStart?.y ?? wall.getStartY?.() ?? 0;
    const endX = interiorEnd?.x ?? wall.getEndX?.() ?? 0;
    const endY = interiorEnd?.y ?? wall.getEndY?.() ?? 0;
    const dx = endX - startX;
    const dy = endY - startY;
    const lenSq = (dx * dx) + (dy * dy);
    if (!lenSq) return;

    const t = Math.max(0, Math.min(1, (((pointX - startX) * dx) + ((pointZ - startY) * dy)) / lenSq));
    const hitX = startX + (dx * t);
    const hitY = startY + (dy * t);
    const dist = Math.hypot(pointX - hitX, pointZ - hitY);

    if (dist < maxDistCm && dist < closestDist) {
      closestDist = dist;
      closestWall = wall;
      closestOffset = t;
      closestWorld = { x: hitX / 100, z: hitY / 100 };
    }
  });

  if (!closestWall) return null;
  return {
    wall: closestWall,
    wallId: getWallId(closestWall),
    offsetAlongWall: closestOffset,
    worldPos: closestWorld,
    angle: getWallAngle(closestWall),
    lengthCm: closestWall.frontEdge?.interiorDistance?.()
      ?? closestWall.backEdge?.interiorDistance?.()
      ?? getWallLengthCm(closestWall),
  };
}

/**
 * Project a world point onto a specific wall half-edge (for direct wall clicks).
 * @param {object} edge
 * @param {number} worldXMeters
 * @param {number} worldZMeters
 */
export function getWallHitFromEdge(edge, worldXMeters, worldZMeters) {
  const wall = edge?.wall;
  if (!wall) return null;

  const interiorStart = edge.interiorStart?.();
  const interiorEnd = edge.interiorEnd?.();
  const projected = interiorStart && interiorEnd
    ? projectPointToSegment(
      worldXMeters,
      worldZMeters,
      interiorStart.x / 100,
      interiorStart.y / 100,
      interiorEnd.x / 100,
      interiorEnd.y / 100,
    )
    : projectPointToSegment(
      worldXMeters,
      worldZMeters,
      (wall.getStartX?.() ?? 0) / 100,
      (wall.getStartY?.() ?? 0) / 100,
      (wall.getEndX?.() ?? 0) / 100,
      (wall.getEndY?.() ?? 0) / 100,
    );
  if (!projected) return null;

  const startX = interiorStart ? interiorStart.x / 100 : (wall.getStartX?.() ?? 0) / 100;
  const startZ = interiorStart ? interiorStart.y / 100 : (wall.getStartY?.() ?? 0) / 100;
  const endX = interiorEnd ? interiorEnd.x / 100 : (wall.getEndX?.() ?? 0) / 100;
  const endZ = interiorEnd ? interiorEnd.y / 100 : (wall.getEndY?.() ?? 0) / 100;

  return {
    wall,
    wallId: getWallId(wall),
    offsetAlongWall: projected.t,
    worldPos: { x: projected.x, z: projected.z },
    angle: Math.atan2(endZ - startZ, endX - startX),
    lengthCm: projected.lengthCm || getWallLengthCm(wall),
  };
}

/**
 * @param {WallOpening[]} openings
 * @param {object} floorplan
 */
export function attachOpeningsToWalls(openings, floorplan) {
  const walls = floorplan?.getWalls?.() ?? [];
  walls.forEach((wall) => {
    wall.openings = [];
  });
  openings.forEach((opening) => {
    const wall = walls.find((entry) => wallIdsMatch(getWallId(entry), opening.wallId));
    if (!wall) return;
    if (!wall.openings) wall.openings = [];
    wall.openings.push(opening);
  });
}

/**
 * @param {object} wall
 * @param {number} offsetAlongWall
 * @param {WallPlacementConfig} cfg
 * @param {WallOpening[]} existing
 * @param {number} [lengthCm]
 * @returns {WallOpening}
 */
export function createWallOpening(wall, offsetAlongWall, cfg, existing = [], lengthCm) {
  const wallId = getWallId(wall);
  const wallLen = Math.max(lengthCm || getWallLengthCm(wall), 1);
  const halfWidthRatio = (cfg.widthCm / 2) / wallLen;
  const clampedOffset = Math.max(
    halfWidthRatio + 0.02,
    Math.min(1 - halfWidthRatio - 0.02, offsetAlongWall),
  );

  return {
    id: `opening_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    wallId,
    startCornerId: wall.getStart?.()?.id,
    endCornerId: wall.getEnd?.()?.id,
    type: cfg.type,
    offsetAlongWall: clampedOffset,
    widthCm: cfg.widthCm,
    heightCm: cfg.heightCm,
    elevationCm: cfg.elevCm,
    swingDir: cfg.type === 'door' ? 'left' : undefined,
  };
}

/**
 * @param {object} floorplan
 * @param {number} offsetAlongWall
 * @param {object} wall
 * @param {WallOpening[]} openings
 */
export function getOpeningAtWallOffset(floorplan, wall, offsetAlongWall, openings) {
  const wallId = getWallId(wall);
  const wallLen = getWallLengthCm(wall);
  if (!wallLen) return null;

  const match = openings.find((opening) => {
    if (!wallIdsMatch(opening.wallId, wallId)) return false;
    const halfRatio = (opening.widthCm / 2) / wallLen;
    return Math.abs(offsetAlongWall - opening.offsetAlongWall) < halfRatio + 0.02;
  });

  if (!match) return null;
  return { wall, opening: match };
}

/**
 * Merge persisted openings onto extracted room shell physical walls.
 * @param {object | null} shell
 * @param {WallOpening[]} openings
 * @param {object} floorplan
 */
export function applyOpeningsToRoomShell(shell, openings, floorplan) {
  if (!shell || !openings.length) return shell;

  const floorplanWalls = floorplan?.getWalls?.() ?? [];

  const resolveWallOpenings = (wall) => {
    if (!wall) return [];
    return getOpeningsForWall(wall, openings);
  };

  const resolvePhysicalWallOpenings = (physicalWall) => {
    const matchedWall = floorplanWalls.find((wall) => wallIdsMatch(getWallId(wall), physicalWall.wallId));
    if (matchedWall) return resolveWallOpenings(matchedWall);
    return openings.filter((opening) => wallIdsMatch(opening.wallId, physicalWall.wallId));
  };

  return {
    ...shell,
    walls: shell.walls.map((wall) => {
      const wallOpenings = resolveWallOpenings(wall.sourceEdge?.wall);
      if (!wallOpenings.length) return wall;
      return { ...wall, openings: wallOpenings };
    }),
    physicalWalls: shell.physicalWalls.map((physicalWall) => {
      const wallOpenings = resolvePhysicalWallOpenings(physicalWall);
      if (!wallOpenings.length) return physicalWall;
      return { ...physicalWall, openings: wallOpenings };
    }),
  };
}
