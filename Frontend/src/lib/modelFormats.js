/** @typedef {'gltf' | 'obj'} ModelFormat */

const GLTF_EXTENSIONS = new Set(['.gltf', '.glb']);
const OBJ_EXTENSIONS = new Set(['.obj', '.bj']);

/** @param {string} [url] */
export function getModelExtension(url = '') {
  const clean = url.split('?')[0].split('#')[0].toLowerCase();
  const dot = clean.lastIndexOf('.');
  return dot >= 0 ? clean.slice(dot) : '';
}

/** @param {string} [url] @returns {ModelFormat | null} */
export function getModelFormat(url = '') {
  const ext = getModelExtension(url);
  if (GLTF_EXTENSIONS.has(ext)) return 'gltf';
  if (OBJ_EXTENSIONS.has(ext)) return 'obj';
  return null;
}

/** @param {string} [url] */
export function isSupportedModelUrl(url = '') {
  return getModelFormat(url) !== null;
}

export const SUPPORTED_MODEL_EXTENSIONS = ['.gltf', '.glb', '.obj', '.bj'];

export const SUPPORTED_MODEL_LABEL = 'GLTF, GLB, OBJ, or BJ';

/** Models with missing/corrupt buffers that crash the WebGL renderer. */
const BLOCKED_MODEL_URLS = new Set([
  '/models/imported-products/modern-toaster/boxed_toaster_device_vray_stemcell.gltf',
]);
const skippedModelWarnings = new Set();

/** @param {string} [url] */
export function isBlockedModelUrl(url = '') {
  const normalized = url.split('?')[0].split('#')[0];
  return BLOCKED_MODEL_URLS.has(normalized);
}

/**
 * Drop unsupported or known-broken models so one bad asset cannot blank the 3D view.
 * @param {Array} items
 */
export function sanitizeGltfPlacedItems(items = []) {
  return items.flatMap((item) => {
    const modelUrl = item?.modelUrl ?? '';
    if (!isSupportedModelUrl(modelUrl) || isBlockedModelUrl(modelUrl)) {
      if (modelUrl && !skippedModelWarnings.has(modelUrl)) {
        skippedModelWarnings.add(modelUrl);
        console.warn(`Skipping unsupported or broken 3D model: ${modelUrl}`);
      }
      return [];
    }
    return [item];
  });
}
