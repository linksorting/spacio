/** @type {Record<string, string>} */
let manifest = {};

export async function loadManifest() {
  try {
    const res = await fetch('/thumbnails/manifest.json');
    if (!res.ok) {
      manifest = {};
      return;
    }
    manifest = await res.json();
  } catch {
    manifest = {};
  }
}

/**
 * @param {string} modelUrl
 * @param {string} [fallback]
 * @returns {string}
 */
export function getThumbnail(modelUrl, fallback = '') {
  if (manifest[modelUrl]) return manifest[modelUrl];
  if (fallback) return fallback;
  const derived = `/thumbnails/models/${
    modelUrl.replace(/^\//, '').replace(/\//g, '_').replace(/\.[^.]+$/, '')
  }.png`;
  return derived;
}
