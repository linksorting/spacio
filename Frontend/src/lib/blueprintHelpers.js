/** Blueprint3D factory only supports 1, 2, 3, 7, 8, 9. */
export function normalizeItemType(type) {
  const t = Number(type ?? 1);
  if (t === 4) return 1;
  return t;
}

export function createModelLoadId() {
  return `load-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/** Spread new catalog items in a ring inside the current room. */
export function getCatalogPlacementPosition(floorplan, itemIndex = 0) {
  const rooms = floorplan?.getRooms?.() ?? [];
  const room = rooms[0];
  const center = floorplan?.getCenter?.();
  const cx = center?.x ?? 0;
  const cz = center?.z ?? 0;

  const tryPoint = (x, z) => {
    if (!room?.interiorCorners?.length) return true;
    return pointInPolygon(x, z, room.interiorCorners);
  };

  if (itemIndex <= 0) {
    return { x: cx, z: cz };
  }

  for (let attempt = 0; attempt < 24; attempt += 1) {
    const ring = Math.floor(attempt / 6);
    const slot = attempt % 6;
    const radius = 60 + ring * 55;
    const angle = slot * (Math.PI / 3) + ring * 0.35;
    const x = cx + Math.cos(angle) * radius;
    const z = cz + Math.sin(angle) * radius;
    if (tryPoint(x, z)) return { x, z };
  }

  return { x: cx, z: cz };
}

function pointInPolygon(x, y, corners) {
  let minX = Infinity;
  let minY = Infinity;
  for (let i = 0; i < corners.length; i += 1) {
    minX = Math.min(minX, corners[i].x);
    minY = Math.min(minY, corners[i].y);
  }
  const startX = minX - 10;
  const startY = minY - 10;
  let intersects = 0;
  for (let i = 0; i < corners.length; i += 1) {
    const a = corners[i];
    const b = corners[(i + 1) % corners.length];
    const ax = a.x;
    const ay = a.y;
    const bx = b.x;
    const by = b.y;
    if (((ay > y) !== (by > y))
      && (x < ((bx - ax) * (y - ay)) / (by - ay + 1e-9) + ax)) {
      intersects += 1;
    }
  }
  return intersects % 2 === 1;
}

/** Correct floor height and keep item inside the room footprint. */
export function settleItemOnFloor(item, floorplan) {
  if (!item || !item.position) return;
  item.position.y = item.halfSize?.y ?? item.position.y;

  const rooms = floorplan?.getRooms?.() ?? [];
  const room = rooms[0];
  if (room?.interiorCorners?.length
    && typeof item.isValidPosition === 'function'
    && !item.isValidPosition(item.position)) {
    const center = floorplan.getCenter?.();
    if (center) {
      item.position.x = center.x;
      item.position.z = center.z;
    }
  }

  item.position_set = true;
}

/** Room bounds for the GLTF design viewer floor plane (cm). */
export function getFloorSpecFromBlueprint(bp3d) {
  const fp = bp3d?.model?.floorplan;
  if (!fp) return null;

  const size = fp.getSize?.();
  const center = fp.getCenter?.();
  if (size && center) {
    const width = size.x ?? size.width ?? 0;
    const depth = size.z ?? size.y ?? size.depth ?? 0;
    return {
      width: width > 0 ? width : 400,
      depth: depth > 0 ? depth : 400,
      centerX: center.x ?? 0,
      centerZ: center.z ?? 0,
    };
  }

  const rooms = fp.getRooms?.() ?? [];
  const room = rooms[0];
  const corners = room?.interiorCorners ?? [];
  if (corners.length >= 3) {
    const xs = corners.map((corner) => corner.x);
    const zs = corners.map((corner) => corner.y);
    return {
      width: Math.max(...xs) - Math.min(...xs),
      depth: Math.max(...zs) - Math.min(...zs),
      centerX: (Math.max(...xs) + Math.min(...xs)) / 2,
      centerZ: (Math.max(...zs) + Math.min(...zs)) / 2,
    };
  }

  return { width: 400, depth: 400, centerX: 0, centerZ: 0 };
}

function normalizeTextureUrl(url = '') {
  if (!url) return '/rooms/textures/hardwood.png';
  return url.startsWith('/') ? url : `/${url}`;
}

/** @typedef {{ x: number, z: number }} ShellPoint */
/** @typedef {{ corners: ShellPoint[], textureUrl: string, textureScale: number, ceilingHeight: number }} ShellRoom */
/** @typedef {{ footprint: ShellPoint[], height: number }} ShellPhysicalWall */
/** @typedef {{ footprint: ShellPoint[], height: number, textureUrl: string, textureStretch: boolean, textureScale: number, sourceEdge?: object }} ShellWall */
/** @typedef {{ rooms: ShellRoom[], walls: ShellWall[], physicalWalls: ShellPhysicalWall[] }} BlueprintRoomShell */

/** Walk a room's interior half-edge ring (one edge per wall, room-facing side only). */
function collectRoomInteriorEdges(room) {
  /** @type {object[]} */
  const edges = [];
  const start = room?.edgePointer;
  if (!start) return edges;

  let edge = start;
  do {
    edges.push(edge);
    edge = edge.next;
  } while (edge && edge !== start);

  return edges;
}

/**
 * Extract floor + wall data from Blueprint3D for the GLTF room viewer.
 * @param {object | null | undefined} bp3d
 * @returns {BlueprintRoomShell | null}
 */
export function extractBlueprintRoomShell(bp3d) {
  const fp = bp3d?.model?.floorplan;
  if (!fp) return null;

  const rooms = fp.getRooms?.() ?? [];

  const toMeters = (value) => value / 100;

  /** @type {ShellRoom[]} */
  const shellRooms = rooms.map((room) => {
    const texture = room.getTexture?.() ?? {};
    return {
      sourceRoom: room,
      corners: (room.interiorCorners ?? []).map((corner) => ({
        x: toMeters(corner.x),
        z: toMeters(corner.y),
      })),
      textureUrl: normalizeTextureUrl(texture.url),
      textureScale: texture.scale ?? 400,
      textureStretch: texture.stretch ?? false,
      ceilingHeight: toMeters(room.edgePointer?.wall?.height ?? fp.getWalls?.()[0]?.height ?? 250),
    };
  }).filter((room) => room.corners.length >= 3);

  /** @type {ShellWall[]} */
  const walls = [];
  const seenEdges = new Set();

  rooms.forEach((room) => {
    collectRoomInteriorEdges(room).forEach((edge) => {
      if (seenEdges.has(edge)) return;
      seenEdges.add(edge);

      const footprint = (edge.corners?.() ?? []).map((point) => ({
        x: toMeters(point.x),
        z: toMeters(point.y),
      }));
      if (footprint.length < 4) return;

      const tex = edge.getTexture?.() ?? {};
      walls.push({
        sourceEdge: edge,
        footprint,
        height: toMeters(edge.wall?.height ?? 250),
        textureUrl: normalizeTextureUrl(tex.url),
        textureStretch: tex.stretch ?? true,
        textureScale: tex.scale ?? 0,
      });
    });
  });

  // Fallback for open/incomplete plans with no detected room loop yet.
  if (!walls.length) {
    (fp.wallEdges?.() ?? []).forEach((edge) => {
      const center = edge.interiorCenter?.();
      if (!center) return;
      const facesRoom = rooms.some((room) =>
        pointInPolygon(center.x, center.y, room.interiorCorners ?? []));
      if (rooms.length > 0 && !facesRoom) return;

      const footprint = (edge.corners?.() ?? []).map((point) => ({
        x: toMeters(point.x),
        z: toMeters(point.y),
      }));
      if (footprint.length < 4) return;

      const tex = edge.getTexture?.() ?? {};
      walls.push({
        sourceEdge: edge,
        footprint,
        height: toMeters(edge.wall?.height ?? 250),
        textureUrl: normalizeTextureUrl(tex.url),
        textureStretch: tex.stretch ?? true,
        textureScale: tex.scale ?? 0,
      });
    });
  }

  if (!shellRooms.length && !walls.length) return null;

  /** @type {ShellPhysicalWall[]} */
  const physicalWalls = [];
  const seenPhysicalWalls = new Set();

  const pushPhysicalWall = (wall, edge) => {
    if (!wall || !edge || seenPhysicalWalls.has(wall)) return;
    seenPhysicalWalls.add(wall);

    const footprint = (edge.corners?.() ?? []).map((point) => ({
      x: toMeters(point.x),
      z: toMeters(point.y),
    }));
    if (footprint.length < 4) return;

    physicalWalls.push({
      footprint,
      height: toMeters(wall.height ?? edge.height ?? 250),
      wallId: wall?.getStart?.()?.id != null && wall?.getEnd?.()?.id != null
        ? `${wall.getStart().id}${wall.getEnd().id}`
        : null,
      wallStartCm: wall ? { x: wall.getStartX?.() ?? 0, z: wall.getStartY?.() ?? 0 } : null,
      wallEndCm: wall ? { x: wall.getEndX?.() ?? 0, z: wall.getEndY?.() ?? 0 } : null,
    });
  };

  rooms.forEach((room) => {
    collectRoomInteriorEdges(room).forEach((edge) => {
      pushPhysicalWall(edge.wall, edge);
    });
  });

  if (!physicalWalls.length) {
    (fp.getWalls?.() ?? []).forEach((wall) => {
      pushPhysicalWall(wall, wall.frontEdge || wall.backEdge);
    });
  }

  return { rooms: shellRooms, walls, physicalWalls };
}

/**
 * Keep the GLTF room shell in sync with 2D floorplan edits.
 * @param {object} floorplan
 * @param {() => void} onSync
 */
export function attachBlueprintFloorplanSync(floorplan, onSync) {
  if (!floorplan) return;

  const watchCorner = (corner) => {
    if (corner.__shellWatched) return;
    corner.__shellWatched = true;
    corner.fireOnMove?.(onSync);
    corner.fireOnDelete?.(onSync);
  };
  const watchWall = (wall) => {
    if (wall.__shellWatched) return;
    wall.__shellWatched = true;
    wall.fireOnMove?.(onSync);
    wall.fireOnDelete?.(onSync);
  };

  if (!floorplan.__shellSyncAttached) {
    floorplan.__shellSyncAttached = true;
    floorplan.fireOnNewCorner?.(watchCorner);
    floorplan.fireOnNewWall?.((wall) => {
      watchWall(wall);
      onSync();
    });
    floorplan.fireOnUpdatedRooms?.(onSync);
  }

  floorplan.getCorners?.().forEach(watchCorner);
  floorplan.getWalls?.().forEach(watchWall);
}

/** Camera target/position matching Blueprint3D centerCamera (meters). */
export function getBlueprintCameraSetup(floorSpec, shell = null) {
  const roomCorners = shell?.rooms?.[0]?.corners;
  if (roomCorners?.length >= 3) {
    const xs = roomCorners.map((corner) => corner.x);
    const zs = roomCorners.map((corner) => corner.z);
    const cx = (Math.min(...xs) + Math.max(...xs)) / 2;
    const cz = (Math.min(...zs) + Math.max(...zs)) / 2;
    const spanX = Math.max(...xs) - Math.min(...xs);
    const spanZ = Math.max(...zs) - Math.min(...zs);
    const distance = Math.max(spanX, spanZ) * 1.5;
    return {
      target: [cx, 1.5, cz],
      position: [cx, 1.5 + distance, cz + distance],
    };
  }

  const cx = (floorSpec?.centerX ?? 0) / 100;
  const cz = (floorSpec?.centerZ ?? 0) / 100;
  const depth = Math.max(floorSpec?.depth ?? floorSpec?.width ?? 400, 400) / 100;
  const target = { x: cx, y: 1.5, z: cz };
  const distance = depth * 1.5;
  return {
    target: [target.x, target.y, target.z],
    position: [target.x, target.y + distance, target.z + distance],
  };
}
