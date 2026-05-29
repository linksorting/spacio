import { configureModernCanvasEngine } from './modernCanvasEngine';

/**
 * Clear and build a rectangular room shell in the modern Blueprint3D floorplan.
 * @param {object} floorplan
 * @param {{
 *   widthCm: number,
 *   depthCm: number,
 *   wallHeightCm?: number,
 *   wallTexture?: { url: string, stretch?: boolean, scale?: number } | null,
 *   floorTexture?: { url: string, stretch?: boolean, scale?: number } | null,
 * }} options
 */
export function buildRectangularFloorplan(floorplan, {
  widthCm,
  depthCm,
  wallHeightCm = 270,
  wallTexture = null,
  floorTexture = null,
  wallColor = null,
}) {
  if (!floorplan) return;

  floorplan.reset();

  const w = widthCm;
  const d = depthCm;
  const c1 = floorplan.newCorner(-w / 2, -d / 2);
  const c2 = floorplan.newCorner(w / 2, -d / 2);
  const c3 = floorplan.newCorner(w / 2, d / 2);
  const c4 = floorplan.newCorner(-w / 2, d / 2);

  [[c1, c2], [c2, c3], [c3, c4], [c4, c1]].forEach(([start, end]) => {
    const wall = floorplan.newWall(start, end);
    if (wallTexture?.url) {
      wall.frontTexture = {
        url: wallTexture.url,
        stretch: wallTexture.stretch ?? true,
        scale: wallTexture.scale ?? 0,
      };
      wall.backTexture = {
        url: wallTexture.url,
        stretch: wallTexture.stretch ?? true,
        scale: wallTexture.scale ?? 0,
      };
    }
    if (wallColor) {
      wall.color = wallColor;
    }
    wall.height = wallHeightCm;
  });

  floorplan.update();

  if (floorTexture?.url) {
    (floorplan.getRooms?.() ?? []).forEach((room) => {
      room.setTexture(
        floorTexture.url,
        floorTexture.stretch ?? false,
        floorTexture.scale ?? 300,
      );
    });
  }
}

/**
 * Build a multi-room floorplan from shared corner and wall definitions.
 * Existing presets continue to use buildRectangularFloorplan.
 * @param {object} floorplan
 * @param {{
 *   corners: Array<[number, number]>,
 *   walls: Array<[number, number]>,
 * }} layout
 * @param {{
 *   wallHeightCm?: number,
 *   wallTexture?: { url: string, stretch?: boolean, scale?: number } | null,
 *   floorTexture?: { url: string, stretch?: boolean, scale?: number } | null,
 * }} options
 * @returns {object[]}
 */
export function buildPresetFloorplan(floorplan, layout, {
  wallHeightCm = 270,
  wallTexture = null,
  floorTexture = null,
} = {}) {
  if (!floorplan || !layout?.corners?.length || !layout?.walls?.length) return [];

  floorplan.reset();
  const corners = layout.corners.map(([x, y]) => floorplan.newCorner(x, y));
  const walls = layout.walls.flatMap(([startIndex, endIndex]) => {
    const start = corners[startIndex];
    const end = corners[endIndex];
    if (!start || !end || start === end) return [];
    const wall = floorplan.newWall(start, end);
    if (wallTexture?.url) {
      wall.frontTexture = {
        url: wallTexture.url,
        stretch: wallTexture.stretch ?? true,
        scale: wallTexture.scale ?? 0,
      };
      wall.backTexture = {
        url: wallTexture.url,
        stretch: wallTexture.stretch ?? true,
        scale: wallTexture.scale ?? 0,
      };
    }
    wall.height = wallHeightCm;
    return [wall];
  });

  floorplan.update();
  if (floorTexture?.url) {
    (floorplan.getRooms?.() ?? []).forEach((room) => {
      room.setTexture(
        floorTexture.url,
        floorTexture.stretch ?? false,
        floorTexture.scale ?? 300,
      );
    });
  }
  return walls;
}

/** @param {object} bp3d @param {number} heightCm */
export function applyBlueprintWallHeight(bp3d, heightCm) {
  configureModernCanvasEngine({ wallHeightCm: heightCm });
  bp3d?.model?.floorplan?.getWalls?.().forEach((wall) => {
    wall.height = heightCm;
  });
}

/**
 * Refresh 2D floorplanner view and notify React shell consumers after manual layout edits.
 * @param {object} bp3d
 * @param {{ onSync?: () => void, drawFootprints?: () => void }} [callbacks]
 */
export function syncBlueprintViewsAfterLoad(bp3d, callbacks = {}) {
  const { onSync, drawFootprints } = callbacks;
  bp3d?.model?.floorplan?.update?.();
  bp3d?.model?.floorplan?.roomLoadedCallbacks?.fire?.();
  bp3d?.floorplanner?.resizeView?.();
  bp3d?.floorplanner?.reset?.();
  onSync?.();
  window.requestAnimationFrame(() => drawFootprints?.());
}
