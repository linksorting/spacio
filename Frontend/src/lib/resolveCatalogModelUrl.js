import { isSupportedModelUrl } from '@/lib/modelFormats';

/**
 * Resolve a catalog entry to a GLTF/GLB URL for the modern renderer.
 * @param {string} [modelUrl]
 * @param {string} [previewModelUrl]
 * @returns {string | null}
 */
export function resolveCatalogModelUrl(modelUrl = '', previewModelUrl = '') {
  const cleanPreview = previewModelUrl.split('?')[0];
  const cleanModel = modelUrl.split('?')[0];

  if (isSupportedModelUrl(cleanPreview)) return previewModelUrl || cleanPreview;
  if (isSupportedModelUrl(cleanModel)) return modelUrl;

  return null;
}

/**
 * Imported GLTF/GLB models are authored in meters at real-world scale.
 * Kenney assets are authored in cm and need 0.01 to convert to meters.
 * @param {string} [modelUrl]
 */
export function getModelSceneScale(modelUrl = '') {
  if (modelUrl.includes('/models/kenney/')) return 0.01;
  return 1;
}
