import { USE_LEGACY_JS_RENDERER } from './rendererConfig';
import { resolveCatalogModelUrl } from './resolveCatalogModelUrl';
import { createModelLoadId, normalizeItemType, settleItemOnFloor } from './blueprintHelpers';

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

function applyWallHeight(bp3d, heightCm) {
  const Config = window.BP3D?.Core?.Configuration;
  if (Config?.setValue) {
    Config.setValue('wallHeight', heightCm);
  }
  bp3d?.model?.floorplan?.getWalls?.().forEach((wall) => {
    wall.height = heightCm;
  });
}

/**
 * Load a furnished room preset into Blueprint3D.
 * @param {object} bp3d
 * @param {string} presetId
 * @param {{
 *   switchMode: (mode: 'floorplan' | '3d') => void,
 *   drawFootprints?: () => void,
 *   notify?: (message: string) => void,
 *   onGltfItems?: (items: object[]) => void,
 * }} callbacks
 */
export async function loadBlueprintPreset(bp3d, presetId, callbacks) {
  const { switchMode, drawFootprints, notify, onGltfItems } = callbacks;
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

  bp3d.model.scene.clearItems();
  bp3d.model.floorplan.reset();

  const w = preset.roomWidth ?? 500;
  const d = preset.roomDepth ?? 450;
  const fp = bp3d.model.floorplan;

  applyWallHeight(bp3d, preset.roomHeight ?? 270);

  const c1 = fp.newCorner(-w / 2, -d / 2);
  const c2 = fp.newCorner(w / 2, -d / 2);
  const c3 = fp.newCorner(w / 2, d / 2);
  const c4 = fp.newCorner(-w / 2, d / 2);

  const wallTex = preset.wallTexture
    ? {
        url: preset.wallTexture,
        stretch: preset.wallTextureStretch ?? true,
        scale: preset.wallTextureScale ?? 0,
      }
    : null;

  [[c1, c2], [c2, c3], [c3, c4], [c4, c1]].forEach(([start, end]) => {
    const wall = fp.newWall(start, end);
    if (wallTex) {
      wall.frontTexture = { ...wallTex };
      wall.backTexture = { ...wallTex };
    }
    if (preset.roomHeight) wall.height = preset.roomHeight;
  });

  fp.update();
  await delay(120);

  const rooms = fp.getRooms?.() ?? [];
  rooms.forEach((room) => {
    if (preset.floorTexture) {
      room.setTexture(
        preset.floorTexture,
        preset.floorTextureStretch ?? false,
        preset.floorTextureScale ?? 300,
      );
    }
  });

  const specs = (preset.items ?? []).map((item, index) => ({
    ...item,
    index,
    url: item.modelUrl.startsWith('/') ? item.modelUrl : `/${item.modelUrl}`,
  }));

  await delay(150);

  const finish = () => {
    fp.update?.();
    bp3d.model.floorplan.update?.();
    switchMode('3d');
    if (USE_LEGACY_JS_RENDERER) {
      bp3d.three.centerCamera?.();
      bp3d.three.needsUpdate?.();
    }
    window.setTimeout(() => drawFootprints?.(), 350);
    notify?.(`Loaded ${preset.name}`);
  };

  if (!USE_LEGACY_JS_RENDERER) {
    const gltfItems = specs.flatMap((spec) => {
      const modelUrl = resolveCatalogModelUrl(spec.url);
      if (!modelUrl) {
        console.warn(`Preset item skipped (no GLTF/GLB): ${spec.name ?? spec.url}`);
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
