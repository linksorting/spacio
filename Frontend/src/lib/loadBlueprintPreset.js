import { USE_LEGACY_JS_RENDERER } from './rendererConfig';
import { resolveCatalogModelUrl } from './resolveCatalogModelUrl';
import { isBlockedModelUrl } from './modelFormats';
import { createModelLoadId, normalizeItemType, settleItemOnFloor } from './blueprintHelpers';
import {
  applyBlueprintWallHeight,
  buildPresetFloorplan,
  buildRectangularFloorplan,
  syncBlueprintViewsAfterLoad,
} from './blueprintRoomLayout';
import { createWallOpening } from './wallOpenings';

const delay = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms));

/** Apply preset x/z/rotation and correct floor height after async model load. */
function applyPresetTransform(item, spec) {
  const type = Number(spec.type ?? 1);

  if (type === 2) {
    item.position.x = spec.x ?? 0;
    item.position.z = spec.z ?? 0;
    item.rotation.y = spec.rot ?? 0;
    item.position_set = true;
    return;
  }

  item.position.x = spec.x ?? 0;
  item.position.z = spec.z ?? 0;
  item.rotation.y = spec.rot ?? 0;
  item.position.y = item.halfSize?.y ?? item.position.y;
  item.position_set = true;
}

/**
 * Load a furnished room preset into Blueprint3D.
 * @param {object} bp3d
 * @param {string} presetId
 * @param {{
 *   switchMode: (mode: 'floorplan' | '3d') => void,
 *   drawFootprints?: () => void,
 *   onSync?: () => void,
 *   notify?: (message: string) => void,
 *   onGltfItems?: (items: object[]) => void,
 *   onWallOpenings?: (openings: object[]) => void,
 *   onCeilingFixtures?: (fixtures: object[]) => void,
 * }} callbacks
 */
export async function loadBlueprintPreset(bp3d, presetId, callbacks) {
  const { notify } = callbacks;
  if (!bp3d) return;

  let preset;
  try {
    const res = await fetch(`/presets/${presetId}.json`);
    if (!res.ok) throw new Error(`Preset not found: ${presetId}`);
    preset = await res.json();
  } catch (err) {
    console.error('Failed to load preset:', err);
    notify?.(`Could not load preset "${presetId}"`);
    return;
  }

  await loadBlueprintPresetData(bp3d, preset, callbacks);
}

/**
 * Load an already-built furnished room preset into Blueprint3D.
 * @param {object} bp3d
 * @param {object} preset
 * @param {Parameters<typeof loadBlueprintPreset>[2]} callbacks
 */
