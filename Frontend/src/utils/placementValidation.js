import { distance2D, nearestWall, pointInPolygon, wallTransform } from './spacioGeometry';
import { getRoomTypeFromRoom } from '@/data/spacioProductMeta';

export const getFurnitureBounds = (item) => ({
  left: item.position.x,
  right: item.position.x + item.dimensionsCm.w,
  top: item.position.y,
  bottom: item.position.y + item.dimensionsCm.d,
});

export const boundsOverlap = (a, b, padding = 0) => !(
  a.right + padding <= b.left
  || a.left - padding >= b.right
  || a.bottom + padding <= b.top
  || a.top - padding >= b.bottom
);

export const getOverlappingItem = (scene, item, position = item.position, excludeId = item.id) => {
  const candidate = {
    ...item,
    position: { ...item.position, ...position },
  };
  const bounds = getFurnitureBounds(candidate);
  const product = candidate.productId;
  const isFlat = ['woven-rug', 'bath-mat'].includes(product);
  return Object.values(scene.furniture).find((other) => {
    if (other.id === excludeId || !other.visible) return false;
    const otherFlat = ['woven-rug', 'bath-mat'].includes(other.productId);
    if (isFlat || otherFlat) return false;
    return boundsOverlap(bounds, getFurnitureBounds(other), 2);
  });
};

export const isInsideAnyRoom = (scene, item, position = item.position) => {
  const center = {
    x: position.x + item.dimensionsCm.w / 2,
    y: position.y + item.dimensionsCm.d / 2,
  };
  return Object.values(scene.rooms).some((room) => pointInPolygon(center, room.polygon));
};

export const collidesWithWalls = (scene, item, position = item.position) => {
  const bounds = getFurnitureBounds({ ...item, position });
  const inset = 4;
  const corners = [
    { x: bounds.left + inset, y: bounds.top + inset },
    { x: bounds.right - inset, y: bounds.top + inset },
    { x: bounds.left + inset, y: bounds.bottom - inset },
    { x: bounds.right - inset, y: bounds.bottom - inset },
  ];
  return Object.values(scene.walls).some((wall) => {
    const thickness = wall.thicknessCm / 2 + 6;
    return corners.some((corner) => {
      const hit = nearestWall(corner, { [wall.id]: wall });
      return hit.wall?.id === wall.id && hit.distance < thickness;
    });
  });
};

export const snapFurnitureToWall = (scene, item, position) => {
  const center = {
    x: position.x + item.dimensionsCm.w / 2,
    y: position.y + item.dimensionsCm.d / 2,
  };
  const hit = nearestWall(center, scene.walls);
  if (!hit.wall || hit.distance > 48) return { position, snapped: false };
  const wall = hit.wall;
  const transform = wallTransform(wall);
  const direction = {
    x: (wall.end.x - wall.start.x) / transform.length,
    y: (wall.end.y - wall.start.y) / transform.length,
  };
  const normal = { x: -direction.y, y: direction.x };
  const halfDepth = item.dimensionsCm.d / 2;
  const offset = wall.thicknessCm / 2 + halfDepth + 2;
  const snappedCenter = {
    x: hit.projected.x + normal.x * offset,
    y: hit.projected.y + normal.y * offset,
  };
  return {
    position: {
      x: snappedCenter.x - item.dimensionsCm.w / 2,
      y: snappedCenter.y - item.dimensionsCm.d / 2,
      z: position.z || 0,
    },
    snapped: true,
    wallId: wall.id,
  };
};

export const constrainOpeningOffset = (wall, opening) => {
  const length = distance2D(wall.start, wall.end);
  const half = opening.widthCm / 2;
  const min = half + 4;
  const max = length - half - 4;
  return Math.max(min, Math.min(max, opening.offsetCm));
};

export const projectOpeningOffset = (wall, point) => {
  const dx = wall.end.x - wall.start.x;
  const dy = wall.end.y - wall.start.y;
  const lengthSquared = dx * dx + dy * dy;
  if (lengthSquared < 1) return 0;
  const t = Math.max(0, Math.min(1, ((point.x - wall.start.x) * dx + (point.y - wall.start.y) * dy) / lengthSquared));
  return t * Math.sqrt(lengthSquared);
};

export const getActiveRoomType = (scene) => {
  const selectedId = scene.selectedIds[0];
  const selectedRoom = selectedId ? scene.rooms[selectedId] : null;
  if (selectedRoom) return getRoomTypeFromRoom(selectedRoom);
  const firstRoom = Object.values(scene.rooms)[0];
  return getRoomTypeFromRoom(firstRoom);
};

export const validateFurniturePlacement = (scene, item, position, { allowRoomMismatch = false } = {}) => {
  const product = item.productMeta || item;
  const pos = { ...item.position, ...position };

  if (product.requiresCeiling || product.placementType === 'ceiling') {
    return { valid: false, message: 'Pendant light must attach to ceiling.', position: item.position };
  }

  if (product.placementType === 'rug' || product.collisionShape === 'flat') {
    if (!isInsideAnyRoom(scene, item, pos) && Object.keys(scene.rooms).length) {
      return { valid: false, message: 'Rugs must sit inside a room.', position: item.position };
    }
    return { valid: true, position: pos, message: null };
  }

  if (product.placementType === 'wall' || product.wallAttachable) {
    const snap = snapFurnitureToWall(scene, item, pos);
    if (!snap.snapped) return { valid: false, message: 'Wall art must be placed on a wall.', position: item.position };
    return { valid: true, position: snap.position, message: null, snapped: true };
  }

  const overlap = getOverlappingItem(scene, item, pos);
  if (overlap) return { valid: false, message: `Overlaps ${overlap.name}.`, position: item.position };

  if (collidesWithWalls(scene, item, pos)) return { valid: false, message: 'Blocked by wall.', position: item.position };

  if (!isInsideAnyRoom(scene, item, pos) && Object.keys(scene.rooms).length) {
    return { valid: false, message: 'Place furniture inside a room.', position: item.position };
  }

  const roomType = getActiveRoomType(scene);
  if (!allowRoomMismatch && product.disallowedRoomTypes?.includes(roomType)) {
    return {
      valid: false,
      message: `${item.name || product.name} is usually placed in ${product.roomTypes?.[0]?.replace('_', ' ') || 'another room'}. Switch to All assets to place anyway.`,
      position: item.position,
      roomMismatch: true,
    };
  }

  const wallAligned = ['sideboard', 'bookshelf', 'wardrobe', 'desk', 'grid-media', 'emery-wardrobe', 'stringline-shelf', 'kitchen-island'].some((token) => (item.productId || '').includes(token) || (product.modelType || '').includes(token));
  if (wallAligned) {
    const snap = snapFurnitureToWall(scene, item, pos);
    if (snap.snapped) return { valid: true, position: snap.position, message: null, snapped: true };
  }

  return { valid: true, position: pos, message: null };
};

export const validateProductAdd = (scene, product, { allowRoomMismatch = false } = {}) => {
  const roomType = getActiveRoomType(scene);
  if (!allowRoomMismatch && product.disallowedRoomTypes?.includes(roomType)) {
    return {
      ok: false,
      message: `${product.name} is not typical for this room. Switch to All assets to add anyway.`,
    };
  }
  if (product.requiresWall) {
    return { ok: true, message: 'Select a wall before placing wall art.', warn: true };
  }
  if (product.requiresCeiling) {
    return { ok: false, message: 'Select a ceiling area before placing a pendant light.' };
  }
  return { ok: true, message: null };
};
