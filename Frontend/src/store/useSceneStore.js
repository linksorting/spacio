import { create } from 'zustand';
import { produce } from 'immer';
import { createEmptyScene, createSampleScene } from './initialScene';
import { getSpacioProduct } from '@/data/spacioCatalog';
import { loadTemplateScene } from '@/data/spacioTemplates';
import { detectClosedWallLoops, nearestWall, polygonAreaM2, pointsEqual, distance2D } from '@/utils/spacioGeometry';
import { constrainOpeningOffset, projectOpeningOffset, validateFurniturePlacement, validateProductAdd } from '@/utils/placementValidation';

const STORAGE_PREFIX = 'spacio_scene_';
const LEGACY_STORAGE_KEY = 'spacio_scene_v1';
const MAX_HISTORY = 100;
const deepClone = (value) => JSON.parse(JSON.stringify(value));
const saveable = (state) => deepClone(state.scene);
const entityId = (prefix) => `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

export const sceneStorageKey = (projectId) => `${STORAGE_PREFIX}${projectId || 'default'}`;

const persistScene = (scene, projectId = scene?.id) => {
  if (typeof window === 'undefined' || !projectId || !scene) return;
  try {
    window.localStorage.setItem(sceneStorageKey(projectId), JSON.stringify(scene));
  } catch {
    // Ignore quota errors.
  }
};

export const loadStoredScene = (projectId) => {
  if (typeof window === 'undefined') return null;
  try {
    const keyed = window.localStorage.getItem(sceneStorageKey(projectId));
    if (keyed) return JSON.parse(keyed);

    const legacy = window.localStorage.getItem(LEGACY_STORAGE_KEY);
    if (!legacy) return null;

    const parsed = JSON.parse(legacy);
    if (parsed?.id) {
      persistScene(parsed, parsed.id);
    }
    return parsed?.id === projectId ? parsed : null;
  } catch {
    return null;
  }
};

const loadInitialScene = () => {
  if (typeof window === 'undefined') return createEmptyScene();
  try {
    const legacy = window.localStorage.getItem(LEGACY_STORAGE_KEY);
    if (legacy) return JSON.parse(legacy);
  } catch {
    // Fall through to empty scene.
  }
  return createEmptyScene();
};

const commit = (set, recipe) => set((state) => {
  const previous = saveable(state);
  const scene = produce(state.scene, (draft) => {
    recipe(draft);
    draft.updatedAt = new Date().toISOString();
  });
  persistScene(scene, scene.id);
  return { scene, past: [...state.past.slice(-(MAX_HISTORY - 1)), previous], future: [], saveStatus: 'Saved locally' };
});

const syncRoomWalls = (scene, room) => {
  if (!room?.wallLoop?.length || !room?.polygon?.length) return;
  room.wallLoop.forEach((wallId, index) => {
    const wall = scene.walls[wallId];
    if (!wall) return;
    wall.start = { ...room.polygon[index] };
    wall.end = { ...room.polygon[(index + 1) % room.polygon.length] };
  });
  room.areaM2 = polygonAreaM2(room.polygon);
};

const replaceSharedPoint = (scene, oldPoint, newPoint) => {
  Object.values(scene.walls).forEach((wall) => {
    if (pointsEqual(wall.start, oldPoint)) wall.start = { ...newPoint };
    if (pointsEqual(wall.end, oldPoint)) wall.end = { ...newPoint };
  });
  Object.values(scene.rooms).forEach((room) => {
    let changed = false;
    room.polygon = room.polygon.map((point) => {
      if (!pointsEqual(point, oldPoint)) return point;
      changed = true;
      return { ...newPoint };
    });
    if (changed) syncRoomWalls(scene, room);
    else room.areaM2 = polygonAreaM2(room.polygon);
  });
};

const translateSharedPoint = (scene, point, delta) => {
  replaceSharedPoint(scene, point, { x: point.x + delta.x, y: point.y + delta.y });
};

const roomLoopSignature = (room) => [...(room.wallLoop || [])].sort().join('|');

const syncDetectedRooms = (scene) => {
  const loops = detectClosedWallLoops(scene.walls);
  const manualLoops = new Set(Object.values(scene.rooms).filter((room) => !room.autoDetected).map(roomLoopSignature));
  const detectedLoops = new Set(loops.map((loop) => loop.signature));
  let created = 0;

  Object.values(scene.rooms).filter((room) => room.autoDetected && !detectedLoops.has(roomLoopSignature(room))).forEach((room) => {
    delete scene.rooms[room.id];
  });
  loops.forEach((loop) => {
    if (manualLoops.has(loop.signature)) return;
    const id = `detected_${loop.signature.replaceAll('|', '_')}`;
    const existing = scene.rooms[id];
    scene.rooms[id] = {
      id,
      name: existing?.name || `Room ${Object.keys(scene.rooms).length + 1}`,
      roomType: existing?.roomType || 'generic',
      style: existing?.style || 'Modern',
      wallLoop: loop.wallLoop,
      polygon: loop.polygon,
      floorMaterialId: existing?.floorMaterialId || 'oak',
      wallMaterialId: existing?.wallMaterialId || 'plaster',
      ceilingMaterialId: existing?.ceilingMaterialId || 'plaster',
      heightCm: scene.settings.ceilingHeightCm,
      areaM2: polygonAreaM2(loop.polygon),
      visible: existing?.visible ?? true,
      locked: existing?.locked ?? false,
      autoDetected: true,
    };
    if (!existing) created += 1;
  });
  return created;
};

export const useSceneStore = create((set, get) => ({
  scene: loadInitialScene(),
  past: [],
  future: [],
  saveStatus: 'Saved locally',
  viewport: { zoom: 0.92, pan: { x: 90, y: 82 } },
  transient: { wallStart: null, measureStart: null, cursorPoint: null, snapIndicator: null },
  assetFilters: { room: 'auto', category: 'All', style: 'All', placement: 'All', showAllOverride: false },
  setAssetFilters: (patch) => set((state) => ({ assetFilters: { ...state.assetFilters, ...patch } })),
  setActiveView: (activeView) => set((state) => ({ scene: { ...state.scene, activeView } })),
  setView: (activeView) => get().setActiveView(activeView),
  setActiveTool: (activeTool) => set((state) => {
    const floorplanTools = ['drawWall', 'addRoom', 'addDoor', 'addWindow', 'measure'];
    const activeView = floorplanTools.includes(activeTool) && state.scene.activeView !== 'floorplan'
      ? 'floorplan'
      : state.scene.activeView;
    return {
      scene: { ...state.scene, activeTool, activeView },
      transient: { wallStart: null, measureStart: null, cursorPoint: null, snapIndicator: null },
    };
  }),
  setTool: (activeTool) => get().setActiveTool(activeTool),
  selectObject: (id, additive = false) => set((state) => ({
    scene: {
      ...state.scene,
      selectedIds: additive && id
        ? (state.scene.selectedIds.includes(id) ? state.scene.selectedIds.filter((selectedId) => selectedId !== id) : [...state.scene.selectedIds, id])
        : id ? [id] : [],
    },
  })),
  select: (id, additive = false) => get().selectObject(id, additive),
  clearSelection: () => set((state) => ({ scene: { ...state.scene, selectedIds: [] } })),
  updateSettings: (patch) => commit(set, (scene) => { Object.assign(scene.settings, patch); }),
  addWall: (wall) => {
    const id = wall.id || entityId('wall');
    commit(set, (scene) => {
      scene.walls[id] = {
        id, name: `Wall ${Object.keys(scene.walls).length + 1}`, thicknessCm: scene.settings.wallThicknessCm,
        heightCm: scene.settings.ceilingHeightCm, materialId: 'plaster', visible: true, locked: false, ...wall, id,
      };
    });
    return id;
  },
  updateWall: (id, patch) => commit(set, (scene) => { if (scene.walls[id]) Object.assign(scene.walls[id], patch); }),
  deleteWall: (id) => commit(set, (scene) => {
    if (scene.walls[id]?.locked) return;
    delete scene.walls[id];
    Object.values(scene.openings).filter((opening) => opening.wallId === id).forEach((opening) => { delete scene.openings[opening.id]; });
    Object.values(scene.rooms).filter((room) => room.wallLoop?.includes(id)).forEach((room) => { delete scene.rooms[room.id]; });
    syncDetectedRooms(scene);
    scene.selectedIds = scene.selectedIds.filter((selectedId) => selectedId !== id);
  }),
  addOpening: (opening) => {
    const id = opening.id || entityId(opening.type || 'opening');
    commit(set, (scene) => {
      scene.openings[id] = { visible: true, locked: false, sillHeightCm: 0, swingDirection: 'left', ...opening, id };
    });
    return id;
  },
  updateOpening: (id, patch) => commit(set, (scene) => { if (scene.openings[id]) Object.assign(scene.openings[id], patch); }),
  deleteOpening: (id) => commit(set, (scene) => {
    delete scene.openings[id];
    scene.selectedIds = scene.selectedIds.filter((selectedId) => selectedId !== id);
  }),
  setViewport: (patch) => set((state) => ({ viewport: { ...state.viewport, ...patch } })),
  setTransientPreview: (cursorPoint, snapIndicator = null) => set((state) => ({ transient: { ...state.transient, cursorPoint, snapIndicator } })),
  beginWall: (point) => set((state) => ({ transient: { ...state.transient, wallStart: point, cursorPoint: point } })),
  finishWall: (point) => {
    const start = get().transient.wallStart;
    if (!start || distance2D(start, point) < 1) return { id: null, roomsDetected: 0 };
    const id = `wall_${Date.now()}`;
    let roomsDetected = 0;
    commit(set, (scene) => {
      scene.walls[id] = { id, name: `Wall ${Object.keys(scene.walls).length + 1}`, start, end: point, thicknessCm: scene.settings.wallThicknessCm, heightCm: scene.settings.ceilingHeightCm, materialId: 'plaster', visible: true, locked: false };
      scene.selectedIds = [id];
      roomsDetected = syncDetectedRooms(scene);
    });
    set((state) => ({ transient: { ...state.transient, wallStart: point, cursorPoint: point } }));
    return { id, roomsDetected };
  },
  addRectangleRoom: (start, end) => {
    const minX = Math.min(start.x, end.x);
    const minY = Math.min(start.y, end.y);
    const maxX = Math.max(start.x, end.x);
    const maxY = Math.max(start.y, end.y);
    if (maxX - minX < 100 || maxY - minY < 100) return false;
    commit(set, (scene) => {
      const stamp = Date.now();
      const points = [{ x: minX, y: minY }, { x: maxX, y: minY }, { x: maxX, y: maxY }, { x: minX, y: maxY }];
      const wallIds = points.map((point, index) => {
        const id = `roomwall_${stamp}_${index}`;
        scene.walls[id] = { id, name: `Room Wall ${index + 1}`, start: point, end: points[(index + 1) % points.length], thicknessCm: scene.settings.wallThicknessCm, heightCm: scene.settings.ceilingHeightCm, materialId: 'plaster', visible: true, locked: false };
        return id;
      });
      const id = `room_${stamp}`;
      scene.rooms[id] = { id, name: `Room ${Object.keys(scene.rooms).length + 1}`, roomType: 'generic', style: 'Modern', wallLoop: wallIds, polygon: points, floorMaterialId: 'oak', wallMaterialId: 'plaster', ceilingMaterialId: 'plaster', heightCm: scene.settings.ceilingHeightCm, areaM2: polygonAreaM2(points), visible: true, locked: false };
      scene.selectedIds = [id];
    });
    return true;
  },
  endWallChain: () => set((state) => ({ transient: { ...state.transient, wallStart: null, cursorPoint: null, snapIndicator: null } })),
  addOpeningAt: (type, point) => {
    const closest = nearestWall(point, get().scene.walls);
    if (!closest.wall || closest.distance > 32) return null;
    const id = `${type}_${Date.now()}`;
    commit(set, (scene) => {
      const opening = { id, wallId: closest.wall.id, type, offsetCm: closest.offsetCm, widthCm: type === 'door' ? 92 : 140, heightCm: type === 'door' ? 210 : 125, sillHeightCm: type === 'door' ? 0 : 84, swingDirection: 'left', visible: true, locked: false };
      opening.offsetCm = constrainOpeningOffset(closest.wall, opening);
      scene.openings[id] = opening;
      scene.selectedIds = [id];
    });
    return id;
  },
  addFurniture: (productOrInstance, { allowRoomMismatch = false } = {}) => {
    const product = typeof productOrInstance === 'string' ? getSpacioProduct(productOrInstance) : getSpacioProduct(productOrInstance.productId);
    if (!product && typeof productOrInstance === 'string') return { ok: false, message: 'Product not found.' };
    if (typeof productOrInstance !== 'string') {
      const id = productOrInstance.id || entityId('furniture');
      commit(set, (scene) => { scene.furniture[id] = { visible: true, locked: false, castShadow: true, receiveShadow: true, materialOverrides: {}, ...productOrInstance, id }; });
      return { ok: true, id };
    }
    const check = validateProductAdd(get().scene, product, { allowRoomMismatch: allowRoomMismatch || get().assetFilters.showAllOverride });
    if (!check.ok) return check;
    const id = `${product.id}_${Date.now()}`;
    commit(set, (scene) => {
      const offset = Object.keys(scene.furniture).length * 18;
      const item = {
        id, productId, name: product.name, brand: product.brand, category: product.category,
        position: { x: 285 + offset, y: 205 + offset, z: 0 }, rotationY: product.defaultRotation || 0,
        scale: { x: 1, y: 1, z: 1 }, dimensionsCm: product.dimensionsCm, materialOverrides: {},
        visible: true, locked: false, castShadow: true, receiveShadow: true,
      };
      const placement = validateFurniturePlacement(scene, { ...item, productMeta: product }, item.position, { allowRoomMismatch: allowRoomMismatch || get().assetFilters.showAllOverride });
      if (placement.valid) item.position = placement.position;
      scene.furniture[id] = item;
      scene.selectedIds = [id];
    });
    return { ok: true, id, message: check.warn ? check.message : null };
  },
  updateFurniture: (id, patch) => commit(set, (scene) => { if (scene.furniture[id]) Object.assign(scene.furniture[id], patch); }),
  deleteFurniture: (id) => commit(set, (scene) => {
    delete scene.furniture[id];
    scene.selectedIds = scene.selectedIds.filter((selectedId) => selectedId !== id);
  }),
  addLight: (light) => {
    const id = light.id || entityId('light');
    commit(set, (scene) => {
      scene.lights[id] = { enabled: true, visible: true, locked: false, castShadow: false, ...light, id };
    });
    return id;
  },
  updateLight: (id, patch) => commit(set, (scene) => { if (scene.lights[id]) Object.assign(scene.lights[id], patch); }),
  deleteLight: (id) => commit(set, (scene) => {
    delete scene.lights[id];
    scene.selectedIds = scene.selectedIds.filter((selectedId) => selectedId !== id);
  }),
  commitFurniturePosition: (id, position, { allowRoomMismatch = false } = {}) => {
    const scene = get().scene;
    const item = scene.furniture[id];
    const product = getSpacioProduct(item?.productId);
    if (!item || !product) return { ok: false, message: 'Object not found.' };
    const result = validateFurniturePlacement(scene, { ...item, productMeta: product }, position, { allowRoomMismatch: allowRoomMismatch || get().assetFilters.showAllOverride });
    if (!result.valid) return { ok: false, message: result.message, position: item.position };
    commit(set, (draft) => {
      draft.furniture[id].position = result.position;
    });
    return { ok: true, message: result.snapped ? 'Snapped to wall.' : null, position: result.position };
  },
  updateOpeningOffset: (openingId, point, { recordHistory = false } = {}) => {
    const opening = get().scene.openings[openingId];
    const wall = opening ? get().scene.walls[opening.wallId] : null;
    if (!opening || !wall || opening.locked) return null;
    const offsetCm = constrainOpeningOffset(wall, { ...opening, offsetCm: projectOpeningOffset(wall, point) });
    const apply = (scene) => { scene.openings[openingId].offsetCm = offsetCm; };
    if (recordHistory) commit(set, apply);
    else get().mutateScene(apply);
    return offsetCm;
  },
  addMeasurement: (point) => {
    const start = get().transient.measureStart;
    if (!start) {
      set((state) => ({ transient: { ...state.transient, measureStart: point } }));
      return false;
    }
    const id = `measurement_${Date.now()}`;
    commit(set, (scene) => {
      scene.measurements[id] = { id, name: `Measurement ${Object.keys(scene.measurements).length + 1}`, start, end: point, label: '', mode: '2d', visible: true, locked: false };
      scene.selectedIds = [id];
    });
    set((state) => ({ transient: { ...state.transient, measureStart: null, cursorPoint: null, snapIndicator: null } }));
    return true;
  },
  cancelMeasurement: () => set((state) => ({ transient: { ...state.transient, measureStart: null, cursorPoint: null, snapIndicator: null } })),
  mutateScene: (recipe) => set((state) => {
    const scene = produce(state.scene, (draft) => {
      recipe(draft);
      draft.updatedAt = new Date().toISOString();
    });
    persistScene(scene, scene.id);
    return { scene, saveStatus: 'Saved locally' };
  }),
  beginEdit: () => set((state) => ({
    past: [...state.past.slice(-(MAX_HISTORY - 1)), saveable(state)],
    future: [],
  })),
  updateEntity: (collection, id, patch) => commit(set, (scene) => { Object.assign(scene[collection][id], patch); }),
  updateWallEndpoint: (wallId, endpoint, point, { recordHistory = true } = {}) => {
    const wall = get().scene.walls[wallId];
    if (!wall || wall.locked) return;
    const oldPoint = endpoint === 'start' ? wall.start : wall.end;
    const apply = (scene) => replaceSharedPoint(scene, oldPoint, point);
    if (recordHistory) commit(set, apply);
    else get().mutateScene(apply);
  },
  moveWall: (wallId, delta, { recordHistory = true } = {}) => {
    const wall = get().scene.walls[wallId];
    if (!wall || wall.locked) return;
    const apply = (scene) => {
      translateSharedPoint(scene, wall.start, delta);
      translateSharedPoint(scene, wall.end, delta);
    };
    if (recordHistory) commit(set, apply);
    else get().mutateScene(apply);
  },
  setWallLength: (wallId, lengthCm) => {
    const wall = get().scene.walls[wallId];
    if (!wall || wall.locked) return;
    const current = distance2D(wall.start, wall.end);
    if (current < 1 || lengthCm < 20) return;
    const scale = lengthCm / current;
    const newEnd = {
      x: wall.start.x + (wall.end.x - wall.start.x) * scale,
      y: wall.start.y + (wall.end.y - wall.start.y) * scale,
    };
    commit(set, (scene) => replaceSharedPoint(scene, wall.end, newEnd));
  },
  resizeRoomCorner: (roomId, cornerIndex, point, { recordHistory = true } = {}) => {
    const room = get().scene.rooms[roomId];
    if (!room || room.locked || !room.polygon[cornerIndex]) return;
    const apply = (scene) => {
      const target = scene.rooms[roomId];
      target.polygon[cornerIndex] = { ...point };
      syncRoomWalls(scene, target);
    };
    if (recordHistory) commit(set, apply);
    else get().mutateScene(apply);
  },
  moveRoom: (roomId, delta, { recordHistory = true } = {}) => {
    const room = get().scene.rooms[roomId];
    if (!room || room.locked) return;
    const apply = (scene) => {
      const target = scene.rooms[roomId];
      target.polygon = target.polygon.map((point) => ({ x: point.x + delta.x, y: point.y + delta.y }));
      syncRoomWalls(scene, target);
    };
    if (recordHistory) commit(set, apply);
    else get().mutateScene(apply);
  },
  updateFurnitureTransform: (id, patch) => commit(set, (scene) => { Object.assign(scene.furniture[id], patch); }),
  moveFurniture2D: (id, position, { recordHistory = false } = {}) => {
    const item = get().scene.furniture[id];
    if (!item || item.locked) return;
    const apply = (scene) => { scene.furniture[id].position = { ...scene.furniture[id].position, ...position }; };
    if (recordHistory) commit(set, apply);
    else get().mutateScene(apply);
  },
  rotateFurniture2D: (id, rotationY, { recordHistory = false } = {}) => {
    const item = get().scene.furniture[id];
    if (!item || item.locked) return;
    const apply = (scene) => { scene.furniture[id].rotationY = rotationY; };
    if (recordHistory) commit(set, apply);
    else get().mutateScene(apply);
  },
  addMoodboardElement: (element) => commit(set, (scene) => { scene.moodboards.primary.elements.push(element); }),
  updateMoodboardElement: (id, patch) => commit(set, (scene) => {
    const element = scene.moodboards.primary.elements.find((item) => item.id === id);
    if (element) Object.assign(element, patch);
  }),
  removeMoodboardElement: (id) => commit(set, (scene) => {
    scene.moodboards.primary.elements = scene.moodboards.primary.elements.filter((element) => element.id !== id);
  }),
  toggleEntityFlag: (collection, id, flag) => commit(set, (scene) => { scene[collection][id][flag] = !scene[collection][id][flag]; }),
  removeSelected: () => commit(set, (scene) => {
    scene.selectedIds.forEach((id) => {
      ['walls', 'openings', 'rooms', 'furniture', 'lights', 'measurements'].forEach((collection) => {
        if (!scene[collection][id]?.locked) delete scene[collection][id];
      });
    });
    Object.values(scene.openings).filter((opening) => !scene.walls[opening.wallId]).forEach((opening) => { delete scene.openings[opening.id]; });
    Object.values(scene.rooms).filter((room) => room.wallLoop?.some((wallId) => !scene.walls[wallId])).forEach((room) => { delete scene.rooms[room.id]; });
    syncDetectedRooms(scene);
    scene.selectedIds = [];
  }),
  detectBoundingRoom: () => commit(set, (scene) => { syncDetectedRooms(scene); }),
  applyTemplate: (id) => set((state) => {
    const scene = loadTemplateScene(id);
    persistScene(scene, scene.id);
    return { scene, past: [...state.past.slice(-(MAX_HISTORY - 1)), saveable(state)], future: [], saveStatus: 'Saved locally' };
  }),
  replaceScene: (scene, { persist = true } = {}) => set((state) => {
    if (persist) persistScene(scene, scene.id);
    return { scene, past: [...state.past.slice(-(MAX_HISTORY - 1)), saveable(state)], future: [], saveStatus: 'Saved locally' };
  }),
  loadScene: (scene) => get().replaceScene(deepClone(scene)),
  resetToSampleScene: () => {
    const scene = createSampleScene();
    persistScene(scene, scene.id);
    set((state) => ({ scene, past: [...state.past.slice(-(MAX_HISTORY - 1)), saveable(state)], future: [], saveStatus: 'Saved locally' }));
  },
  undo: () => set((state) => {
    if (!state.past.length) return state;
    const scene = { ...state.past[state.past.length - 1], activeView: state.scene.activeView, activeTool: state.scene.activeTool };
    persistScene(scene, scene.id);
    return {
      scene,
      past: state.past.slice(0, -1),
      future: [saveable(state), ...state.future].slice(0, MAX_HISTORY),
      saveStatus: 'Saved locally',
    };
  }),
  redo: () => set((state) => {
    if (!state.future.length) return state;
    const scene = { ...state.future[0], activeView: state.scene.activeView, activeTool: state.scene.activeTool };
    persistScene(scene, scene.id);
    return {
      scene,
      past: [...state.past, saveable(state)].slice(-MAX_HISTORY),
      future: state.future.slice(1),
      saveStatus: 'Saved locally',
    };
  }),
  save: (projectId = get().scene.id) => {
    persistScene(get().scene, projectId);
    set({ saveStatus: 'Saved locally' });
  },
}));
