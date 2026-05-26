export const CM_TO_WORLD = 0.01;

export const distance2D = (a, b) => Math.hypot(b.x - a.x, b.y - a.y);

export const midpoint = (a, b) => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });

export const snapPoint = (point, size) => ({
  x: Math.round(point.x / size) * size,
  y: Math.round(point.y / size) * size,
});

export const polygonAreaM2 = (polygon) => Math.abs(polygon.reduce((area, point, index) => {
  const next = polygon[(index + 1) % polygon.length];
  return area + point.x * next.y - next.x * point.y;
}, 0) / 2) / 10000;

export const wallTransform = (wall) => {
  const length = distance2D(wall.start, wall.end);
  return {
    length,
    center: midpoint(wall.start, wall.end),
    angle: Math.atan2(wall.end.y - wall.start.y, wall.end.x - wall.start.x),
  };
};

export const nearestWall = (point, walls) => {
  let hit = null;
  let closestDistance = Infinity;
  Object.values(walls).forEach((wall) => {
    const dx = wall.end.x - wall.start.x;
    const dy = wall.end.y - wall.start.y;
    const lengthSquared = dx * dx + dy * dy;
    const offset = Math.max(0, Math.min(1, ((point.x - wall.start.x) * dx + (point.y - wall.start.y) * dy) / lengthSquared));
    const projected = { x: wall.start.x + offset * dx, y: wall.start.y + offset * dy };
    const distance = distance2D(point, projected);
    if (distance < closestDistance) {
      hit = { wall, offsetCm: offset * Math.sqrt(lengthSquared), projected };
      closestDistance = distance;
    }
  });
  return hit ? { ...hit, distance: closestDistance } : { wall: null, distance: closestDistance };
};

export const pointInPolygon = (point, polygon) => polygon.reduce((inside, vertex, index) => {
  const previous = polygon[(index + polygon.length - 1) % polygon.length];
  const intersects = ((vertex.y > point.y) !== (previous.y > point.y))
    && point.x < ((previous.x - vertex.x) * (point.y - vertex.y)) / (previous.y - vertex.y) + vertex.x;
  return intersects ? !inside : inside;
}, false);

export const pointsEqual = (a, b, epsilon = 0.5) => distance2D(a, b) <= epsilon;

export const HANDLE_RADIUS = 14;

export const projectPointToSegment = (point, start, end) => {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const lengthSquared = dx * dx + dy * dy;
  if (!lengthSquared) return { point: { ...start }, ratio: 0, distance: distance2D(point, start) };
  const ratio = Math.max(0, Math.min(1, ((point.x - start.x) * dx + (point.y - start.y) * dy) / lengthSquared));
  const projected = { x: start.x + ratio * dx, y: start.y + ratio * dy };
  return { point: projected, ratio, distance: distance2D(point, projected) };
};

export const openingGeometry = (opening, wall) => {
  const length = distance2D(wall.start, wall.end);
  if (!length) return null;
  const tangent = { x: (wall.end.x - wall.start.x) / length, y: (wall.end.y - wall.start.y) / length };
  const normal = { x: -tangent.y, y: tangent.x };
  const center = {
    x: wall.start.x + tangent.x * opening.offsetCm,
    y: wall.start.y + tangent.y * opening.offsetCm,
  };
  const halfWidth = opening.widthCm / 2;
  return {
    tangent,
    normal,
    center,
    start: { x: center.x - tangent.x * halfWidth, y: center.y - tangent.y * halfWidth },
    end: { x: center.x + tangent.x * halfWidth, y: center.y + tangent.y * halfWidth },
  };
};

export const furnitureCenter = (item) => ({
  x: item.position.x + item.dimensionsCm.w / 2,
  y: item.position.y + item.dimensionsCm.d / 2,
});

const unrotatePoint = (point, center, rotationDeg) => {
  const angle = -(rotationDeg || 0) * Math.PI / 180;
  const dx = point.x - center.x;
  const dy = point.y - center.y;
  return {
    x: dx * Math.cos(angle) - dy * Math.sin(angle),
    y: dx * Math.sin(angle) + dy * Math.cos(angle),
  };
};

export const furnitureRotationHandle = (item, viewportZoom = 1) => {
  const center = furnitureCenter(item);
  const angle = (item.rotationY || 0) * Math.PI / 180;
  const distance = item.dimensionsCm.d / 2 + 28 / viewportZoom;
  return {
    x: center.x + Math.sin(angle) * distance,
    y: center.y - Math.cos(angle) * distance,
  };
};

