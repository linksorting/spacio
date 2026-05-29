import { Model } from '../../lib/blueprint3d-modern/src/model/model';
import { Floorplanner } from '../../lib/blueprint3d-modern/src/floorplanner/floorplanner';
import { floorplannerModes } from '../../lib/blueprint3d-modern/src/floorplanner/floorplanner_view';
import {
  Configuration,
  configDimUnit,
  configWallHeight,
} from '../../lib/blueprint3d-modern/src/core/configuration';
import { dimCentiMeter } from '../../lib/blueprint3d-modern/src/core/dimensioning';
import { EventEmitter } from '../../lib/blueprint3d-modern/src/core/events';

export const MODERN_FLOORPLANNER_MODES = floorplannerModes;

export function configureModernCanvasEngine({ wallHeightCm = 270 } = {}) {
  Configuration.setValue(configDimUnit, dimCentiMeter);
  Configuration.setValue(configWallHeight, wallHeightCm);
}

/**
 * Modern model/floorplanner backend for the editor.
 *
 * The visible 3D scene remains React Three Fiber so GLB furniture, selections
 * and interaction performance are not duplicated by a hidden renderer loop.
 * @returns {any}
 */
export function createModernCanvasEngine({ floorplannerElement, textureDir = '/rooms/textures/' }) {
  const model = new Model(textureDir);
  const floorplanner = new Floorplanner(floorplannerElement, model.floorplan);
  const controller = {
    enabled: true,
    setSelectedObject() {},
  };

  return {
    model,
    floorplanner,
    three: {
      itemSelectedCallbacks: new EventEmitter(),
      itemUnselectedCallbacks: new EventEmitter(),
      wallClicked: new EventEmitter(),
      floorClicked: new EventEmitter(),
      getController: () => controller,
      stopSpin() {},
      updateWindowSize() {},
      centerCamera() {},
      needsUpdate() {},
    },
  };
}
