import {
  detectFloorPlanType,
  FLOOR_PLAN_SYMBOL_SVG,
  wrapFloorPlanSymbolSvg,
} from './floorPlanSymbolAssets';

const imageCache = new Map();

/** @type {(() => void) | null} */
let onSymbolReady = null;

export function setFloorPlanSymbolRedrawCallback(callback) {
  onSymbolReady = callback;
}

function symbolImageForType(type) {
  if (imageCache.has(type)) {
    return imageCache.get(type);
  }

  const markup = FLOOR_PLAN_SYMBOL_SVG[type] || FLOOR_PLAN_SYMBOL_SVG.generic;
  const svg = wrapFloorPlanSymbolSvg(markup);
  const url = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  const image = new Image();
  image.decoding = 'async';
  image.onload = () => {
    if (onSymbolReady) onSymbolReady();
  };
  image.src = url;
  imageCache.set(type, image);
  return image;
}

export function preloadFloorPlanSymbols() {
  Object.keys(FLOOR_PLAN_SYMBOL_SVG).forEach((type) => {
    symbolImageForType(type);
  });
}

/**
 * Draw a Neo Foyr-style top-down symbol centered at (0,0) after caller applies translate/rotate.
 */
export function drawFloorPlanSymbol(ctx, name, width, height, options = {}) {
  const { selected = false, showLabel = false } = options;
  const type = detectFloorPlanType(name);
  const image = symbolImageForType(type);

  if (selected) {
    ctx.save();
    ctx.strokeStyle = '#6366f1';
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 3]);
    ctx.strokeRect(-width / 2 - 3, -height / 2 - 3, width + 6, height + 6);
    ctx.setLineDash([]);
    ctx.restore();
  }

  if (image.complete && image.naturalWidth > 0) {
    ctx.drawImage(image, -width / 2, -height / 2, width, height);
  } else {
    ctx.fillStyle = selected ? 'rgba(99, 102, 241, 0.12)' : 'rgba(174, 145, 111, 0.22)';
    ctx.strokeStyle = selected ? '#6366f1' : '#8a7460';
    ctx.lineWidth = selected ? 2 : 1;
    ctx.fillRect(-width / 2, -height / 2, width, height);
    ctx.strokeRect(-width / 2, -height / 2, width, height);
  }

  if (showLabel && width > 48) {
    ctx.fillStyle = selected ? '#4338ca' : 'rgba(55, 65, 81, 0.88)';
    ctx.font = `${Math.max(8, Math.min(11, width / 8))}px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText(name, 0, height / 2 + 4);
  }
}

export { detectFloorPlanType, getFloorPlanFootprint } from './floorPlanSymbolAssets';
