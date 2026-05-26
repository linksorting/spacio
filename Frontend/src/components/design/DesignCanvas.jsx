import React, { lazy, Suspense, useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { ArrowLeft, Copy, FolderOpen, Save, Trash2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import NavRail from '@/components/NavRail';
import CatalogPanel from '@/components/CatalogPanel';
import InspirationPanel from '@/components/InspirationPanel';
import LibraryPanel from '@/components/LibraryPanel';
import CanvasToolbar from '@/components/CanvasToolbar';
import { floorTextures, wallTextures, loadBlueprintCatalog } from '@/lib/blueprintCatalog';
import {
  CATALOG_CATEGORIES,
  buildCatalogFlat,
  buildLegacyCatalogCategories,
  findInspirationRoom,
} from '@/lib/catalogData';
import { createModelLoadId, attachBlueprintFloorplanSync, extractBlueprintRoomShell, getCatalogPlacementPosition, getFloorSpecFromBlueprint, normalizeItemType, settleItemOnFloor } from '@/lib/blueprintHelpers';
import { isSupportedModelUrl } from '@/lib/modelFormats';
import { loadBlueprintPreset } from '@/lib/loadBlueprintPreset';
import { USE_LEGACY_JS_RENDERER } from '@/lib/rendererConfig';
import { resolveCatalogModelUrl } from '@/lib/resolveCatalogModelUrl';
import { clientToFloorplanCoords, createRectangularRoom, snapWorldPointMeters } from '@/lib/floorplanDraw';
import {
  drawFloorPlanSymbol,
  preloadFloorPlanSymbols,
  setFloorPlanSymbolRedrawCallback,
} from '@/lib/floorPlanSymbolCanvas';
import { BLANK_ROOM, isEmptyBlueprintDesign, STARTER_ROOM, storageKeyForProject } from '@/lib/blueprintStarterRoom';
import {
  loadStoredBackgroundPlan,
  PROJECT_START_MODES,
  readPendingBackgroundPlan,
  saveBackgroundPlan,
} from '@/lib/projectStart';
import { preloadModel } from './LoadedModel';
import styles from './DesignCanvas.module.css';

const ImportedSceneViewer = lazy(() => import('./ImportedSceneViewer'));
const GltfDesignViewer = lazy(() => import('./GltfDesignViewer'));

const notify = (message) => toast({ title: message, duration: 3000 });

const GRID_SNAP_CM = 10;
const ROTATION_SNAP_RAD = (15 * Math.PI) / 180;
const CATALOG_DRAG_TYPE = 'application/x-designer-catalog-item';
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

const applySnapConfiguration = (BP3D, enabled) => {
  try {
    const Config = BP3D.Core?.Configuration ?? BP3D.Configuration ?? null;
    if (!Config) return;
    if (typeof Config.setValue === 'function') {
      Config.setValue('snapToGrid', enabled);
      Config.setValue('gridSpacing', GRID_SNAP_CM);
      Config.setValue('rotationStep', 15);
      Config.setValue('dimUnit', BP3D.Core?.dimInch ?? 'inch');
      return;
    }
    if (Config.snapToGrid !== undefined) {
      Config.snapToGrid = enabled;
      Config.gridSpacing = GRID_SNAP_CM;
      Config.rotationStep = 15;
    }
  } catch {
    // Stock blueprint3d build may not expose snap config keys.
  }
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
  const [revision, setRevision] = useState(0);
  const gltfPlacedItemsRef = useRef([]);
  const shellSyncTimerRef = useRef(null);
  const gltfViewerRef = useRef(null);
  const [backgroundPlan, setBackgroundPlan] = useState(() => loadStoredBackgroundPlan(projectId));
  const backgroundPlanRef = useRef(backgroundPlan);

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

  const catalogCategories = useMemo(
    () => (USE_LEGACY_JS_RENDERER
      ? [...CATALOG_CATEGORIES, ...legacyCategories]
      : CATALOG_CATEGORIES),
    [legacyCategories],
  );
  const canvasMode = mode === 'floorplan' ? '2d' : '3d';
  const floorSpec = useMemo(
    () => getFloorSpecFromBlueprint(bp3dRef.current),
    [revision, mode],
  );
  const roomShell = useMemo(
    () => (importedScene?.sceneModelUrl ? null : extractBlueprintRoomShell(bp3dRef.current)),
    [revision, mode, importedScene],
  );
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

  const selectGltfItem = (entry) => {
    if (!entry) {
      selectedRef.current = null;
      setSelected(null);
      drawFootprintsRef.current();
      return;
    }
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

  const selectItem = (item) => {
    if (!item) return;
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
    canvas.width = fp.width;
    canvas.height = fp.height;

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

  const handleShellFloorClick = useCallback((room) => {
    setSelectedSurface({ kind: 'floor', target: room });
  }, []);

  const handleShellWallClick = useCallback((edge) => {
    setSelectedSurface({ kind: 'wall', target: edge });
  }, []);

  // ── Init Blueprint3D ────────────────────────────────────────────────
  useEffect(() => {
    const BP3D = window.BP3D;
    if (!BP3D) {
      notify('Blueprint3D assets failed to load');
      return;
    }

    const blueprint3d = new BP3D.Blueprint3d({
      floorplannerElement: 'floorplanner',
      threeElement: '#three-canvas',
      textureDir: 'rooms/textures/',
      itemLoadingItem: null,
    });
    bp3dRef.current = blueprint3d;

    applySnapConfiguration(BP3D, true);

    const Item = BP3D.Items?.Item;
    const FloorItem = BP3D.Items?.FloorItem;
    if (Item && !Item.__snapPatched) {
      Item.__snapPatched = true;

      if (FloorItem?.prototype?.moveToPosition) {
        const originalMove = FloorItem.prototype.moveToPosition;
        FloorItem.prototype.moveToPosition = function moveToPosition(vec3, intersection) {
          if (snapOnRef.current && vec3) {
            vec3.x = Math.round(vec3.x / GRID_SNAP_CM) * GRID_SNAP_CM;
            vec3.z = Math.round(vec3.z / GRID_SNAP_CM) * GRID_SNAP_CM;
          }
          return originalMove.call(this, vec3, intersection);
        };
      }

      const originalRotate = Item.prototype.rotate;
      Item.prototype.rotate = function rotate(intersection) {
        originalRotate.call(this, intersection);
        if (snapOnRef.current) {
          this.rotation.y = Math.round(this.rotation.y / ROTATION_SNAP_RAD) * ROTATION_SNAP_RAD;
        }
      };

      const originalReleased = Item.prototype.clickReleased;
      Item.prototype.clickReleased = function clickReleased() {
        originalReleased.call(this);
        drawFootprintsRef.current();
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
    });
    blueprint3d.model.floorplan.fireOnRedraw(() => {
      drawFootprintsRef.current();
      scheduleShellSync();
    });

    attachBlueprintFloorplanSync(blueprint3d.model.floorplan, scheduleShellSync);

    const fpModes = BP3D.Floorplanner?.floorplannerModes;
    blueprint3d.floorplanner.modeResetCallbacks.add((nextMode) => {
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
      bp3dRef.current = null;
    };
  // Init once per project — do NOT depend on mode or draw callbacks (would destroy BP3D on tab switch)
  }, [storageKey, refreshBlueprintViews, scheduleShellSync]);

  // ── Mode switching ───────────────────────────────────────────────────
  const switchMode = (next) => {
    const bp3d = bp3dRef.current;
    if (!bp3d) return;
    const prev = modeRef.current;
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
    }
    window.requestAnimationFrame(() => {
      window.setTimeout(() => refreshBlueprintViews(next), 50);
    });
  };

  // ── Snap toggle ──────────────────────────────────────────────────────
  const toggleSnap = (on) => {
    setSnapOn(on);
    snapOnRef.current = on;
    const BP3D = window.BP3D;
    applySnapConfiguration(BP3D, on);
  };

  // ── Draw mode helpers ────────────────────────────────────────────────
  const setFloorplannerMode = (m) => {
    const bp3d = bp3dRef.current;
    const modes = window.BP3D?.Floorplanner?.floorplannerModes;
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
      const modes = window.BP3D?.Floorplanner?.floorplannerModes;
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

      preloadModel(modelUrl);

      const placement = dropPlacement ?? getCatalogPlacementPosition(
        bp3d.model.floorplan,
        gltfPlacedItemsRef.current.length,
      );
      const entry = {
        id: createModelLoadId(),
        modelUrl,
        name: item.name,
        thumbnail: item.thumbnail ?? '',
        widthCm: item.widthCm ?? 100,
        depthCm: item.depthCm ?? 100,
        heightCm: item.heightCm ?? 100,
        x: placement.x / 100,
        z: (placement.z ?? placement.y) / 100,
        rotationY: 0,
      };
      setGltfPlacedItems((prev) => [...prev, entry]);
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

  const addItem = async (item, dropPlacement = null) => {
    if (modeRef.current !== '3d') {
      switchMode('3d');
      await new Promise((resolve) => window.setTimeout(resolve, 120));
    }
    try {
      await placeCatalogItem(item, dropPlacement);
      if (USE_LEGACY_JS_RENDERER && !importedScene) refreshBlueprintViews('3d');
      notify(`${item.name} added`);
    } catch (err) {
      console.error(err);
      notify(`Could not add ${item.name}`);
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

  const rotateSelectedItem = (direction) => {
    if (!selected) return;
    if (selected.gltfId) {
      setGltfPlacedItems((prev) => prev.map((entry) => {
        if (entry.id !== selected.gltfId) return entry;
        let rotationY = entry.rotationY + direction * ROTATION_SNAP_RAD;
        rotationY = Math.round(rotationY / ROTATION_SNAP_RAD) * ROTATION_SNAP_RAD;
        return { ...entry, rotationY };
      }));
      return;
    }
    selected.item.rotation.y += direction * ROTATION_SNAP_RAD;
    selected.item.rotation.y = Math.round(selected.item.rotation.y / ROTATION_SNAP_RAD) * ROTATION_SNAP_RAD;
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
    setGltfPlacedItems((prev) => prev.map((entry) => (
      entry.id === id ? { ...entry, x: sx, z: sz } : entry
    )));
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
    } else {
      const targets = selectedSurface?.kind === 'wall'
        ? [selectedSurface.target]
        : bp3d.model.floorplan.wallEdges();
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
    const bp3d = bp3dRef.current;
    if (!bp3d) return;
    const serialized = JSON.parse(bp3d.model.exportSerialized());
    if (importedScene) serialized.designerImportedTemplateId = importedScene.id;
    if (!USE_LEGACY_JS_RENDERER) serialized.designerGltfItems = gltfPlacedItems;
    window.localStorage.setItem(storageKey, JSON.stringify(serialized));
    saveBackgroundPlan(projectId, backgroundPlanRef.current);
    notify('Design saved');
  };

  const handleLoad = () => {
    const bp3d = bp3dRef.current;
    const saved = window.localStorage.getItem(storageKey);
    if (!bp3d || !saved) {
      notify('No saved design found');
      return;
    }
    bp3d.model.loadSerialized(isEmptyBlueprintDesign(saved) ? STARTER_ROOM : saved);
    restoreImportedScene(saved);
    if (!USE_LEGACY_JS_RENDERER) {
      try {
        setGltfPlacedItems(JSON.parse(saved)?.designerGltfItems ?? []);
      } catch {
        setGltfPlacedItems([]);
      }
    }
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
    bp3dRef.current.model.loadSerialized(STARTER_ROOM);
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
    if (modelUrl) preloadModel(modelUrl);
  };

  const handleAddCatalogItem = (item) => {
    preloadCatalogModel(item);
    addItem({
      name: item.name,
      model: item.modelUrl,
      previewModelUrl: item.previewModelUrl,
      type: item.type,
      thumbnail: item.thumbnail,
      widthCm: item.widthCm,
      depthCm: item.depthCm,
      heightCm: item.heightCm,
    });
  };

  const handleDragItemStart = (event, item) => {
    preloadCatalogModel(item);
    event.dataTransfer.effectAllowed = 'copy';
    event.dataTransfer.setData(CATALOG_DRAG_TYPE, JSON.stringify({
      name: item.name,
      model: item.modelUrl,
      previewModelUrl: item.previewModelUrl,
      type: item.type,
      thumbnail: item.thumbnail,
      widthCm: item.widthCm,
      depthCm: item.depthCm,
      heightCm: item.heightCm,
    }));
  };

  const handleCanvasDragOver = (event) => {
    if (!event.dataTransfer.types.includes(CATALOG_DRAG_TYPE)) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
    setDragOverCanvas(true);
  };

  const handleCanvasDragLeave = (event) => {
    if (event.currentTarget.contains(event.relatedTarget)) return;
    setDragOverCanvas(false);
  };

  const handleCanvasDrop = (event) => {
    const serialized = event.dataTransfer.getData(CATALOG_DRAG_TYPE);
    if (!serialized) return;
    event.preventDefault();
    setDragOverCanvas(false);

    const item = JSON.parse(serialized);
    const wrap = document.getElementById('canvas-wrap');
    const floorplanner = bp3dRef.current?.floorplanner;

    if (modeRef.current === '3d' && !USE_LEGACY_JS_RENDERER && gltfViewerRef.current && wrap) {
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

  const handleLoadRoom = (room) => {
    const bp3d = bp3dRef.current;
    if (!bp3d) return;
    if (room.editablePresetId) {
      setImportedScene(null);
      setGltfPlacedItems([]);
      loadBlueprintPreset(bp3d, room.editablePresetId, {
        switchMode,
        drawFootprints: () => drawFootprintsRef.current(),
        notify,
        onGltfItems: (items) => {
          setGltfPlacedItems(items);
          setRevision((current) => current + 1);
        },
      });
      return;
    }
    if (room.sceneModelUrl) {
      const fp = bp3d.model.floorplan;
      const width = room.roomWidthCm ?? 600;
      const depth = room.roomDepthCm ?? 500;
      bp3d.model.scene.clearItems();
      setGltfPlacedItems([]);
      fp.reset();
      const corners = [
        fp.newCorner(-width / 2, -depth / 2),
        fp.newCorner(width / 2, -depth / 2),
        fp.newCorner(width / 2, depth / 2),
        fp.newCorner(-width / 2, depth / 2),
      ];
      corners.forEach((corner, index) => {
        const wall = fp.newWall(corner, corners[(index + 1) % corners.length]);
        wall.frontTexture.url = '/rooms/textures/wallmap.png';
        wall.backTexture.url = '/rooms/textures/wallmap.png';
      });
      fp.update();
      fp.getRooms?.().forEach((floorRoom) => {
        floorRoom.setTexture('/rooms/textures/light_fine_wood.jpg', false, 300);
      });
      setImportedScene(room);
      modeRef.current = '3d';
      setMode('3d');
      setSelected(null);
      selectedRef.current = null;
      setRevision((current) => current + 1);
      notify(`${room.name} template loaded - add furniture from Catalog`);
      return;
    }
    setImportedScene(null);
    setGltfPlacedItems([]);
    loadBlueprintPreset(bp3d, room.presetId, {
      switchMode,
      drawFootprints: () => drawFootprintsRef.current(),
      notify,
      onGltfItems: (items) => {
        setGltfPlacedItems(items);
        setRevision((current) => current + 1);
      },
    });
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
    onSelectItem: selectGltfItem,
    onMoveItem: moveGltfItem,
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
        <span className={styles.saveStatus}>Last saved locally</span>
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
          />
        )}
        {activeNav === 'inspiration' && (
          <InspirationPanel
            onClose={() => setActiveNav(null)}
            onLoadRoom={handleLoadRoom}
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
            onModeChange={handleCanvasModeChange}
            onAddWall={startWallDraw}
            onAddRoom={startRoomDraw}
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
                pointerEvents: editorTool === 'room' ? 'auto' : 'none',
                cursor: editorTool === 'room' ? 'crosshair' : 'default',
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
            ) : null}
            {mode === '3d' && !USE_LEGACY_JS_RENDERER ? (
              <div className={styles.canvasStage3d}>
                <Suspense fallback={null}>
                  <GltfDesignViewer
                    ref={gltfViewerRef}
                    {...gltfViewerCommonProps}
                    onClose={() => switchMode('floorplan')}
                    showCaption={Boolean(importedScene)}
                  />
                </Suspense>
              </div>
            ) : null}
          </main>
        </div>

        <aside className={styles.rightPanel}>
          {selected ? (
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
                <button type="button" className={styles.actionBtn} onClick={() => rotateSelectedItem(-1)}>
                  Rotate -
                </button>
                <button type="button" className={styles.actionBtn} onClick={() => rotateSelectedItem(1)}>
                  Rotate +
                </button>
              </div>
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
                <div className={styles.sidebarHead}>Walls</div>
                <p className={styles.textureHint}>Click a wall in 3D to target one face</p>
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