export async function loadBlueprintPresetData(bp3d, preset, callbacks) {
  const {
    switchMode,
    drawFootprints,
    onSync,
    notify,
    onGltfItems,
    onWallOpenings,
    onCeilingFixtures,
  } = callbacks;
  if (!bp3d || !preset) return;

  bp3d.model.scene.clearItems();

  const fp = bp3d.model.floorplan;
  const wallHeightCm = preset.roomHeight ?? 270;

  applyBlueprintWallHeight(bp3d, wallHeightCm);
  const layoutOptions = {
    wallHeightCm,
    wallColor: preset.wallColor ?? null,
    wallTexture: preset.wallTexture
      ? {
          url: preset.wallTexture,
          stretch: preset.wallTextureStretch ?? true,
          scale: preset.wallTextureScale ?? 0,
        }
      : null,
    floorTexture: preset.floorTexture
      ? {
          url: preset.floorTexture,
          stretch: preset.floorTextureStretch ?? false,
          scale: preset.floorTextureScale ?? 300,
        }
      : null,
  };
  const createdWalls = preset.layout?.corners?.length && preset.layout?.walls?.length
    ? buildPresetFloorplan(fp, preset.layout, layoutOptions)
    : (() => {
        buildRectangularFloorplan(fp, {
          widthCm: preset.roomWidth ?? 500,
          depthCm: preset.roomDepth ?? 450,
          ...layoutOptions,
        });
        return fp.getWalls?.() ?? [];
      })();

  const presetOpenings = (preset.openings ?? []).flatMap((entry) => {
    const wall = createdWalls[entry.wallIndex];
    if (!wall) return [];
    return [createWallOpening(wall, entry.offsetAlongWall ?? 0.5, {
      type: entry.type ?? 'door',
      widthCm: entry.widthCm ?? 90,
      heightCm: entry.heightCm ?? 210,
      elevCm: entry.elevationCm ?? 0,
      label: entry.label ?? entry.type ?? 'Opening',
    })];
  });
  onWallOpenings?.(presetOpenings);
  onCeilingFixtures?.(preset.ceilingFixtures ?? []);

  await delay(120);

  const specs = (preset.items ?? []).map((item, index) => ({
    ...item,
    index,
    url: (item.modelUrl ?? '').startsWith('/') ? item.modelUrl : `/${item.modelUrl ?? ''}`,
  }));

  await delay(150);

  const finish = () => {
    syncBlueprintViewsAfterLoad(bp3d, { onSync, drawFootprints });
    switchMode('3d');
    if (USE_LEGACY_JS_RENDERER) {
      bp3d.three.centerCamera?.();
      bp3d.three.needsUpdate?.();
    }
    notify?.(`Loaded ${preset.name}`);
  };

  if (!USE_LEGACY_JS_RENDERER) {
    const gltfItems = specs.flatMap((spec) => {
      const modelUrl = resolveCatalogModelUrl(spec.url);
      if (!modelUrl) {
        console.warn(`Preset item skipped (no GLTF/GLB): ${spec.name ?? spec.url}`);
        return [];
      }
      if (isBlockedModelUrl(modelUrl)) {
        console.warn(`Preset item skipped (broken model): ${spec.name ?? modelUrl}`);
        return [];
      }
      return [{
        id: createModelLoadId(),
        modelUrl,
        name: spec.name ?? 'Item',
        thumbnail: '',
        widthCm: spec.widthCm ?? 100,
        depthCm: spec.depthCm ?? 100,
        heightCm: spec.heightCm ?? 100,
        x: (spec.x ?? 0) / 100,
        z: (spec.z ?? 0) / 100,
        rotationY: spec.rot ?? 0,
      }];
    });
    onGltfItems?.(gltfItems);
    await delay(200);
    finish();
    return;
  }

  const THREE = window.THREE;
  let loaded = 0;
  const expected = specs.length;

  const onItemLoaded = (loadedItem) => {
    const idx = loadedItem.metadata?.presetIndex;
    if (idx === undefined || idx === null) return;
    const spec = specs[idx];
    if (!spec) return;
    applyPresetTransform(loadedItem, spec);
    settleItemOnFloor(loadedItem, fp);
    loaded += 1;
    bp3d.three.needsUpdate?.();
    if (loaded >= expected) {
      bp3d.model.scene.itemLoadedCallbacks.remove(onItemLoaded);
      finish();
    }
  };

  if (expected > 0) {
    bp3d.model.scene.itemLoadedCallbacks.add(onItemLoaded);
  }

  specs.forEach((spec) => {
    const itemType = normalizeItemType(spec.type);
    const position = THREE
      ? new THREE.Vector3(spec.x ?? 0, 0, spec.z ?? 0)
      : null;

    bp3d.model.scene.addItem(
      itemType,
      spec.url,
      {
        itemType,
        modelUrl: spec.url,
        itemName: spec.name ?? 'Item',
        resizable: true,
        presetIndex: spec.index,
      },
      position,
      spec.rot ?? 0,
      THREE ? new THREE.Vector3(1, 1, 1) : null,
      false,
    );
  });

  if (expected === 0) {
    await delay(200);
    finish();
    return;
  }

  window.setTimeout(() => {
    bp3d.model.scene.itemLoadedCallbacks.remove(onItemLoaded);
    if (loaded < expected) {
      console.warn(`Preset "${presetId}": ${loaded}/${expected} items loaded`);
      finish();
    }
  }, 12000);
}

/** @deprecated Use loadBlueprintPreset */
export const loadPreset = loadBlueprintPreset;
