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
