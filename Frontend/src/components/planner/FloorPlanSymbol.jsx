import React from 'react';
import {
  detectFloorPlanType,
  FLOOR_PLAN_SYMBOL_SVG,
  getFloorPlanFootprint,
  wrapFloorPlanSymbolSvg,
} from '@/lib/floorPlanSymbolAssets';

export { detectFloorPlanType, getFloorPlanFootprint };

function symbolMarkupToReact(svgInner) {
  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      width="100%"
      height="100%"
      style={{ display: 'block' }}
      dangerouslySetInnerHTML={{ __html: svgInner }}
    />
  );
}

export default function FloorPlanSymbol({ name }) {
  const type = detectFloorPlanType(name);
  const inner = FLOOR_PLAN_SYMBOL_SVG[type] || FLOOR_PLAN_SYMBOL_SVG.generic;
  return symbolMarkupToReact(inner);
}

/** @deprecated use wrapFloorPlanSymbolSvg from floorPlanSymbolAssets */
export function getSymbolSvgDocument(name) {
  const type = detectFloorPlanType(name);
  const inner = FLOOR_PLAN_SYMBOL_SVG[type] || FLOOR_PLAN_SYMBOL_SVG.generic;
  return wrapFloorPlanSymbolSvg(inner);
}