export const hitTestScene = (scene, point, viewportZoom = 1) => {
  const tolerance = 12 / viewportZoom;
  const selectedFurniture = Object.values(scene.furniture).filter((item) => scene.selectedIds.includes(item.id));
  const rotation = selectedFurniture.find((item) => distance2D(point, furnitureRotationHandle(item, viewportZoom)) <= HANDLE_RADIUS / viewportZoom);
  if (rotation) return { id: rotation.id, collection: 'furniture', handle: 'rotate' };

  const opening = Object.values(scene.openings).reverse().find((item) => {
    const wall = scene.walls[item.wallId];
    const geometry = wall && openingGeometry(item, wall);
    return item.visible && geometry && projectPointToSegment(point, geometry.start, geometry.end).distance <= tolerance + wall.thicknessCm / 2;
  });
  if (opening) return { id: opening.id, collection: 'openings' };

  const furniture = Object.values(scene.furniture).reverse().find((item) => {
    if (!item.visible) return false;
    const local = unrotatePoint(point, furnitureCenter(item), item.rotationY);
    return Math.abs(local.x) <= item.dimensionsCm.w / 2 && Math.abs(local.y) <= item.dimensionsCm.d / 2;
  });
  if (furniture) return { id: furniture.id, collection: 'furniture' };

  const measurement = Object.values(scene.measurements).reverse().find((item) => (
    item.visible !== false && projectPointToSegment(point, item.start, item.end).distance <= tolerance
  ));
  if (measurement) return { id: measurement.id, collection: 'measurements' };

  const wall = Object.values(scene.walls).reverse().find((item) => (
    item.visible && projectPointToSegment(point, item.start, item.end).distance <= tolerance + item.thicknessCm / 2
  ));
  if (wall) return { id: wall.id, collection: 'walls' };

  const room = Object.values(scene.rooms).reverse().find((item) => item.visible && pointInPolygon(point, item.polygon));
  return room ? { id: room.id, collection: 'rooms' } : null;
};

export const hitTestRoomLabel = (scene, point, viewportZoom = 1) => Object.values(scene.rooms).find((room) => {
  if (!room.visible || !room.polygon?.length) return false;
  const center = room.polygon.reduce((sum, vertex) => ({
    x: sum.x + vertex.x / room.polygon.length,
    y: sum.y + vertex.y / room.polygon.length,
  }), { x: 0, y: 0 });
  return Math.abs(point.x - center.x) <= 75 / viewportZoom && Math.abs(point.y - center.y) <= 26 / viewportZoom;
});

export const snapScenePoint = (point, scene, viewportZoom = 1) => {
  const threshold = 15 / viewportZoom;
  let best = null;
  Object.values(scene.walls).forEach((wall) => {
    [
      { point: wall.start, type: 'endpoint', label: 'Endpoint' },
      { point: wall.end, type: 'endpoint', label: 'Endpoint' },
      { point: midpoint(wall.start, wall.end), type: 'midpoint', label: 'Midpoint' },
    ].forEach((candidate) => {
      const distance = distance2D(point, candidate.point);
      if (distance <= threshold && (!best || distance < best.distance)) best = { ...candidate, distance };
    });
  });
  if (best) return { point: { ...best.point }, indicator: best };
  if (!scene.settings.snapToGrid) return { point, indicator: null };
  const snapped = snapPoint(point, scene.settings.gridSizeCm || 25);
  return { point: snapped, indicator: { point: snapped, type: 'grid', label: 'Grid' } };
};

const vertexKey = (point) => `${Math.round(point.x)}:${Math.round(point.y)}`;

export const detectClosedWallLoops = (walls) => {
  const adjacency = new Map();
  Object.values(walls).forEach((wall) => {
    const start = vertexKey(wall.start);
    const end = vertexKey(wall.end);
    if (start === end) return;
    if (!adjacency.has(start)) adjacency.set(start, []);
    if (!adjacency.has(end)) adjacency.set(end, []);
    adjacency.get(start).push({ next: end, wall, point: wall.start });
    adjacency.get(end).push({ next: start, wall, point: wall.end });
  });
  const loops = [];
  const signatures = new Set();

  const search = (origin, current, pathNodes, pathWalls, polygon) => {
    (adjacency.get(current) || []).forEach((edge) => {
      if (pathWalls.includes(edge.wall.id)) return;
      if (edge.next === origin && pathWalls.length >= 2) {
        const wallLoop = [...pathWalls, edge.wall.id];
        const signature = [...wallLoop].sort().join('|');
        if (!signatures.has(signature)) {
          signatures.add(signature);
          loops.push({ wallLoop, polygon: [...polygon, edge.point], signature });
        }
        return;
      }
      if (pathNodes.includes(edge.next)) return;
      search(origin, edge.next, [...pathNodes, edge.next], [...pathWalls, edge.wall.id], [...polygon, edge.point]);
    });
  };

  adjacency.forEach((_, origin) => search(origin, origin, [origin], [], []));
  const valid = loops.filter((loop) => loop.polygon.length >= 3 && polygonAreaM2(loop.polygon) >= 0.01);
  return valid.filter((candidate) => !valid.some((other) => {
    if (other === candidate || other.wallLoop.length >= candidate.wallLoop.length) return false;
    const center = other.polygon.reduce((sum, point) => ({
      x: sum.x + point.x / other.polygon.length,
      y: sum.y + point.y / other.polygon.length,
    }), { x: 0, y: 0 });
    return pointInPolygon(center, candidate.polygon);
  }));
};
