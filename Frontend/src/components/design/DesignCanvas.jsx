import React, { lazy, Suspense, useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { ArrowLeft, Copy, FolderOpen, Save, Trash2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import NavRail from '@/components/NavRail';
import CatalogPanel from '@/components/CatalogPanel';
import InspirationPanel from '@/components/InspirationPanel';
import LibraryPanel from '@/components/LibraryPanel';
import CanvasToolbar from '@/components/CanvasToolbar';
import { floorTextures, wallTextures, ceilingTextures, loadBlueprintCatalog } from '@/lib/blueprintCatalog';
import { OPENING_TYPES } from '@/lib/wallOpenings';
import {
  CATALOG_CATEGORIES,
  buildCatalogFlat,
  buildLegacyCatalogCategories,
  findInspirationRoom,
} from '@/lib/catalogData';
import { createModelLoadId, attachBlueprintFloorplanSync, extractBlueprintRoomShell, getCatalogPlacementPosition, getFloorSpecFromBlueprint, normalizeItemType, settleItemOnFloor } from '@/lib/blueprintHelpers';
import { applyOpeningsToRoomShell, attachOpeningsToWalls, createWallOpening, getWallHitFromWorldPoint } from '@/lib/wallOpenings';
import { drawWallOpenings } from '@/lib/wallOpeningDraw';
import { isBlockedModelUrl, isSupportedModelUrl, sanitizeGltfPlacedItems } from '@/lib/modelFormats';
import { loadBlueprintPreset, loadBlueprintPresetData } from '@/lib/loadBlueprintPreset';
import { buildRectangularFloorplan, syncBlueprintViewsAfterLoad } from '@/lib/blueprintRoomLayout';
import { ROOM_LAYOUT_PRESETS, INSPIRATION_LAYOUT_MAP } from '@/data/roomLayoutPresets';
import { snapGltfItemToNearestWall } from '@/lib/placementHelpers';
import { buildDynamicCatalog } from '@/lib/dynamicCatalog';
import { loadManifest } from '@/lib/thumbnails';
import { USE_LEGACY_JS_RENDERER } from '@/lib/rendererConfig';
import { resolveCatalogModelUrl } from '@/lib/resolveCatalogModelUrl';
import {
  configureModernCanvasEngine,
  createModernCanvasEngine,
  MODERN_FLOORPLANNER_MODES,
} from '@/lib/modernCanvasEngine';
import { clientToFloorplanCoords, createRectangularRoom, snapWorldPointMeters } from '@/lib/floorplanDraw';
import {
  drawFloorPlanSymbol,
  preloadFloorPlanSymbols,
  setFloorPlanSymbolRedrawCallback,
} from '@/lib/floorPlanSymbolCanvas';
import { BLANK_ROOM, getStarterRoom, isEmptyBlueprintDesign, storageKeyForProject } from '@/lib/blueprintStarterRoom';
import {
  loadStoredBackgroundPlan,
  PROJECT_START_MODES,
  readPendingBackgroundPlan,
  saveBackgroundPlan,
} from '@/lib/projectStart';
import {
  formatRelativeUpdatedAt,
  migrateProjectsFromStorage,
  upsertProject,
} from '@/lib/projectRegistry';
import { setActiveProjectName } from '@/lib/project-session';
import ErrorBoundary from '@/components/ErrorBoundary';
import { preloadModel } from './LoadedModel';
import styles from './DesignCanvas.module.css';

const ImportedSceneViewer = lazy(() => import('./ImportedSceneViewer'));
const GltfDesignViewer = lazy(() => import('./GltfDesignViewer'));

const notify = (message) => toast({ title: message, duration: 3000 });
const notifyTip = (title, description) => toast({ title, description, duration: 5500 });

const show3dControlsTipOnce = () => {
  try {
    if (sessionStorage.getItem('dp-3d-controls-tip')) return;
    sessionStorage.setItem('dp-3d-controls-tip', '1');
  } catch {
    return;
  }
  notifyTip(
    'How to use 3D view',
    'Drag furniture to move it. Drag empty space to rotate. Scroll to zoom.',
  );
};

const GRID_SNAP_CM = 10;
const ROTATION_SNAP_RAD = (15 * Math.PI) / 180;
const CATALOG_DRAG_TYPE = 'application/x-designer-catalog-item';

const getWallMountedPlacement = (edge, item) => {
  const start = edge?.interiorStart?.();
  const end = edge?.interiorEnd?.();
  if (!start || !end) return null;
  return {
    x: (start.x + end.x) / 2,
    z: (start.y + end.y) / 2,
    y: (item.mountHeightCm ?? 0) / 100,
    rotationY: Math.atan2(end.y - start.y, end.x - start.x),
    wallSegment: {
      start: { x: start.x / 100, z: start.y / 100 },
      end: { x: end.x / 100, z: end.y / 100 },
    },
  };
};

const constrainToWallSegment = (entry, x, z) => {
  const segment = entry.wallSegment;
  if (!segment) return { x, z };
  const dx = segment.end.x - segment.start.x;
  const dz = segment.end.z - segment.start.z;
  const lengthSquared = (dx * dx) + (dz * dz);
  if (!lengthSquared) return { ...segment.start };
  const t = Math.min(1, Math.max(0, (((x - segment.start.x) * dx) + ((z - segment.start.z) * dz)) / lengthSquared));
  return { x: segment.start.x + (dx * t), z: segment.start.z + (dz * t) };
};

const getCatalogOpeningConfig = (item) => {
  if (item?.placementMode !== 'wall') return null;
  const isWindow = String(item.name ?? '').toLowerCase().includes('window');
  return {
    type: isWindow ? 'window' : 'door',
    widthCm: item.widthCm ?? (isWindow ? 120 : 90),
    heightCm: item.heightCm ?? (isWindow ? 120 : 210),
    elevCm: isWindow ? (item.mountHeightCm ?? 90) : 0,
    label: item.name ?? (isWindow ? 'Window' : 'Door'),
  };
};
const IMPORTED_GLTF_PREVIEWS = {
  '/models/imported-products/sofa-01/sofa-01.js': '/models/imported-products/sofa-01/Sofa_01_1k.gltf',
  '/models/imported-products/sofa-02/sofa-02.js': '/models/imported-products/sofa-02/sofa_02_1k.gltf',
  '/models/imported-products/sofa-03/sofa-03.js': '/models/imported-products/sofa-03/sofa_03_1k.gltf',
  '/models/imported-products/modern-arm-chair-01/modern-arm-chair-01.js': '/models/imported-products/modern-arm-chair-01/modern_arm_chair_01_1k.gltf',
  '/models/imported-products/coffee-table-round-01/coffee-table-round-01.js': '/models/imported-products/coffee-table-round-01/coffee_table_round_01_1k.gltf',
  '/models/imported-products/round-wooden-table-01/round-wooden-table-01.js': '/models/imported-products/round-wooden-table-01/round_wooden_table_01_1k.gltf',
  '/models/imported-products/gothic-bed-01/gothic-bed-01.js': '/models/imported-products/gothic-bed-01/GothicBed_01_1k.gltf',
  '/models/imported-products/chinese-cabinet/chinese-cabinet.js': '/models/imported-products/chinese-cabinet/chinese_cabinet_1k.gltf',
};

const getTemplatePreviewModelUrl = (modelUrl = '', previewModelUrl = '') => {
  if (previewModelUrl && isSupportedModelUrl(previewModelUrl)) return previewModelUrl;
  const cleanModelUrl = modelUrl.split('?')[0];
  if (IMPORTED_GLTF_PREVIEWS[cleanModelUrl]) return IMPORTED_GLTF_PREVIEWS[cleanModelUrl];
  if (isSupportedModelUrl(cleanModelUrl)) return cleanModelUrl;
  return null;
};

const applySnapConfiguration = () => {
  configureModernCanvasEngine({ wallHeightCm: 270 });
};

const normalizeLookupKey = (value = '') => String(value)
  .toLowerCase()
  .replace(/^obj[-_]/, '')
  .replace(/^imported[-_]/, '')
  .replace(/[^a-z0-9]+/g, '');

const catalogLookup = (() => {
  const items = CATALOG_CATEGORIES.flatMap((category) => category.items);
  return {
    byThumbnail: new Map(items.map((item) => [item.thumbnail, item])),
    byId: new Map(items.map((item) => [normalizeLookupKey(item.id), item])),
    byName: new Map(items.map((item) => [normalizeLookupKey(item.name), item])),
  };
})();

const generatedRoomSize = (roomType) => {
  switch (roomType) {
    case 'Kitchen':
      return { width: 420, depth: 360 };
    case 'Bathroom':
      return { width: 280, depth: 240 };
    case 'Bedroom':
      return { width: 380, depth: 360 };
    case 'Dining':
      return { width: 400, depth: 340 };
    case 'Multi-Room':
      return { width: 560, depth: 460 };
    case 'Living Room':
    default:
      return { width: 440, depth: 380 };
  }
};

const generatedSlot = (roomType, product, index, room) => {
  const name = `${product.name ?? ''} ${product.type ?? ''}`.toLowerCase();
  const margin = 70;
  const centerX = room.width / 2;
  const centerZ = room.depth / 2;

  if (roomType === 'Kitchen') {
    if (name.includes('island')) return { x: centerX, z: centerZ + 60, rot: 0 };
    if (name.includes('fridge') || name.includes('tall') || name.includes('pantry')) return { x: margin, z: margin + 18, rot: 0 };
    if (name.includes('stove') || name.includes('cooktop') || name.includes('hood')) return { x: centerX, z: margin, rot: 0 };
    if (name.includes('faucet') || name.includes('sink')) return { x: room.width - margin, z: margin + 30, rot: 0 };
    return { x: margin + (index % 5) * 105, z: margin + Math.floor(index / 5) * 95, rot: 0 };
  }

  if (roomType === 'Bathroom') {
    if (name.includes('tub') || name.includes('bath')) return { x: margin + 60, z: room.depth - margin, rot: Math.PI / 2 };
    if (name.includes('shower')) return { x: room.width - margin, z: room.depth - margin, rot: 0 };
    if (name.includes('toilet')) return { x: room.width - margin, z: margin + 24, rot: Math.PI };
    if (name.includes('vanity') || name.includes('sink') || name.includes('faucet')) return { x: margin + 55, z: margin, rot: 0 };
    return { x: margin + (index % 3) * 90, z: margin + Math.floor(index / 3) * 78, rot: 0 };
  }

  if (roomType === 'Bedroom') {
    if (name.includes('bed')) return { x: centerX, z: room.depth - 95, rot: Math.PI };
    if (name.includes('wardrobe') || name.includes('cabinet')) return { x: margin, z: centerZ, rot: Math.PI / 2 };
  }

  if (name.includes('door')) return { x: centerX, z: room.depth - 20, rot: 0 };
  if (name.includes('window')) return { x: centerX, z: 18, rot: 0 };
  if (name.includes('sofa') || name.includes('sectional')) return { x: centerX, z: room.depth - 110, rot: Math.PI };
  if (name.includes('table')) return { x: centerX, z: centerZ, rot: 0 };
  if (name.includes('lamp') || name.includes('pendant') || name.includes('light')) return { x: room.width - margin, z: margin + (index % 4) * 60, rot: 0 };

  const cols = roomType === 'Multi-Room' ? 5 : 4;
  return {
    x: margin + (index % cols) * 115,
    z: margin + Math.floor(index / cols) * 95,
    rot: 0,
  };
};

// ── Wall colours per room type + style ──────────────────────────────────────
const DARK_STYLES = new Set(['Moody', 'Maximalist', 'Luxe', 'Industrial', 'Boutique Hotel', 'Dramatic', 'Luxury']);

const ROOM_WALL_COLOR = {
  'Living Room': { Contemporary: '#f5efe6', Japandi: '#ede5d8', Coastal: '#e8f0eb', Classic: '#f0e8d8', default: '#f0e8df' },
  'Kitchen':     { Contemporary: '#f0ebe3', 'Warm Contemporary': '#f2e5d0', Scandinavian: '#f5f2ee', Mediterranean: '#f0dfc8', Japandi: '#ede8e0', default: '#f0ebe3' },
  'Bedroom':     { Japandi: '#ede8e0', Nordic: '#f5f5f0', Classic: '#e8e0d0', Modern: '#e8e3dc', Bohemian: '#e8d8c8', default: '#ede8e2' },
  'Bathroom':    { 'Spa Luxury': '#e8ece8', Classic: '#f0ece4', 'Earthy Warm': '#e8d8c0', Japandi: '#e0e4e0', Coastal: '#e8f0ee', default: '#f0ece8' },
  'Dining':      { Formal: '#f5efe6', Farmhouse: '#f2ece0', Scandinavian: '#f5f2ee', Classic: '#f0e8d8', default: '#f0ebe3' },
  'Multi-Room':  { Contemporary: '#f0ebe3', Scandinavian: '#f5f2ee', Coastal: '#e8f0eb', Classic: '#f0e8d8', default: '#f0ebe3' },
};

const ROOM_FLOOR_TEXTURE = {
  'Bathroom': '/rooms/textures/bath.jpg',
  default:    '/rooms/textures/light_fine_wood.jpg',
};

const getWallColor = (roomType, style) => {
  if (DARK_STYLES.has(style)) return '#1e1c1a';
  const map = ROOM_WALL_COLOR[roomType] ?? {};
  return map[style] ?? map.default ?? '#f0e8df';
};

// ── Door + window openings for every generated inspiration room ──────────────
const ROOM_OPENINGS = {
  'Bathroom': [
    { wallIndex: 0, offsetAlongWall: 0.6,  type: 'door',   widthCm: 80,  heightCm: 200, elevationCm: 0 },
    { wallIndex: 2, offsetAlongWall: 0.5,  type: 'window', widthCm: 80,  heightCm: 80,  elevationCm: 120 },
  ],
  default: [
    { wallIndex: 0, offsetAlongWall: 0.5,  type: 'door',   widthCm: 90,  heightCm: 210, elevationCm: 0 },
    { wallIndex: 2, offsetAlongWall: 0.35, type: 'window', widthCm: 130, heightCm: 110, elevationCm: 90 },
    { wallIndex: 2, offsetAlongWall: 0.7,  type: 'window', widthCm: 100, heightCm: 110, elevationCm: 90 },
    { wallIndex: 1, offsetAlongWall: 0.5,  type: 'window', widthCm: 90,  heightCm: 100, elevationCm: 100 },
  ],
};

const createGeneratedInspirationPreset = (room) => {
  const layoutKey = INSPIRATION_LAYOUT_MAP[room.id];
  const layoutPreset = layoutKey ? ROOM_LAYOUT_PRESETS[layoutKey] : null;
  const size = layoutPreset
    ? { width: layoutPreset.w, depth: layoutPreset.d }
    : generatedRoomSize(room.roomType);

  const matchedProducts = (room.products ?? []).flatMap((product, index) => {
    const catalogItem = catalogLookup.byThumbnail.get(product.img)
      ?? catalogLookup.byId.get(normalizeLookupKey(product.id))
      ?? catalogLookup.byName.get(normalizeLookupKey(product.name));
    if (!catalogItem) return [];
    const slot = generatedSlot(room.roomType, product, index, size);
    // buildRectangularFloorplan / buildPresetFloorplan centre rooms at origin;
    // item positions must be shifted from 0-based coords to centred coords.
    return [{
      name: catalogItem.name,
      modelUrl: catalogItem.modelUrl,
      widthCm: catalogItem.widthCm,
      depthCm: catalogItem.depthCm,
      heightCm: catalogItem.heightCm,
      type: catalogItem.type,
      x: slot.x - size.width / 2,
      z: slot.z - size.depth / 2,
      rot: slot.rot,
    }];
  });

  const wallColor = getWallColor(room.roomType, room.style);
  const openings = layoutPreset?.openings ?? (ROOM_OPENINGS[room.roomType] ?? ROOM_OPENINGS.default);

  return {
    name: room.title ?? room.name ?? 'Inspiration look',
    roomWidth: size.width,
    roomDepth: size.depth,
    roomHeight: 275,
    wallColor,
    wallTexture: '/rooms/textures/wallmap.png',
    wallTextureStretch: true,
    wallTextureScale: 0,
    floorTexture: ROOM_FLOOR_TEXTURE[room.roomType] ?? ROOM_FLOOR_TEXTURE.default,
    floorTextureStretch: false,
    floorTextureScale: 280,
    openings,
    items: matchedProducts,
    ...(layoutPreset?.corners ? { layout: { corners: layoutPreset.corners, walls: layoutPreset.walls } } : {}),
  };
};

export default function DesignCanvas({ projectId, projectName, onBack, startConfig = null }) {
  const storageKey = storageKeyForProject(projectId);
  const bp3dRef = useRef(null);
  const overlayRef = useRef(null);
  const uploadInputRef = useRef(null);
  const backgroundImageRef = useRef(null);
  const startConfigRef = useRef(startConfig);
  const startTemplateAppliedRef = useRef(false);
  const handleLoadRoomRef = useRef(() => {});
  const catalogRef = useRef([]);
  const selectedRef = useRef(null);
  const snapOnRef = useRef(true);
  const drawFootprintsRef = useRef(() => {});
  const footprintRafRef = useRef(null);
  const modeRef = useRef('floorplan');
  const roomPreviewRef = useRef(null);
  const setEditorToolRef = useRef(() => {});
  const skipToolResetRef = useRef(false);

  const [mode, setMode] = useState('floorplan');
  const [drawMode, setDrawMode] = useState('MOVE');
  const [editorTool, setEditorTool] = useState('move');
  const [selected, setSelected] = useState(null);
  const [selectedSurface, setSelectedSurface] = useState(null);
  const [selectedTexture, setSelectedTexture] = useState(null);
  const [activeNav, setActiveNav] = useState('catalog');
  const [legacyCategories, setLegacyCategories] = useState([]);
  const [snapOn, setSnapOn] = useState(true);
  const [importedScene, setImportedScene] = useState(null);
  const [gltfPlacedItems, setGltfPlacedItems] = useState([]);
  const [dragOverCanvas, setDragOverCanvas] = useState(false);
  const [showCeiling, setShowCeiling] = useState(true);
  const [ceilingTexture, setCeilingTexture] = useState(ceilingTextures[0]);
  const [wallScope, setWallScope] = useState('all');
  const [dynamicCategories, setDynamicCategories] = useState([]);
  const [dropPreviewItem, setDropPreviewItem] = useState(null);
  const [dropPreviewPosition, setDropPreviewPosition] = useState(null);
  const dropPreviewPositionRef = useRef(null);
  const [catalogPlacementItem, setCatalogPlacementItem] = useState(null);
  const catalogPlacementItemRef = useRef(null);
  const [wallOpenings, setWallOpenings] = useState([]);
  const [wallPlacementMode, setWallPlacementMode] = useState(null);
  const [selectedOpening, setSelectedOpening] = useState(null);
  const [ceilingFixtures, setCeilingFixtures] = useState([]);
  const wallOpeningsRef = useRef([]);
  const ceilingFixturesRef = useRef([]);
  const selectedOpeningRef = useRef(null);
  const wallPlacementModeRef = useRef(null);
  const [revision, setRevision] = useState(0);
  const gltfPlacedItemsRef = useRef([]);
  const shellSyncTimerRef = useRef(null);
  const gltfViewerRef = useRef(null);
  const autoSaveTimerRef = useRef(null);
  const persistDesignRef = useRef(() => {});
  const scheduleAutoSaveRef = useRef(() => {});
  const initCompleteRef = useRef(false);
  const importedSceneRef = useRef(null);
  const [backgroundPlan, setBackgroundPlan] = useState(() => loadStoredBackgroundPlan(projectId));
  const [lastSavedAt, setLastSavedAt] = useState(null);
  const backgroundPlanRef = useRef(backgroundPlan);

  useEffect(() => {
    importedSceneRef.current = importedScene;
  }, [importedScene]);

  useEffect(() => {
    migrateProjectsFromStorage();
    if (projectId) {
      upsertProject({ id: projectId, name: projectName, touch: false });
      setActiveProjectName(projectName);
    }
  }, [projectId, projectName]);

  useEffect(() => {
    preloadFloorPlanSymbols();
    setFloorPlanSymbolRedrawCallback(() => drawFootprintsRef.current());
    return () => setFloorPlanSymbolRedrawCallback(null);
  }, []);

  useEffect(() => {
    backgroundPlanRef.current = backgroundPlan;
    if (!backgroundPlan?.src) {
      backgroundImageRef.current = null;
      drawFootprintsRef.current();
      return undefined;
    }

    const image = new Image();
    image.onload = () => {
      backgroundImageRef.current = image;
      drawFootprintsRef.current();
    };
    image.src = backgroundPlan.src;
    return undefined;
  }, [backgroundPlan]);

  useEffect(() => {
    startConfigRef.current = startConfig;
  }, [startConfig]);

  const catalogCategories = useMemo(() => {
    const base = USE_LEGACY_JS_RENDERER
      ? [...CATALOG_CATEGORIES, ...legacyCategories]
      : CATALOG_CATEGORIES;
    const seen = new Set(base.flatMap((cat) => cat.items.map((item) => item.modelUrl)));
    const extra = dynamicCategories.flatMap((cat) => {
      const items = cat.items.filter((item) => !seen.has(item.modelUrl));
      items.forEach((item) => seen.add(item.modelUrl));
      if (!items.length) return [];
      return [{ ...cat, items, itemCount: items.length }];
    });
    return [...base, ...extra];
  }, [legacyCategories, dynamicCategories]);
  const canvasMode = mode === 'floorplan' ? '2d' : '3d';
  const floorSpec = useMemo(
    () => getFloorSpecFromBlueprint(bp3dRef.current),
    [revision, mode],
  );
  const roomShell = useMemo(() => {
    const shell = importedScene?.sceneModelUrl
      ? null
      : extractBlueprintRoomShell(bp3dRef.current);
    if (!shell) return null;
    return applyOpeningsToRoomShell(shell, wallOpenings, bp3dRef.current?.model?.floorplan);
  }, [revision, mode, importedScene, wallOpenings]);
  const importedTemplateItems = useMemo(() => {
    if (!importedScene || !bp3dRef.current) return [];
    return (bp3dRef.current.model.scene.getItems?.() ?? []).flatMap((item) => {
      const previewModelUrl = getTemplatePreviewModelUrl(item.metadata?.modelUrl, item.metadata?.previewModelUrl);
      if (!previewModelUrl) return [];
      return [{
        id: item.metadata?.loadId ?? item.uuid,
        previewModelUrl,
        sourceItem: item,
        x: (item.position?.x ?? 0) / 100,
        z: (item.position?.z ?? 0) / 100,
        rotationY: item.rotation?.y ?? 0,
      }];
    });
  }, [importedScene, revision]);

  useEffect(() => {
    gltfPlacedItemsRef.current = gltfPlacedItems;
  }, [gltfPlacedItems]);

  useEffect(() => {
    wallOpeningsRef.current = wallOpenings;
    attachOpeningsToWalls(wallOpenings, bp3dRef.current?.model?.floorplan);
  }, [wallOpenings]);

  useEffect(() => {
    ceilingFixturesRef.current = ceilingFixtures;
  }, [ceilingFixtures]);

  useEffect(() => {
    selectedOpeningRef.current = selectedOpening;
  }, [selectedOpening]);

  useEffect(() => {
    wallPlacementModeRef.current = wallPlacementMode;
  }, [wallPlacementMode]);

  useEffect(() => {
    catalogPlacementItemRef.current = catalogPlacementItem;
  }, [catalogPlacementItem]);

  const nudgeSelectedGltfItem = useCallback((dxCm, dzCm) => {
    const current = selectedRef.current;
    if (!current?.gltfId) return false;
    setGltfPlacedItems((prev) => prev.map((entry) => {
      if (entry.id !== current.gltfId) return entry;
      const snap = snapOnRef.current ? GRID_SNAP_CM / 100 : 0.01;
      const nx = Math.round((entry.x + (dxCm / 100)) / snap) * snap;
      const nz = Math.round((entry.z + (dzCm / 100)) / snap) * snap;
      return { ...entry, x: nx, z: nz };
    }));
    drawFootprintsRef.current();
    return true;
  }, []);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape' && wallPlacementModeRef.current) {
        setWallPlacementMode(null);
        notify('Opening placement cancelled');
        return;
      }

      if (event.key === 'Escape' && catalogPlacementItemRef.current) {
        setCatalogPlacementItem(null);
        notify('Item placement cancelled');
        return;
      }

      if (event.key === 'Escape' && selectedOpeningRef.current) {
        setSelectedOpening(null);
        return;
      }

      if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)
        && !event.ctrlKey
        && !event.metaKey
        && selectedRef.current?.gltfId) {
        const nudge = snapOnRef.current ? GRID_SNAP_CM : 1;
        const moved = (
          (event.key === 'ArrowLeft' && nudgeSelectedGltfItem(-nudge, 0))
          || (event.key === 'ArrowRight' && nudgeSelectedGltfItem(nudge, 0))
          || (event.key === 'ArrowUp' && nudgeSelectedGltfItem(0, -nudge))
          || (event.key === 'ArrowDown' && nudgeSelectedGltfItem(0, nudge))
        );
        if (moved) event.preventDefault();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [nudgeSelectedGltfItem]);

  const selectGltfItem = (entry) => {
    if (!entry) {
      selectedRef.current = null;
      setSelected(null);
      setSelectedOpening(null);
      drawFootprintsRef.current();
      return;
    }
    setSelectedOpening(null);
    setSelectedSurface(null);
    const nextSelected = {
      gltfId: entry.id,
      name: entry.name ?? 'Item',
      thumbnail: entry.thumbnail ?? '',
      width: entry.widthCm ?? 100,
      depth: entry.depthCm ?? 100,
      height: entry.heightCm ?? 100,
    };
    selectedRef.current = nextSelected;
    setSelected(nextSelected);
    drawFootprintsRef.current();
  };

  const selectGltfItemFromViewer = (entry) => {
    if (!entry) {
      selectGltfItem(null);
      return;
    }
    const isNewSelection = selectedRef.current?.gltfId !== entry.id;
    selectGltfItem(entry);
    if (isNewSelection) {
      notifyTip('Item selected', 'Drag it to move. Press arrow keys to nudge.');
    }
  };

  const selectItem = (item) => {
    if (!item) return;
    setSelectedSurface(null);
    const meta = item.metadata ?? {};
    const catalogEntry = catalogRef.current.find((entry) => entry.model === meta.modelUrl) ?? null;
    const nextSelected = {
      item,
      name: meta.itemName ?? catalogEntry?.name ?? 'Item',
      thumbnail: catalogEntry?.thumbnail ? catalogEntry.thumbnail : '',
      width: Math.round(item.getWidth?.() ?? meta.xSize ?? 100),
      depth: Math.round(item.getDepth?.() ?? meta.zSize ?? 100),
      height: Math.round(item.getHeight?.() ?? meta.ySize ?? 100),
    };
    selectedRef.current = nextSelected;
    setSelected(nextSelected);
    drawFootprintsRef.current();
  };

  const restoreImportedScene = (serialized) => {
    try {
      const templateId = JSON.parse(serialized)?.designerImportedTemplateId;
      setImportedScene(templateId ? findInspirationRoom(templateId) : null);
    } catch {
      setImportedScene(null);
    }
  };

  const persistDesign = useCallback(({ notifyUser = false } = {}) => {
    const bp3d = bp3dRef.current;
    if (!bp3d || !projectId) return false;

    try {
      const serialized = JSON.parse(bp3d.model.exportSerialized());
      if (importedSceneRef.current) {
        serialized.designerImportedTemplateId = importedSceneRef.current.id;
      }
      if (!USE_LEGACY_JS_RENDERER) {
        serialized.designerGltfItems = gltfPlacedItemsRef.current;
        serialized.designerWallOpenings = wallOpeningsRef.current;
        serialized.designerCeilingFixtures = ceilingFixturesRef.current;
      }
      serialized.designerLastMode = modeRef.current;
      serialized.designerProjectName = projectName;
      serialized.designerUpdatedAt = new Date().toISOString();

      window.localStorage.setItem(storageKey, JSON.stringify(serialized));
      saveBackgroundPlan(projectId, backgroundPlanRef.current);
      upsertProject({ id: projectId, name: projectName });
      setActiveProjectName(projectName);
      setLastSavedAt(serialized.designerUpdatedAt);
      if (notifyUser) notify('Design saved');
      return true;
    } catch (error) {
      console.error('Could not save design:', error);
      if (notifyUser) notify('Save failed');
      return false;
    }
  }, [projectId, projectName, storageKey]);

  const scheduleAutoSave = useCallback(() => {
    if (!initCompleteRef.current) return;
    if (autoSaveTimerRef.current) {
      window.clearTimeout(autoSaveTimerRef.current);
    }
    autoSaveTimerRef.current = window.setTimeout(() => {
      persistDesignRef.current?.();
    }, 900);
  }, []);

  useEffect(() => {
    persistDesignRef.current = persistDesign;
  }, [persistDesign]);

  useEffect(() => {
    scheduleAutoSaveRef.current = scheduleAutoSave;
  }, [scheduleAutoSave]);

  useEffect(() => {
    if (!initCompleteRef.current) return undefined;
    scheduleAutoSave();
    return undefined;
  }, [gltfPlacedItems, wallOpenings, ceilingFixtures, revision, importedScene, scheduleAutoSave]);

  useEffect(() => {
    const flushSave = () => {
      if (autoSaveTimerRef.current) {
        window.clearTimeout(autoSaveTimerRef.current);
        autoSaveTimerRef.current = null;
      }
      persistDesignRef.current?.();
    };
    window.addEventListener('beforeunload', flushSave);
    return () => window.removeEventListener('beforeunload', flushSave);
  }, []);

  useEffect(() => {
    selectedRef.current = selected;
  }, [selected]);

  useEffect(() => {
    snapOnRef.current = snapOn;
  }, [snapOn]);

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  useEffect(() => {
    setEditorToolRef.current = setEditorTool;
  }, []);

  const refreshBlueprintViews = useCallback((activeMode = modeRef.current) => {
    const bp3d = bp3dRef.current;
    if (!bp3d) return;
    bp3d.three.updateWindowSize();
    bp3d.floorplanner.resizeView();
    if (activeMode === '3d') {
      bp3d.three.centerCamera?.();
      bp3d.three.needsUpdate?.();
    }
    drawFootprintsRef.current();
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => refreshBlueprintViews(modeRef.current), 120);
    return () => window.clearTimeout(timer);
  }, [activeNav, refreshBlueprintViews]);

  useEffect(() => {
    let mounted = true;
    loadManifest()
      .then(() => buildDynamicCatalog())
      .then((categories) => {
        if (mounted) setDynamicCategories(categories);
      })
      .catch((error) => {
        console.warn('Could not load dynamic catalog:', error);
      });
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    let mounted = true;
    loadBlueprintCatalog()
      .then((items) => {
        if (!mounted) return;
        setLegacyCategories(buildLegacyCatalogCategories(items));
      })
      .catch((error) => {
        console.warn('Could not load legacy catalog:', error);
      });
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    catalogRef.current = buildCatalogFlat(catalogCategories);
  }, [catalogCategories]);

  // ── Draw footprint overlay on the 2D canvas ─────────────────────────
  const drawFootprints = useCallback(() => {
    if (modeRef.current !== 'floorplan') return;

    const bp3d = bp3dRef.current;
    const canvas = overlayRef.current;
    if (!bp3d || !canvas) return;

    const fp = document.getElementById('floorplanner');
    if (!fp) return;
    if (canvas.width !== fp.width) canvas.width = fp.width;
    if (canvas.height !== fp.height) canvas.height = fp.height;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const planPadding = 48;
    const bgImage = backgroundImageRef.current;
    if (bgImage?.complete && bgImage.naturalWidth > 0) {
      const availW = canvas.width - planPadding * 2;
      const availH = canvas.height - planPadding * 2;
      const scale = Math.min(availW / bgImage.naturalWidth, availH / bgImage.naturalHeight);
      const drawW = bgImage.naturalWidth * scale;
      const drawH = bgImage.naturalHeight * scale;
      const drawX = planPadding + (availW - drawW) / 2;
      const drawY = planPadding + (availH - drawH) / 2;
      ctx.save();
      ctx.globalAlpha = 0.38;
      ctx.drawImage(bgImage, drawX, drawY, drawW, drawH);
      ctx.restore();
    }

    const floorplanner = bp3d.floorplanner;
    if (!floorplanner) return;

    const toX = (wcm) => floorplanner.convertX?.(wcm) ?? wcm;
    const toY = (wcm) => floorplanner.convertY?.(wcm) ?? wcm;
    const scale = (floorplanner.pixelsPerCm
      ?? floorplanner.viewmodel?.pixelsPerCm
      ?? Math.abs(toX(1) - toX(0))) || 0.5;

    const items = bp3d.model?.scene?.getItems?.() ?? [];

    items.forEach((item) => {
      const meta = item.metadata ?? {};
      const cx = item.position?.x ?? meta.xPos ?? 0;
      const cz = item.position?.z ?? meta.zPos ?? 0;
      const w = item.getWidth?.() ?? meta.xSize ?? 80;
      const d = item.getDepth?.() ?? meta.zSize ?? 80;
      const rot = item.rotation?.y ?? meta.rotation ?? 0;

      const px = toX(cx);
      const py = toY(cz);
      const pw = Math.abs(toX(cx + w / 2) - toX(cx - w / 2)) || w * scale;
      const pd = Math.abs(toY(cz + d / 2) - toY(cz - d / 2)) || d * scale;

      const isSelected = selectedRef.current?.item === item;

      ctx.save();
      ctx.translate(px, py);
      ctx.rotate(rot);

      const label = meta.itemName ?? 'Item';
      drawFloorPlanSymbol(ctx, label, pw, pd, { selected: isSelected });

      ctx.restore();
    });

    if (!USE_LEGACY_JS_RENDERER) {
      gltfPlacedItemsRef.current.forEach((item) => {
        const cx = item.x * 100;
        const cz = item.z * 100;
        const w = item.widthCm ?? 80;
        const d = item.depthCm ?? 80;
        const rot = item.rotationY ?? 0;

        const px = toX(cx);
        const py = toY(cz);
        const pw = Math.abs(toX(cx + w / 2) - toX(cx - w / 2)) || w * scale;
        const pd = Math.abs(toY(cz + d / 2) - toY(cz - d / 2)) || d * scale;
        const isSelected = selectedRef.current?.gltfId === item.id;

        ctx.save();
        ctx.translate(px, py);
        ctx.rotate(rot);
        drawFloorPlanSymbol(ctx, item.name ?? 'Item', pw, pd, { selected: isSelected });
        ctx.restore();
      });
    }

    drawWallOpenings(
      ctx,
      floorplanner,
      toX,
      toY,
      wallOpeningsRef.current,
      bp3d.model.floorplan,
      selectedOpeningRef.current?.opening?.id ?? null,
    );

    const preview = roomPreviewRef.current;
    if (preview) {
      const x1 = toX(preview.x1);
      const y1 = toY(preview.y1);
      const x2 = toX(preview.x2);
      const y2 = toY(preview.y2);
      const left = Math.min(x1, x2);
      const top = Math.min(y1, y2);
      const width = Math.abs(x2 - x1);
      const height = Math.abs(y2 - y1);

      ctx.fillStyle = 'rgba(99, 102, 241, 0.14)';
      ctx.strokeStyle = '#818cf8';
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 4]);
      ctx.beginPath();
      ctx.rect(left, top, width, height);
      ctx.fill();
      ctx.stroke();
      ctx.setLineDash([]);

      const wCm = Math.abs(preview.x2 - preview.x1);
      const dCm = Math.abs(preview.y2 - preview.y1);
      if (wCm >= 10 && dCm >= 10) {
        ctx.fillStyle = '#4338ca';
        ctx.font = '11px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${Math.round(wCm)} × ${Math.round(dCm)} cm`, left + width / 2, top + height / 2);
      }
    }
  }, []);

  const scheduleFootprintDraw = useCallback(() => {
    if (modeRef.current !== 'floorplan') return;
    if (footprintRafRef.current != null) return;
    footprintRafRef.current = window.requestAnimationFrame(() => {
      footprintRafRef.current = null;
      drawFootprints();
    });
  }, [drawFootprints]);

  useEffect(() => () => {
    if (footprintRafRef.current != null) {
      window.cancelAnimationFrame(footprintRafRef.current);
    }
  }, []);

  drawFootprintsRef.current = scheduleFootprintDraw;

  const scheduleShellSync = useCallback(() => {
    if (shellSyncTimerRef.current) return;
    shellSyncTimerRef.current = window.setTimeout(() => {
      shellSyncTimerRef.current = null;
      setRevision((current) => current + 1);
      drawFootprintsRef.current();
    }, 50);
  }, []);

  const placeWallOpeningAtHit = useCallback((wallHit, cfg = wallPlacementModeRef.current) => {
    if (!wallHit?.wall || !cfg) return;
    const opening = createWallOpening(
      wallHit.wall,
      wallHit.offsetAlongWall,
      cfg,
      wallOpeningsRef.current,
      wallHit.lengthCm,
    );
    setWallOpenings((prev) => [...prev, opening]);
    setSelectedOpening({ wall: wallHit.wall, opening });
    setSelected(null);
    selectedRef.current = null;
    setWallPlacementMode(null);
    scheduleShellSync();
    drawFootprintsRef.current();
    notify(`${cfg.label} placed`);
  }, [scheduleShellSync]);

  const handleShellFloorClick = useCallback((room) => {
    setSelected(null);
    selectedRef.current = null;
    setSelectedSurface({ kind: 'floor', target: room });
  }, []);

  const handleShellWallClick = useCallback((edge) => {
    setSelected(null);
    selectedRef.current = null;
    setSelectedSurface({ kind: 'wall', target: edge });
  }, []);

  const handleBackgroundClick = useCallback(() => {
    setSelectedSurface(null);
  }, []);

  // ── Init Blueprint3D ────────────────────────────────────────────────
  useEffect(() => {
    const blueprint3d = createModernCanvasEngine({
      floorplannerElement: 'floorplanner',
      textureDir: '/rooms/textures/',
    });
    bp3dRef.current = blueprint3d;

    applySnapConfiguration();

    // Blueprint3D pans and drags through its view directly, bypassing floorplan redraw events.
    // Mirror that draw lifecycle so furniture footprints remain anchored to walls and floors.
    const floorplannerView = blueprint3d.floorplanner?.view;
    const originalFloorplannerDraw = floorplannerView?.draw?.bind(floorplannerView);
    if (floorplannerView && originalFloorplannerDraw) {
      floorplannerView.draw = (...args) => {
        const result = originalFloorplannerDraw(...args);
        drawFootprintsRef.current();
        return result;
      };
    }

    const threeDiv = document.getElementById('three-canvas');
    if (threeDiv) threeDiv.style.touchAction = 'none';

    // Ensure controller stays enabled and mouse coords stay in sync after layout changes
    blueprint3d.three.getController().enabled = true;

    // Item selection callbacks
    blueprint3d.three.itemSelectedCallbacks.add((item) => {
      selectItem(item);
    });

    blueprint3d.three.itemUnselectedCallbacks.add(() => {
      selectedRef.current = null;
      setSelected(null);
      drawFootprintsRef.current();
    });

    blueprint3d.model.scene.itemLoadedCallbacks.add(() => {
      drawFootprintsRef.current();
      blueprint3d.three.needsUpdate?.();
      if (USE_LEGACY_JS_RENDERER) {
        setRevision((current) => current + 1);
      }
    });
    blueprint3d.model.scene.itemRemovedCallbacks.add(() => {
      drawFootprintsRef.current();
      if (USE_LEGACY_JS_RENDERER) {
        setRevision((current) => current + 1);
      }
      scheduleAutoSaveRef.current?.();
    });
    blueprint3d.model.floorplan.fireOnRedraw(() => {
      drawFootprintsRef.current();
      scheduleShellSync();
      scheduleAutoSaveRef.current?.();
    });

    attachBlueprintFloorplanSync(blueprint3d.model.floorplan, scheduleShellSync);

    const fpModes = MODERN_FLOORPLANNER_MODES;
    blueprint3d.floorplanner.addModeResetCallback((nextMode) => {
      if (fpModes && nextMode === fpModes.MOVE) {
        roomPreviewRef.current = null;
        if (!skipToolResetRef.current) {
          setEditorToolRef.current('move');
        }
        skipToolResetRef.current = false;
        drawFootprintsRef.current();
      }
    });

    // Surface click callbacks for texture targeting
    blueprint3d.three.floorClicked.add((room) => setSelectedSurface({ kind: 'floor', target: room }));
    blueprint3d.three.wallClicked.add((edge) => setSelectedSurface({ kind: 'wall', target: edge }));

    // Apply default textures to new walls/rooms
    blueprint3d.model.floorplan.fireOnNewWall((wall) => {
      wall.frontTexture.url = '/rooms/textures/wallmap.png';
      wall.backTexture.url = '/rooms/textures/wallmap.png';
    });

    blueprint3d.model.floorplan.fireOnUpdatedRooms(() => {
      blueprint3d.model.floorplan.getWalls().forEach((wall) => {
        ['frontTexture', 'backTexture'].forEach((face) => {
          if (wall[face]?.url && !wall[face].url.startsWith('/')) wall[face].url = `/${wall[face].url}`;
        });
      });
      blueprint3d.model.floorplan.getRooms().forEach((room) => {
        const texture = room.getTexture();
        if (texture?.url && !texture.url.startsWith('/')) room.setTexture(`/${texture.url}`, true, texture.scale);
      });
      blueprint3d.three.needsUpdate?.();
      drawFootprintsRef.current();
      scheduleShellSync();
    });

    // Load saved design, blank canvas for new projects, or legacy starter room fallback
    const saved = window.localStorage.getItem(storageKey);
    const legacy = !saved ? window.localStorage.getItem('bp3d_v2') : null;
    const payload = saved || legacy;
    const hasStoredDesign = payload && !isEmptyBlueprintDesign(payload);

    if (hasStoredDesign) {
      try { blueprint3d.model.loadSerialized(payload); } catch (e) { blueprint3d.model.loadSerialized(BLANK_ROOM); }
      restoreImportedScene(payload);
      try {
        const parsed = JSON.parse(payload);
        if (!USE_LEGACY_JS_RENDERER) {
          setGltfPlacedItems(sanitizeGltfPlacedItems(parsed?.designerGltfItems ?? []));
          setWallOpenings(parsed?.designerWallOpenings ?? []);
          setCeilingFixtures(parsed?.designerCeilingFixtures ?? []);
        }
        if (parsed.designerLastMode === '3d' || parsed.designerLastMode === 'floorplan') {
          modeRef.current = parsed.designerLastMode;
          setMode(parsed.designerLastMode);
        }
        if (parsed.designerUpdatedAt) {
          setLastSavedAt(parsed.designerUpdatedAt);
        }
      } catch {
        if (!USE_LEGACY_JS_RENDERER) {
          setGltfPlacedItems([]);
          setWallOpenings([]);
          setCeilingFixtures([]);
        }
      }
    } else {
      blueprint3d.model.loadSerialized(BLANK_ROOM);
      setImportedScene(null);

      const pendingBgRaw = readPendingBackgroundPlan(projectId);
      if (pendingBgRaw) {
        try {
          const plan = JSON.parse(pendingBgRaw);
          setBackgroundPlan(plan);
          saveBackgroundPlan(projectId, plan);
        } catch {
          // ignore malformed upload payload
        }
      }
    }
    if (legacy && !saved) {
      window.localStorage.setItem(storageKey, legacy);
    }

    window.setTimeout(() => {
      const rooms = blueprint3d.model.floorplan.getRooms();
      if (rooms.length && floorTextures[0]) {
        rooms[0].setTexture(floorTextures[0].url, floorTextures[0].stretch, floorTextures[0].scale);
      }
      attachBlueprintFloorplanSync(blueprint3d.model.floorplan, scheduleShellSync);
      scheduleShellSync();
      blueprint3d.three.needsUpdate?.();
      drawFootprintsRef.current();
      refreshBlueprintViews(modeRef.current);
      initCompleteRef.current = true;
    }, 120);

    const onResize = () => {
      const activeMode = document.getElementById('three-canvas')?.style.display !== 'none' ? '3d' : 'floorplan';
      refreshBlueprintViews(activeMode);
    };

    // Resize on mount + window resize
    const timer = window.setTimeout(() => refreshBlueprintViews('floorplan'), 200);
    window.addEventListener('resize', onResize);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('resize', onResize);
      if (autoSaveTimerRef.current) {
        window.clearTimeout(autoSaveTimerRef.current);
      }
      initCompleteRef.current = false;
      if (floorplannerView && originalFloorplannerDraw) {
        floorplannerView.draw = originalFloorplannerDraw;
      }
      bp3dRef.current = null;
    };
  // Init once per project — do NOT depend on mode or draw callbacks (would destroy BP3D on tab switch)
  }, [storageKey, refreshBlueprintViews, scheduleShellSync]);

  // ── Mode switching ───────────────────────────────────────────────────
  const switchMode = (next) => {
    const bp3d = bp3dRef.current;
    if (!bp3d) return;
    const prev = modeRef.current;
    if (next !== '3d') {
      setCatalogPlacementItem(null);
    }
    // Rebuild rooms/floors/walls in 3D after 2D edits (stock Blueprint3D behavior)
    if (prev === 'floorplan' && next !== 'floorplan') {
      bp3d.model.floorplan.update();
      scheduleShellSync();
    }
    modeRef.current = next;
    bp3d.three.getController().setSelectedObject(null);
    bp3d.three.stopSpin();
    setMode(next);
    if (next === '3d' && !USE_LEGACY_JS_RENDERER) {
      setRevision((current) => current + 1);
      show3dControlsTipOnce();
    }
    window.requestAnimationFrame(() => {
      window.setTimeout(() => refreshBlueprintViews(next), 50);
    });
    scheduleAutoSaveRef.current?.();
  };

  // ── Snap toggle ──────────────────────────────────────────────────────
  const toggleSnap = (on) => {
    setSnapOn(on);
    snapOnRef.current = on;
    applySnapConfiguration();
  };

  // ── Draw mode helpers ────────────────────────────────────────────────
  const setFloorplannerMode = (m) => {
    const bp3d = bp3dRef.current;
    const modes = MODERN_FLOORPLANNER_MODES;
    if (!bp3d || !modes) return;
    bp3d.floorplanner.setMode(modes[m]);
    setDrawMode(m);
  };

  const activateIn2D = (callback) => {
    if (modeRef.current !== 'floorplan') {
      switchMode('floorplan');
      window.setTimeout(callback, 80);
      return;
    }
    callback();
  };

  const startWallDraw = () => {
    activateIn2D(() => {
      roomPreviewRef.current = null;
      setEditorTool('wall');
      setFloorplannerMode('DRAW');
      drawFootprintsRef.current();
      notify('Click to place wall corners. Press Esc when finished.');
    });
  };

  const startRoomDraw = () => {
    activateIn2D(() => {
      roomPreviewRef.current = null;
      setEditorTool('room');
      const bp3d = bp3dRef.current;
      const modes = MODERN_FLOORPLANNER_MODES;
      if (bp3d && modes && bp3d.floorplanner.mode !== modes.MOVE) {
        skipToolResetRef.current = true;
        setFloorplannerMode('MOVE');
      }
      drawFootprintsRef.current();
      notify('Drag on the plan to draw a rectangular room.');
    });
  };

  useEffect(() => {
    if (editorTool !== 'room' || mode !== 'floorplan') return undefined;

    const overlay = overlayRef.current;
    const fpCanvas = document.getElementById('floorplanner');
    if (!overlay || !fpCanvas) return undefined;

    const updatePreview = (x1, y1, x2, y2) => {
      roomPreviewRef.current = { x1, y1, x2, y2 };
      drawFootprintsRef.current();
    };

    const clearPreview = () => {
      roomPreviewRef.current = null;
      drawFootprintsRef.current();
    };

    const onPointerDown = (event) => {
      event.preventDefault();
      event.stopPropagation();
      const pt = clientToFloorplanCoords(
        event.clientX,
        event.clientY,
        fpCanvas,
        bp3dRef.current?.floorplanner,
        GRID_SNAP_CM,
        snapOnRef.current,
      );
      if (!pt) return;
      overlay.setPointerCapture(event.pointerId);
      updatePreview(pt.x, pt.y, pt.x, pt.y);
    };

    const onPointerMove = (event) => {
      const preview = roomPreviewRef.current;
      if (!preview) return;
      const pt = clientToFloorplanCoords(
        event.clientX,
        event.clientY,
        fpCanvas,
        bp3dRef.current?.floorplanner,
        GRID_SNAP_CM,
        snapOnRef.current,
      );
      if (!pt) return;
      updatePreview(preview.x1, preview.y1, pt.x, pt.y);
    };

    const finishRoom = (event) => {
      const preview = roomPreviewRef.current;
      if (!preview) return;

      const pt = clientToFloorplanCoords(
        event.clientX,
        event.clientY,
        fpCanvas,
        bp3dRef.current?.floorplanner,
        GRID_SNAP_CM,
        snapOnRef.current,
      );
      if (!pt) {
        clearPreview();
        setEditorTool('move');
        return;
      }

      const floorplan = bp3dRef.current?.model?.floorplan;
      const created = floorplan
        && createRectangularRoom(floorplan, preview.x1, preview.y1, pt.x, pt.y);

      roomPreviewRef.current = null;
      setEditorTool('move');
      skipToolResetRef.current = true;
      setFloorplannerMode('MOVE');
      drawFootprintsRef.current();

      if (created) {
        scheduleShellSync();
        notify('Room created');
      } else {
        notify('Room too small — drag at least 1m × 1m');
      }
    };

    const onPointerUp = (event) => {
      if (overlay.hasPointerCapture(event.pointerId)) {
        overlay.releasePointerCapture(event.pointerId);
      }
      finishRoom(event);
    };

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        clearPreview();
        setEditorTool('move');
        skipToolResetRef.current = true;
        setFloorplannerMode('MOVE');
        notify('Room drawing cancelled');
      }
    };

    overlay.addEventListener('pointerdown', onPointerDown);
    overlay.addEventListener('pointermove', onPointerMove);
    overlay.addEventListener('pointerup', onPointerUp);
    overlay.addEventListener('pointercancel', onPointerUp);
    window.addEventListener('keydown', onKeyDown);

    return () => {
      overlay.removeEventListener('pointerdown', onPointerDown);
      overlay.removeEventListener('pointermove', onPointerMove);
      overlay.removeEventListener('pointerup', onPointerUp);
      overlay.removeEventListener('pointercancel', onPointerUp);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [editorTool, mode]);

  useEffect(() => {
    if (!wallPlacementMode || mode !== 'floorplan') return undefined;
    const overlay = overlayRef.current;
    if (!overlay) return undefined;

    const onPointerDown = (event) => {
      if (event.button !== 0) return;
      const fp = document.getElementById('floorplanner');
      const pt = clientToFloorplanCoords(
        event.clientX,
        event.clientY,
        fp,
        bp3dRef.current?.floorplanner,
        GRID_SNAP_CM,
        false,
      );
      if (!pt) return;
      const wallHit = getWallHitFromWorldPoint(
        bp3dRef.current?.model?.floorplan,
        pt.x / 100,
        pt.y / 100,
        120,
      );
      if (!wallHit) {
        notify('Click closer to a wall line');
        return;
      }
      placeWallOpeningAtHit(wallHit);
    };

    overlay.addEventListener('pointerdown', onPointerDown);
    return () => overlay.removeEventListener('pointerdown', onPointerDown);
  }, [wallPlacementMode, mode, placeWallOpeningAtHit]);

  const deleteSelectedWall = () => {
    bp3dRef.current?.floorplanner?.removeEdge?.();
  };

  // ── Add item ─────────────────────────────────────────────────────────
  const placeCatalogItem = (item, dropPlacement = null) => new Promise((resolve, reject) => {
    const bp3d = bp3dRef.current;
    if (!bp3d) {
      reject(new Error('Editor not ready'));
      return;
    }

    if (!USE_LEGACY_JS_RENDERER) {
      const modelUrl = resolveCatalogModelUrl(item.model, item.previewModelUrl);
      if (!modelUrl) {
        reject(new Error(`${item.name} has no GLTF/GLB model`));
        return;
      }
      if (isBlockedModelUrl(modelUrl)) {
        reject(new Error(`${item.name} model is unavailable`));
        return;
      }

      preloadModel(modelUrl, item.materialUrl);

      let placement = dropPlacement ?? getCatalogPlacementPosition(
        bp3d.model.floorplan,
        gltfPlacedItemsRef.current.length,
      );
      let placementDetails = { y: 0, rotationY: 0 };
      if (item.placementMode === 'wall') {
        if (selectedSurface?.kind !== 'wall') {
          reject(new Error(`Select a wall in 3D before adding ${item.name}`));
          return;
        }
        const mounted = getWallMountedPlacement(selectedSurface.target, item);
        if (!mounted) {
          reject(new Error(`Could not attach ${item.name} to that wall`));
          return;
        }
        placement = mounted;
        placementDetails = mounted;
      }
      const entry = {
        id: createModelLoadId(),
        modelUrl,
        materialUrl: item.materialUrl ?? '',
        name: item.name,
        thumbnail: item.thumbnail ?? '',
        widthCm: item.widthCm ?? 100,
        depthCm: item.depthCm ?? 100,
        heightCm: item.heightCm ?? 100,
        type: item.type ?? 1,
        x: placement.x / 100,
        z: (placement.z ?? placement.y) / 100,
        y: placementDetails.y,
        rotationY: (placementDetails.rotationY ?? 0) + (item.rotationOffsetY ?? 0),
        placementMode: item.placementMode ?? 'floor',
        wallSegment: placementDetails.wallSegment ?? null,
      };
      const snapped = snapGltfItemToNearestWall(entry, bp3d.model.floorplan);
      const finalEntry = snapped ? { ...entry, ...snapped } : entry;
      setGltfPlacedItems((prev) => [...prev, finalEntry]);
      drawFootprintsRef.current();
      resolve();
      return;
    }

    /* Legacy Blueprint3D .js JSONLoader renderer */
    if (!window.THREE) {
      reject(new Error('Editor not ready'));
      return;
    }

    const modelUrl = item.model.startsWith('/') ? item.model : `/${item.model}`;
    const itemType = normalizeItemType(item.type);
    const loadId = createModelLoadId();
    const placement = dropPlacement ?? getCatalogPlacementPosition(
        bp3d.model.floorplan,
        bp3d.model.scene.getItems().length,
      );
    let settled = false;

    const finish = (ok, message) => {
      if (settled) return;
      settled = true;
      bp3d.model.scene.itemLoadedCallbacks.remove(onLoaded);
      window.clearTimeout(timer);
      if (ok) {
        bp3d.three.needsUpdate?.();
        drawFootprintsRef.current();
        resolve();
        return;
      }
      reject(new Error(message || `Failed to load ${item.name}`));
    };

    const onLoaded = (loadedItem) => {
      if (loadedItem?.metadata?.loadId !== loadId) return;
      settleItemOnFloor(loadedItem, bp3d.model.floorplan);
      finish(true);
    };

    bp3d.model.scene.itemLoadedCallbacks.add(onLoaded);
    const timer = window.setTimeout(
      () => finish(false, `Timed out loading ${item.name}`),
      15000,
    );

    bp3d.model.scene.addItem(
      itemType,
      modelUrl,
      {
        itemName: item.name,
        itemType,
        modelUrl,
        previewModelUrl: item.previewModelUrl,
        loadId,
        resizable: true,
      },
      new window.THREE.Vector3(placement.x, 0, placement.z ?? placement.y),
      0,
      new window.THREE.Vector3(1, 1, 1),
      false,
    );
  });

  const addItem = async (item, dropPlacement = null, { silent = false } = {}) => {
    if (modeRef.current !== '3d') {
      switchMode('3d');
      await new Promise((resolve) => window.setTimeout(resolve, 120));
    }
    try {
      await placeCatalogItem(item, dropPlacement);
      if (USE_LEGACY_JS_RENDERER && !importedScene) refreshBlueprintViews('3d');
      if (!silent) {
        notifyTip(`${item.name} placed`, 'Click and drag it to move around the room.');
      }
    } catch (err) {
      notify(err?.message ?? `Could not add ${item.name}`);
    }
  };

  // ── Dimension resize ─────────────────────────────────────────────────
  const resizeDim = (dim, val) => {
    if (!selected) return;

    const w = dim === 'width' ? val : selected.width;
    const d = dim === 'depth' ? val : selected.depth;
    const h = dim === 'height' ? val : selected.height;

    if (!Number.isFinite(w) || !Number.isFinite(d) || !Number.isFinite(h) || w <= 0 || d <= 0 || h <= 0) return;

    if (selected.gltfId) {
      setGltfPlacedItems((prev) => prev.map((entry) => (
        entry.id === selected.gltfId
          ? { ...entry, widthCm: w, depthCm: d, heightCm: h }
          : entry
      )));
      setSelected((prev) => (prev ? { ...prev, width: w, depth: d, height: h } : null));
      drawFootprintsRef.current();
      return;
    }

    const { item } = selected;
    item.resize(h, w, d);
    setSelected((prev) => prev ? { ...prev, width: w, depth: d, height: h } : null);
    drawFootprintsRef.current();
  };

  // ── Delete / Clone ───────────────────────────────────────────────────
  const deleteSelectedItem = () => {
    if (!selected) return;
    if (selected.gltfId) {
      setGltfPlacedItems((prev) => prev.filter((entry) => entry.id !== selected.gltfId));
      setSelected(null);
      drawFootprintsRef.current();
      notify('Item deleted');
      return;
    }
    selected.item.remove();
    setSelected(null);
    drawFootprintsRef.current();
    notify('Item deleted');
  };

  const cloneSelectedItem = () => {
    if (!selected) return;
    if (selected.gltfId) {
      const source = gltfPlacedItemsRef.current.find((entry) => entry.id === selected.gltfId);
      if (!source) return;
      setGltfPlacedItems((prev) => [...prev, {
        ...source,
        id: createModelLoadId(),
        x: source.x + 0.45,
        z: source.z + 0.45,
      }]);
      notify('Item cloned');
      return;
    }
    if (!window.THREE) return;
    const position = selected.item.position.clone();
    position.x += 45;
    position.z += 45;
    bp3dRef.current.model.scene.addItem(
      selected.item.metadata.itemType,
      selected.item.metadata.modelUrl,
      { ...selected.item.metadata },
      position,
      selected.item.rotation.y,
      selected.item.scale.clone(),
      selected.item.fixed,
    );
    notify('Item cloned');
  };

  const rotateSelectedItemBy = (delta) => {
    if (!selected) return;
    if (selected.gltfId) {
      setGltfPlacedItems((prev) => prev.map((entry) => {
        if (entry.id !== selected.gltfId) return entry;
        return { ...entry, rotationY: entry.rotationY + delta };
      }));
      return;
    }
    selected.item.rotation.y += delta;
    bp3dRef.current?.three?.needsUpdate?.();
  };

  const moveImportedTemplateItem = (item, x, z) => {
    item.position.x = Math.round((x * 100) / GRID_SNAP_CM) * GRID_SNAP_CM;
    item.position.z = Math.round((z * 100) / GRID_SNAP_CM) * GRID_SNAP_CM;
    item.position_set = true;
  };

  const moveGltfItem = (id, x, z) => {
    const snapM = GRID_SNAP_CM / 100;
    const sx = Math.round(x / snapM) * snapM;
    const sz = Math.round(z / snapM) * snapM;
    setGltfPlacedItems((prev) => prev.map((entry) => {
      if (entry.id !== id) return entry;
      const position = entry.placementMode === 'wall'
        ? constrainToWallSegment(entry, sx, sz)
        : { x: sx, z: sz };
      return { ...entry, ...position };
    }));
    drawFootprintsRef.current();
  };

  // ── Apply texture ────────────────────────────────────────────────────
  const applyTexture = (kind, texture) => {
    const bp3d = bp3dRef.current;
    if (!bp3d) return;
    if (kind === 'floor') {
      const target = selectedSurface?.kind === 'floor'
        ? selectedSurface.target
        : bp3d.model.floorplan.getRooms()[0];
      if (!target) {
        notify('Create a closed room first');
        return;
      }
      target.setTexture(texture.url, texture.stretch, texture.scale);
    } else if (kind === 'ceiling') {
      setCeilingTexture(texture);
    } else {
      let targets;
      if (wallScope === 'selected') {
        if (selectedSurface?.kind !== 'wall') {
          notify('Click a wall in 3D for "This wall" mode');
          return;
        }
        targets = [selectedSurface.target];
      } else {
        targets = bp3d.model.floorplan.wallEdges();
      }
      if (!targets.length) {
        notify('Draw walls first');
        return;
      }
      targets.forEach((target) => target.setTexture(texture.url, texture.stretch, texture.scale));
    }
    bp3d.three.needsUpdate();
    setSelectedTexture(`${kind}:${texture.url}`);
    scheduleShellSync();
    notify(`${texture.name} applied`);
  };

  // ── Save / Load / New ────────────────────────────────────────────────
  const handleSave = () => {
    persistDesign({ notifyUser: true });
  };

  const handleLoad = () => {
    const bp3d = bp3dRef.current;
    const saved = window.localStorage.getItem(storageKey);
    if (!bp3d || !saved) {
      notify('No saved design found');
      return;
    }
    bp3d.model.loadSerialized(isEmptyBlueprintDesign(saved) ? getStarterRoom() : saved);
    restoreImportedScene(saved);
    if (!USE_LEGACY_JS_RENDERER) {
      try {
        const parsed = JSON.parse(saved);
        setGltfPlacedItems(sanitizeGltfPlacedItems(parsed?.designerGltfItems ?? []));
        setWallOpenings(parsed?.designerWallOpenings ?? []);
        setCeilingFixtures(parsed?.designerCeilingFixtures ?? []);
        if (parsed.designerLastMode === '3d' || parsed.designerLastMode === 'floorplan') {
          modeRef.current = parsed.designerLastMode;
          setMode(parsed.designerLastMode);
        }
        if (parsed.designerUpdatedAt) {
          setLastSavedAt(parsed.designerUpdatedAt);
        }
      } catch {
        setGltfPlacedItems([]);
        setWallOpenings([]);
        setCeilingFixtures([]);
      }
    }
    setSelectedOpening(null);
    setSelected(null);
    selectedRef.current = null;
    refreshBlueprintViews(modeRef.current);
    window.setTimeout(() => drawFootprintsRef.current(), 100);
    notify('Design loaded');
  };

  const handleNewRoom = () => {
    if (!bp3dRef.current) return;
    setImportedScene(null);
    setGltfPlacedItems([]);
    setWallOpenings([]);
    setCeilingFixtures([]);
    bp3dRef.current.model.loadSerialized(getStarterRoom());
    setSelected(null);
    selectedRef.current = null;
    setSelectedSurface(null);
    setFloorplannerMode('MOVE');
    switchMode('floorplan');
    notify('Starter room loaded');
  };

  const handleNavClick = (id) => {
    setActiveNav((prev) => (prev === id ? null : id));
  };

  const preloadCatalogModel = (item) => {
    const modelUrl = resolveCatalogModelUrl(item.model ?? item.modelUrl, item.previewModelUrl);
    if (modelUrl) preloadModel(modelUrl, item.materialUrl);
  };

  const handleAddCatalogItem = (item) => {
    const openingConfig = getCatalogOpeningConfig(item);
    if (openingConfig) {
      if (modeRef.current !== '3d') switchMode('3d');
      setCatalogPlacementItem(null);
      setWallPlacementMode(openingConfig);
      notify(`Click a wall to place ${openingConfig.label}`);
      return;
    }
    preloadCatalogModel(item);
    const placementItem = {
      name: item.name,
      model: item.modelUrl,
      modelUrl: item.modelUrl,
      previewModelUrl: item.previewModelUrl,
      materialUrl: item.materialUrl,
      type: item.type,
      thumbnail: item.thumbnail,
      widthCm: item.widthCm,
      depthCm: item.depthCm,
      heightCm: item.heightCm,
      placementMode: item.placementMode,
      mountHeightCm: item.mountHeightCm,
      rotationOffsetY: item.rotationOffsetY,
    };
    if (!USE_LEGACY_JS_RENDERER && Number(item.type ?? 1) === 1) {
      if (modeRef.current !== '3d') switchMode('3d');
      setWallPlacementMode(null);
      setCatalogPlacementItem(placementItem);
      notifyTip(
        'Step 1: Click the floor',
        `Move over the floor, then click once to place ${item.name}. Press Esc to cancel.`,
      );
      return;
    }
    addItem(placementItem);
  };

  const clearDropPreview = () => {
    setDropPreviewItem(null);
    setDropPreviewPosition(null);
    dropPreviewPositionRef.current = null;
  };

  const handleDragItemStart = (event, item) => {
    preloadCatalogModel(item);
    setCatalogPlacementItem(null);
    event.dataTransfer.effectAllowed = 'copy';
    const payload = {
      name: item.name,
      model: item.modelUrl,
      modelUrl: item.modelUrl,
      previewModelUrl: item.previewModelUrl,
      materialUrl: item.materialUrl,
      type: item.type,
      thumbnail: item.thumbnail,
      widthCm: item.widthCm,
      depthCm: item.depthCm,
      heightCm: item.heightCm,
      placementMode: item.placementMode,
      mountHeightCm: item.mountHeightCm,
      rotationOffsetY: item.rotationOffsetY,
    };
    event.dataTransfer.setData(CATALOG_DRAG_TYPE, JSON.stringify(payload));
    setDropPreviewItem(payload);
  };

  const handleCanvasDragOver = (event) => {
    if (!event.dataTransfer.types.includes(CATALOG_DRAG_TYPE)) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
    setDragOverCanvas(true);

    const wrap = document.getElementById('canvas-wrap');
    if (modeRef.current === '3d' && !USE_LEGACY_JS_RENDERER && gltfViewerRef.current && wrap) {
      const rect = wrap.getBoundingClientRect();
      const world = gltfViewerRef.current.projectDrop(event.clientX, event.clientY, rect);
      if (world) {
        const snapM = GRID_SNAP_CM / 100;
        const snapped = {
          x: Math.round(world.x / snapM) * snapM,
          z: Math.round(world.z / snapM) * snapM,
        };
        dropPreviewPositionRef.current = snapped;
        setDropPreviewPosition(snapped);
        return;
      }
    }
    dropPreviewPositionRef.current = null;
    setDropPreviewPosition(null);
  };

  const handleCanvasDragLeave = (event) => {
    if (event.currentTarget.contains(event.relatedTarget)) return;
    setDragOverCanvas(false);
    clearDropPreview();
  };

  const handleCanvasDrop = (event) => {
    const serialized = event.dataTransfer.getData(CATALOG_DRAG_TYPE);
    if (!serialized) return;
    event.preventDefault();
    setDragOverCanvas(false);

    const item = JSON.parse(serialized);
    const wrap = document.getElementById('canvas-wrap');
    const floorplanner = bp3dRef.current?.floorplanner;
    const previewPos = dropPreviewPositionRef.current;
    clearDropPreview();
    setCatalogPlacementItem(null);

    if (modeRef.current === '3d' && !USE_LEGACY_JS_RENDERER && gltfViewerRef.current && wrap) {
      if (previewPos) {
        addItem(item, { x: previewPos.x * 100, z: previewPos.z * 100 });
        return;
      }
      const rect = wrap.getBoundingClientRect();
      const world = gltfViewerRef.current.projectDrop(event.clientX, event.clientY, rect);
      const placement = snapWorldPointMeters(world, GRID_SNAP_CM, snapOnRef.current);
      if (placement) {
        addItem(item, placement);
        return;
      }
    }

    const canvas = modeRef.current === 'floorplan'
      ? document.getElementById('floorplanner')
      : wrap;
    const placement = clientToFloorplanCoords(
      event.clientX,
      event.clientY,
      canvas,
      floorplanner,
      GRID_SNAP_CM,
      snapOnRef.current,
    );
    addItem(item, placement);
  };

  const handleCatalogPlacement = async (position) => {
    const item = catalogPlacementItemRef.current;
    if (!item || !position) return;
    setCatalogPlacementItem(null);
    const existingIds = new Set(gltfPlacedItemsRef.current.map((entry) => entry.id));
    try {
      await addItem(item, { x: position.x * 100, z: position.z * 100 }, { silent: true });
      const added = gltfPlacedItemsRef.current.find((entry) => !existingIds.has(entry.id));
      if (added) selectGltfItem(added);
      notifyTip(
        'Step 2: Drag to move',
        `${item.name} is placed. Click and drag it to reposition. Drag empty space to rotate the view.`,
      );
    } catch {
      // addItem already notifies on failure
    }
  };

  const handleLoadRoom = (room) => {
    const bp3d = bp3dRef.current;
    if (!bp3d) return;
    setWallOpenings([]);
    setCeilingFixtures([]);
    setSelectedOpening(null);
    setWallPlacementMode(null);

    const presetCallbacks = {
      switchMode,
      drawFootprints: () => drawFootprints(),
      onSync: scheduleShellSync,
      notify,
      onGltfItems: (items) => {
        setGltfPlacedItems(sanitizeGltfPlacedItems(items));
        setRevision((current) => current + 1);
      },
      onWallOpenings: (openings) => setWallOpenings(openings),
      onCeilingFixtures: (fixtures) => setCeilingFixtures(fixtures),
    };

    if (room.products?.length) {
      setImportedScene(null);
      setGltfPlacedItems([]);
      setCatalogPlacementItem(null);
      const generatedPreset = createGeneratedInspirationPreset(room);
      if (!generatedPreset.items.length) {
        notify('No matching editable catalog items found for this look');
        return;
      }
      loadBlueprintPresetData(bp3d, generatedPreset, presetCallbacks);
      return;
    }

    if (room.editablePresetId) {
      setImportedScene(null);
      setGltfPlacedItems([]);
      setCatalogPlacementItem(null);
      loadBlueprintPreset(bp3d, room.editablePresetId, presetCallbacks);
      return;
    }

    if (room.sceneModelUrl) {
      const width = room.roomWidthCm ?? 600;
      const depth = room.roomDepthCm ?? 500;
      bp3d.model.scene.clearItems();
      setGltfPlacedItems([]);
      setCeilingFixtures([]);
      buildRectangularFloorplan(bp3d.model.floorplan, {
        widthCm: width,
        depthCm: depth,
        wallHeightCm: 270,
        wallTexture: {
          url: '/rooms/textures/wallmap.png',
          stretch: true,
          scale: 0,
        },
        floorTexture: {
          url: '/rooms/textures/light_fine_wood.jpg',
          stretch: false,
          scale: 300,
        },
      });
      syncBlueprintViewsAfterLoad(bp3d, {
        onSync: scheduleShellSync,
        drawFootprints: () => drawFootprints(),
      });
      setImportedScene(room);
      setCatalogPlacementItem(null);
      setSelected(null);
      selectedRef.current = null;
      setRevision((current) => current + 1);
      modeRef.current = '3d';
      setMode('3d');
      notify(`${room.name} template loaded - add furniture from Catalog`);
      return;
    }

    setImportedScene(null);
    setGltfPlacedItems([]);
    loadBlueprintPreset(bp3d, room.presetId, presetCallbacks);
  };

  handleLoadRoomRef.current = handleLoadRoom;

  useEffect(() => {
    const cfg = startConfigRef.current;
    if (!cfg || cfg.mode !== PROJECT_START_MODES.TEMPLATE || !cfg.templateId) return;
    if (startTemplateAppliedRef.current) return;
    const saved = window.localStorage.getItem(storageKey);
    if (saved && !isEmptyBlueprintDesign(saved)) return;

    const room = findInspirationRoom(cfg.templateId);
    if (!room || !bp3dRef.current) return;

    startTemplateAppliedRef.current = true;
    window.setTimeout(() => handleLoadRoomRef.current(room), 300);
  }, [startConfig, storageKey]);

  const handleCanvasModeChange = (m) => {
    switchMode(m === '2d' ? 'floorplan' : '3d');
  };

  const handleExport = () => {
    const bp3d = bp3dRef.current;
    if (!bp3d) return;
    const json = bp3d.model.exportSerialized();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectName || 'floorplan'}.json`;
    a.click();
    URL.revokeObjectURL(url);
    notify('Floor plan exported');
  };

  const handleUploadFloorPlan = () => {
    uploadInputRef.current?.click();
  };

  const handleUploadPlanChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const plan = {
        src: reader.result,
        name: file.name,
        uploadedAt: new Date().toISOString(),
      };
      setBackgroundPlan(plan);
      saveBackgroundPlan(projectId, plan);
      notify(`${file.name} loaded as background plan`);
      drawFootprintsRef.current();
    };
    reader.readAsDataURL(file);
    event.target.value = '';
  };

  useEffect(() => {
    const timer = window.setTimeout(() => refreshBlueprintViews(modeRef.current), 150);
    return () => window.clearTimeout(timer);
  }, [mode, refreshBlueprintViews]);

  const startOpeningPlacement = (cfg) => {
    setWallPlacementMode(cfg);
    setSelectedOpening(null);
    setSelected(null);
    selectedRef.current = null;
    setSelectedSurface(null);
    if (modeRef.current !== '3d') {
      switchMode('3d');
    }
    notify(`Click a wall to place ${cfg.label}`);
  };

  const cancelOpeningPlacement = () => {
    setWallPlacementMode(null);
    notify('Opening placement cancelled');
  };

  const updateSelectedOpening = (patch) => {
    if (!selectedOpening?.opening) return;
    setWallOpenings((prev) => prev.map((entry) => (
      entry.id === selectedOpening.opening.id ? { ...entry, ...patch } : entry
    )));
    setSelectedOpening((current) => (
      current ? { ...current, opening: { ...current.opening, ...patch } } : current
    ));
    scheduleShellSync();
    drawFootprintsRef.current();
  };

  const deleteSelectedOpening = () => {
    if (!selectedOpening?.opening) return;
    setWallOpenings((prev) => prev.filter((entry) => entry.id !== selectedOpening.opening.id));
    setSelectedOpening(null);
    scheduleShellSync();
    drawFootprintsRef.current();
    notify('Opening removed');
  };

  const gltfViewerCommonProps = {
    room: importedScene,
    floorSpec,
    roomShell,
    shellRevision: revision,
    selectedFloorRoom: selectedSurface?.kind === 'floor' ? selectedSurface.target : null,
    selectedWallEdge: selectedSurface?.kind === 'wall' ? selectedSurface.target : null,
    onFloorClick: handleShellFloorClick,
    onWallClick: handleShellWallClick,
    placedItems: gltfPlacedItems,
    selectedItemId: selected?.gltfId ?? null,
    onSelectItem: selectGltfItemFromViewer,
    onMoveItem: moveGltfItem,
    showCeiling,
    ceilingTextureUrl: ceilingTexture.url,
    ceilingTextureScale: ceilingTexture.scale,
    ceilingFixtures,
    dropPreviewItem,
    dropPreviewPosition,
    placementItem: catalogPlacementItem,
    onPlaceItem: handleCatalogPlacement,
    onBackgroundClick: handleBackgroundClick,
    wallPlacementMode,
    wallOpenings,
    floorplan: bp3dRef.current?.model?.floorplan ?? null,
    onPlaceWallOpening: placeWallOpeningAtHit,
  };

  // ── Render ───────────────────────────────────────────────────────────
  return (
    <div className={`${styles.root} design-editor-shell`}>

      <header className={styles.globalBar}>
        <button type="button" className={styles.backBtn} onClick={onBack} aria-label="Back to dashboard">
          <ArrowLeft size={15} />
        </button>
        <div className={styles.projectMeta}>
          <span className={styles.projectName}>{projectName}</span>
          {projectId && <span className={styles.projectId}>{projectId}</span>}
        </div>
        <button type="button" className={styles.menuBtn}>File ▾</button>
        <button type="button" className={styles.iconBtn} onClick={handleLoad} title="Load" aria-label="Load design">
          <FolderOpen size={16} strokeWidth={2} />
        </button>
        <button type="button" className={styles.iconBtn} onClick={handleSave} title="Save" aria-label="Save design">
          <Save size={16} strokeWidth={2} />
        </button>
        <div className={styles.globalSpacer} />
        <span className={styles.saveStatus}>
          {lastSavedAt ? `Saved ${formatRelativeUpdatedAt(lastSavedAt)}` : 'Auto-save on'}
        </span>
        <button type="button" className={styles.renderBtn}>Take Render</button>
      </header>

      <div className={styles.workspace}>

        <NavRail activeNav={activeNav} onNavClick={handleNavClick} />

        {activeNav === 'catalog' && (
          <CatalogPanel
            categories={catalogCategories}
            onClose={() => setActiveNav(null)}
            onAddItem={handleAddCatalogItem}
            onDragItemStart={handleDragItemStart}
            onDragItemEnd={clearDropPreview}
          />
        )}
        {activeNav === 'inspiration' && (
          <InspirationPanel
            onClose={() => setActiveNav(null)}
            onLoadRoom={handleLoadRoom}
            onAddItem={handleAddCatalogItem}
          />
        )}
        {activeNav === 'library' && (
          <LibraryPanel
            title="My Library"
            onClose={() => setActiveNav(null)}
          />
        )}
        {activeNav === 'shortlist' && (
          <LibraryPanel title="Shortlist" onClose={() => setActiveNav(null)} />
        )}

        <div className={styles.canvasColumn}>
          <CanvasToolbar
            mode={canvasMode}
            activeTool={editorTool}
            wallPlacementMode={wallPlacementMode}
            onModeChange={handleCanvasModeChange}
            onAddWall={startWallDraw}
            onAddRoom={startRoomDraw}
            onSelectOpening={startOpeningPlacement}
            showCeiling={showCeiling}
            onToggleCeiling={() => setShowCeiling((current) => !current)}
            onUploadFloorPlan={handleUploadFloorPlan}
            onExport={handleExport}
          />

          <main
            className={`${styles.canvasWrap} ${mode === 'floorplan' ? styles.canvasWrapFloorplan : ''} ${dragOverCanvas ? styles.canvasDropActive : ''}`}
            id="canvas-wrap"
            onDragOver={handleCanvasDragOver}
            onDragLeave={handleCanvasDragLeave}
            onDrop={handleCanvasDrop}
          >
            {dragOverCanvas ? <div className={styles.dropPrompt}>Drop item into room</div> : null}
            <input
              ref={uploadInputRef}
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/webp"
              className={styles.hiddenFileInput}
              onChange={handleUploadPlanChange}
            />
            <canvas
              id="floorplanner"
              className={styles.floorplanner}
              style={{
                display: mode === 'floorplan' ? 'block' : 'none',
                cursor: editorTool === 'wall' ? 'crosshair' : undefined,
              }}
            />
            <canvas
              ref={overlayRef}
              id="footprint-overlay"
              className={styles.footprintOverlay}
              style={{
                display: mode === 'floorplan' ? 'block' : 'none',
                pointerEvents: (editorTool === 'room' || wallPlacementMode) ? 'auto' : 'none',
                cursor: wallPlacementMode ? 'crosshair' : editorTool === 'room' ? 'crosshair' : 'default',
              }}
            />
            <div
              id="three-canvas"
              className={styles.threeCanvas}
              style={{
                display: mode === '3d' && USE_LEGACY_JS_RENDERER && !importedScene ? 'block' : 'none',
                touchAction: 'none',
              }}
            />
            {mode === '3d' && USE_LEGACY_JS_RENDERER && importedScene ? (
              <ErrorBoundary>
                <Suspense fallback={null}>
                  <ImportedSceneViewer
                    room={importedScene}
                    placedItems={importedTemplateItems}
                    selectedItem={selected?.item ?? null}
                    onSelectItem={selectItem}
                    onMoveItem={moveImportedTemplateItem}
                    onClose={() => switchMode('floorplan')}
                  />
                </Suspense>
              </ErrorBoundary>
            ) : null}
            {mode === '3d' && !USE_LEGACY_JS_RENDERER ? (
              <div className={styles.canvasStage3d}>
                <ErrorBoundary>
                  <Suspense fallback={null}>
                    <GltfDesignViewer
                      ref={gltfViewerRef}
                      {...gltfViewerCommonProps}
                      onClose={() => switchMode('floorplan')}
                      showCaption={Boolean(importedScene)}
                    />
                  </Suspense>
                </ErrorBoundary>
              </div>
            ) : null}
          </main>
        </div>

        <aside className={styles.rightPanel}>
          {selectedOpening && !selected ? (
            <div className={styles.inspector}>
              <div className={styles.sidebarHead}>Wall opening</div>
              <div className={styles.inspectorName}>
                {selectedOpening.opening.type === 'doorway'
                  ? 'Doorway'
                  : selectedOpening.opening.type === 'window'
                    ? 'Window'
                    : 'Door'}
              </div>
              <div className={styles.dimGrid}>
                <label className={styles.dimLabel}>
                  <span>W</span>
                  <input
                    type="number"
                    className={styles.dimInput}
                    value={selectedOpening.opening.widthCm}
                    step={5}
                    min={60}
                    onChange={(e) => updateSelectedOpening({ widthCm: +e.target.value })}
                  />
                  <span className={styles.dimUnit}>cm</span>
                </label>
                <label className={styles.dimLabel}>
                  <span>H</span>
                  <input
                    type="number"
                    className={styles.dimInput}
                    value={selectedOpening.opening.heightCm}
                    step={5}
                    min={100}
                    onChange={(e) => updateSelectedOpening({ heightCm: +e.target.value })}
                  />
                  <span className={styles.dimUnit}>cm</span>
                </label>
                {selectedOpening.opening.type === 'window' ? (
                  <label className={styles.dimLabel}>
                    <span>S</span>
                    <input
                      type="number"
                      className={styles.dimInput}
                      value={selectedOpening.opening.elevationCm}
                      step={5}
                      min={0}
                      onChange={(e) => updateSelectedOpening({ elevationCm: +e.target.value })}
                    />
                    <span className={styles.dimUnit}>sill</span>
                  </label>
                ) : null}
              </div>
              {selectedOpening.opening.type === 'door' ? (
                <div className={styles.inspectorActions}>
                  {['left', 'right'].map((dir) => (
                    <button
                      key={dir}
                      type="button"
                      className={styles.actionBtn}
                      onClick={() => updateSelectedOpening({ swingDir: dir })}
                    >
                      Swing {dir}
                    </button>
                  ))}
                </div>
              ) : null}
              <div className={styles.inspectorActions}>
                {(['doorway', 'door', 'window'].filter((type) => type !== selectedOpening.opening.type)).map((type) => (
                  <button
                    key={type}
                    type="button"
                    className={styles.actionBtn}
                    onClick={() => updateSelectedOpening({
                      type,
                      elevationCm: type === 'window'
                        ? (selectedOpening.opening.elevationCm || 90)
                        : 0,
                      swingDir: type === 'door' ? 'left' : undefined,
                    })}
                  >
                    {type === 'doorway' ? 'Doorway' : type === 'door' ? 'Door' : 'Window'}
                  </button>
                ))}
              </div>
              <div className={styles.inspectorActions}>
                <button type="button" className={`${styles.actionBtn} ${styles.deleteBtn}`} onClick={deleteSelectedOpening}>
                  <Trash2 size={12} /> Remove opening
                </button>
              </div>
            </div>
          ) : selected ? (
            <div className={styles.inspector}>
              <div className={styles.sidebarHead}>Selected item</div>
              <div className={styles.inspectorHero}>
                {selected.thumbnail ? (
                  <img
                    src={selected.thumbnail}
                    alt={selected.name}
                    className={styles.inspectorThumb}
                  />
                ) : (
                  <div className={styles.inspectorThumbPlaceholder} />
                )}
                <div className={styles.inspectorName}>{selected.name}</div>
              </div>
              <div className={styles.dimGrid}>
                <label className={styles.dimLabel}>
                  <span>W</span>
                  <input
                    type="number"
                    className={styles.dimInput}
                    value={selected.width}
                    step={10}
                    min={10}
                    onChange={(e) => resizeDim('width', +e.target.value)}
                  />
                  <span className={styles.dimUnit}>cm</span>
                </label>
                <label className={styles.dimLabel}>
                  <span>D</span>
                  <input
                    type="number"
                    className={styles.dimInput}
                    value={selected.depth}
                    step={10}
                    min={10}
                    onChange={(e) => resizeDim('depth', +e.target.value)}
                  />
                  <span className={styles.dimUnit}>cm</span>
                </label>
                <label className={styles.dimLabel}>
                  <span>H</span>
                  <input
                    type="number"
                    className={styles.dimInput}
                    value={selected.height}
                    step={10}
                    min={10}
                    onChange={(e) => resizeDim('height', +e.target.value)}
                  />
                  <span className={styles.dimUnit}>cm</span>
                </label>
              </div>
              <div className={styles.inspectorActions}>
                <button type="button" className={styles.actionBtn} onClick={() => rotateSelectedItemBy(-Math.PI / 2)}>
                  ↺ 90°
                </button>
                <button type="button" className={styles.actionBtn} onClick={() => rotateSelectedItemBy(Math.PI / 2)}>
                  ↻ 90°
                </button>
                <button type="button" className={styles.actionBtn} onClick={() => rotateSelectedItemBy(Math.PI)}>
                  ↩ 180°
                </button>
              </div>
              <p className={styles.textureHint}>Note rotation offset → add to catalogData rotationOffsetY</p>
              <div className={styles.inspectorActions}>
                <button type="button" className={styles.actionBtn} onClick={cloneSelectedItem}>
                  <Copy size={12} /> Clone
                </button>
                <button type="button" className={`${styles.actionBtn} ${styles.deleteBtn}`} onClick={deleteSelectedItem}>
                  <Trash2 size={12} /> Delete
                </button>
              </div>
            </div>
          ) : importedScene ? (
            <div className={styles.importedInspector}>
              <div className={styles.sidebarHead}>Editable template</div>
              <strong>{importedScene.name}</strong>
              <span className={styles.importedFormat}>{importedScene.style}</span>
              <p>
                The imported room shell is fixed. Add modern catalog furniture, then select it in the
                scene to move, rotate, resize, clone or delete it.
              </p>
            </div>
          ) : (
            <div className={styles.inspectorEmpty}>
              Click an item in the scene to inspect it
            </div>
          )}

          {!importedScene ? (
            <>
              <div className={styles.rightPanelSection}>
                <div className={styles.sidebarHead}>Doors &amp; windows</div>
                <p className={styles.textureHint}>
                  {wallPlacementMode
                    ? `Placing: ${wallPlacementMode.label} — click a wall in 3D`
                    : 'Pick a type, then click a wall in 3D view'}
                </p>
                <div className={styles.openingList}>
                  {OPENING_TYPES.map((cfg) => (
                    <button
                      key={`${cfg.type}-${cfg.label}`}
                      type="button"
                      className={`${styles.openingBtn} ${wallPlacementMode?.label === cfg.label ? styles.openingBtnActive : ''}`}
                      onClick={() => startOpeningPlacement(cfg)}
                    >
                      <span>{cfg.label}</span>
                      <span className={styles.openingMeta}>{cfg.widthCm}×{cfg.heightCm}</span>
                    </button>
                  ))}
                </div>
                {wallPlacementMode ? (
                  <button
                    type="button"
                    className={`${styles.actionBtn} ${styles.cancelOpeningBtn}`}
                    onClick={cancelOpeningPlacement}
                  >
                    Cancel placement
                  </button>
                ) : null}
              </div>
              <div className={styles.rightPanelSection}>
                <div className={styles.sidebarHead}>Ceiling</div>
                <button
                  type="button"
                  className={styles.actionBtn}
                  style={{ width: '100%', marginBottom: 8 }}
                  onClick={() => setShowCeiling((current) => !current)}
                >
                  {showCeiling ? 'Hide ceiling' : 'Show ceiling'}
                </button>
                <div id="ceiling-textures" className={styles.textureGrid}>
                  {ceilingTextures.map((texture) => (
                    <button
                      type="button"
                      key={texture.url}
                      title={texture.name}
                      className={`${styles.textureBlock} ${selectedTexture === `ceiling:${texture.url}` ? styles.selectedTexture : ''}`}
                      onClick={() => applyTexture('ceiling', texture)}
                    >
                      <img src={texture.url} alt={texture.name} />
                    </button>
                  ))}
                </div>
              </div>
              <div className={styles.rightPanelSection}>
                <div className={styles.sidebarHead}>Floor</div>
                <p className={styles.textureHint}>Click a floor in 3D to target it</p>
                <div id="floor-textures" className={styles.textureGrid}>
                  {floorTextures.map((texture) => (
                    <button
                      type="button"
                      key={texture.url}
                      title={texture.name}
                      className={`${styles.textureBlock} ${selectedTexture === `floor:${texture.url}` ? styles.selectedTexture : ''}`}
                      onClick={() => applyTexture('floor', texture)}
                    >
                      <img src={texture.url} alt={texture.name} />
                    </button>
                  ))}
                </div>
              </div>
              <div className={styles.rightPanelSection}>
                <div className={styles.sidebarHead}>
                  Walls {selectedSurface?.kind === 'wall' ? '(wall selected)' : ''}
                </div>
                <div className={styles.scopeToggle}>
                  {(['selected', 'all']).map((scope) => (
                    <button
                      key={scope}
                      type="button"
                      className={`${styles.scopeBtn} ${wallScope === scope ? styles.scopeBtnActive : ''}`}
                      onClick={() => setWallScope(scope)}
                    >
                      {scope === 'selected' ? 'This wall' : 'All walls'}
                    </button>
                  ))}
                </div>
                <div id="wall-textures" className={styles.textureGrid}>
                  {wallTextures.map((texture) => (
                    <button
                      type="button"
                      key={texture.url}
                      title={texture.name}
                      className={`${styles.textureBlock} ${selectedTexture === `wall:${texture.url}` ? styles.selectedTexture : ''}`}
                      onClick={() => applyTexture('wall', texture)}
                    >
                      <img src={texture.url} alt={texture.name} />
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : null}
        </aside>

      </div>
    </div>
  );
}
