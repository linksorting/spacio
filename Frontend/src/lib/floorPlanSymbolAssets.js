/** Top-down floor plan symbol SVG markup (100×100 viewBox). */

const FABRIC_LIGHT = `
  <path d="M16 44 L28 36 L40 44 L52 36 L64 44 L76 36 L88 44" stroke="#171717" stroke-width="1" fill="none" opacity="0.42"/>
  <path d="M14 58 L26 50 L38 58 L50 50 L62 58 L74 50 L86 58" stroke="#171717" stroke-width="1" fill="none" opacity="0.42"/>
`;

const FABRIC_DENSE = `${FABRIC_LIGHT}
  <path d="M18 72 L30 64 L42 72 L54 64 L66 72 L78 64" stroke="#171717" stroke-width="1" fill="none" opacity="0.42"/>
  <path d="M20 32 L30 26 L40 32 M58 32 L68 26 L78 32" stroke="#171717" stroke-width="1" fill="none" opacity="0.42"/>
`;

const CUSHION_SEAMS = `
  <line x1="34" y1="28" x2="34" y2="78" stroke="#151515" stroke-width="0.8" opacity="0.8"/>
  <line x1="66" y1="28" x2="66" y2="78" stroke="#151515" stroke-width="0.8" opacity="0.8"/>
`;

export const FLOOR_PLAN_SYMBOL_SVG = {
  sectional: `<g>
    <path d="M6 9H94V45H42V94H6Z" fill="#3f443e" stroke="#121212" stroke-width="1.8"/>
    <path d="M7 9H94V21H19V94H7Z" fill="#292d29"/>
    <rect x="20" y="24" width="23" height="18" rx="2" fill="#565b52" stroke="#222" stroke-width="0.7"/>
    <rect x="45" y="24" width="23" height="18" rx="2" fill="#565b52" stroke="#222" stroke-width="0.7"/>
    <rect x="70" y="24" width="21" height="18" rx="2" fill="#565b52" stroke="#222" stroke-width="0.7"/>
    <rect x="20" y="45" width="19" height="22" rx="2" fill="#565b52" stroke="#222" stroke-width="0.7"/>
    <rect x="20" y="69" width="19" height="22" rx="2" fill="#565b52" stroke="#222" stroke-width="0.7"/>
    ${FABRIC_DENSE}
  </g>`,
  sofa: `<g>
    <rect x="5" y="20" width="90" height="58" rx="3" fill="#3f443e" stroke="#121212" stroke-width="1.8"/>
    <rect x="7" y="20" width="86" height="12" rx="2" fill="#292d29"/>
    <rect x="7" y="30" width="13" height="46" rx="2" fill="#30342f"/>
    <rect x="80" y="30" width="13" height="46" rx="2" fill="#30342f"/>
    <rect x="22" y="34" width="18" height="38" rx="2" fill="#53584f" stroke="#222" stroke-width="0.7"/>
    <rect x="41" y="34" width="18" height="38" rx="2" fill="#565b52" stroke="#222" stroke-width="0.7"/>
    <rect x="60" y="34" width="18" height="38" rx="2" fill="#53584f" stroke="#222" stroke-width="0.7"/>
    ${FABRIC_DENSE}
  </g>`,
  armchair: `<g>
    <rect x="18" y="20" width="64" height="66" rx="3" fill="#3f443e" stroke="#121212" stroke-width="1.8"/>
    <rect x="20" y="20" width="60" height="13" rx="2" fill="#292d29"/>
    <rect x="20" y="32" width="13" height="52" rx="2" fill="#30342f"/>
    <rect x="67" y="32" width="13" height="52" rx="2" fill="#30342f"/>
    <rect x="35" y="36" width="30" height="44" rx="3" fill="#565b52" stroke="#222" stroke-width="0.7"/>
    ${FABRIC_LIGHT}
  </g>`,
  chair: `<g>
    <rect x="24" y="20" width="52" height="58" rx="3" fill="#4a4f48" stroke="#121212" stroke-width="1.6"/>
    <rect x="27" y="20" width="46" height="12" rx="2" fill="#2f332f"/>
    <rect x="31" y="35" width="38" height="35" rx="3" fill="#60655d" stroke="#222" stroke-width="0.7"/>
  </g>`,
  coffeeTable: `<g>
    <ellipse cx="50" cy="50" rx="38" ry="24" fill="#6b6259" stroke="#111" stroke-width="1.5"/>
    <ellipse cx="50" cy="50" rx="29" ry="17" fill="#756c62" stroke="#222" stroke-width="0.7"/>
    ${FABRIC_LIGHT}
  </g>`,
  diningTable: `<g>
    <rect x="8" y="18" width="84" height="64" fill="#6b6259" stroke="#111" stroke-width="1.5"/>
    <line x1="8" y1="50" x2="92" y2="50" stroke="#222" stroke-width="0.8" opacity="0.6"/>
    ${FABRIC_LIGHT}
  </g>`,
  bed: `<g>
    <rect x="8" y="14" width="84" height="78" rx="4" fill="#d8d2c8" stroke="#5a5040" stroke-width="1.5"/>
    <rect x="8" y="14" width="84" height="16" rx="3" fill="#7a6b55"/>
    <rect x="14" y="20" width="32" height="12" rx="3" fill="#fff" stroke="#aaa" stroke-width="0.6"/>
    <rect x="54" y="20" width="32" height="12" rx="3" fill="#fff" stroke="#aaa" stroke-width="0.6"/>
    <line x1="8" y1="60" x2="92" y2="60" stroke="#5a5040" stroke-width="0.8" opacity="0.5"/>
  </g>`,
  cabinet: `<g>
    <rect x="8" y="20" width="84" height="60" fill="#7a5e3a" stroke="#2a1f10" stroke-width="1.5"/>
    <line x1="50" y1="20" x2="50" y2="80" stroke="#2a1f10" stroke-width="1"/>
    <circle cx="44" cy="50" r="1.8" fill="#2a1f10"/>
    <circle cx="56" cy="50" r="1.8" fill="#2a1f10"/>
  </g>`,
  rug: `<g>
    <rect x="6" y="6" width="88" height="88" rx="2" fill="#c9b896" stroke="#8a7a5a" stroke-width="1" stroke-dasharray="3 2"/>
    <rect x="14" y="14" width="72" height="72" fill="none" stroke="#8a7a5a" stroke-width="0.6" opacity="0.5"/>
  </g>`,
  door: `<g>
    <rect x="8" y="42" width="84" height="16" fill="#7a5e3a" stroke="#2a1f10" stroke-width="1.5"/>
    <path d="M8 58 A50 50 0 0 1 58 8" fill="none" stroke="#8a8a8a" stroke-width="1" stroke-dasharray="3 2"/>
    <line x1="8" y1="58" x2="58" y2="8" stroke="#333" stroke-width="1"/>
  </g>`,
  window: `<g>
    <rect x="8" y="38" width="84" height="24" fill="#d9edf8" stroke="#555" stroke-width="1.4"/>
    <line x1="8" y1="50" x2="92" y2="50" stroke="#555" stroke-width="0.8"/>
    <line x1="50" y1="38" x2="50" y2="62" stroke="#555" stroke-width="0.8"/>
  </g>`,
  plant: `<g>
    <circle cx="50" cy="50" r="38" fill="#4a7a3a" stroke="#1f3a18" stroke-width="1.2"/>
    <circle cx="38" cy="42" r="14" fill="#5a8a48" opacity="0.8"/>
    <circle cx="62" cy="46" r="12" fill="#5a8a48" opacity="0.8"/>
    <circle cx="48" cy="60" r="13" fill="#3d6830" opacity="0.8"/>
    <rect x="40" y="76" width="20" height="14" fill="#7a5535" stroke="#3a2a1a" stroke-width="1"/>
  </g>`,
  appliance: `<g>
    <rect x="14" y="12" width="72" height="76" rx="3" fill="#d2d5d8" stroke="#555" stroke-width="1.5"/>
    <rect x="22" y="22" width="56" height="34" fill="#eceff1" stroke="#777" stroke-width="0.7"/>
    <circle cx="50" cy="70" r="10" fill="#f7f7f7" stroke="#777" stroke-width="0.8"/>
    <circle cx="74" cy="18" r="2" fill="#555"/>
  </g>`,
  decor: `<g>
    <circle cx="50" cy="50" r="32" fill="#f2df9d" stroke="#9a7a32" stroke-width="1.5"/>
    <circle cx="50" cy="50" r="17" fill="#fff7d0" stroke="#9a7a32" stroke-width="0.8"/>
    <circle cx="50" cy="50" r="4" fill="#9a7a32"/>
  </g>`,
  generic: `<g>
    <circle cx="50" cy="50" r="32" fill="#f2df9d" stroke="#9a7a32" stroke-width="1.5"/>
    <circle cx="50" cy="50" r="17" fill="#fff7d0" stroke="#9a7a32" stroke-width="0.8"/>
  </g>`,
};

export function detectFloorPlanType(name = '') {
  const n = name.toLowerCase();
  if (/(sectional|l-shape|l shape|corner sofa)/.test(n)) return 'sectional';
  if (/(sofa|couch|loveseat|daybed)/.test(n)) return 'sofa';
  if (/(armchair|accent chair|lounge|recliner|arm chair|bean bag|pouf|ottoman)/.test(n)) return 'armchair';
  if (/(dining chair|chair|stool|bench|seat|training chair|visitor chair|executive chair|task chair|desk chair|bar chair)/.test(n)) return 'chair';
  if (/(coffee table|side table|end table|nesting|console table|accent table|center table|meeting table)/.test(n)) return 'coffeeTable';
  if (/(dining table|meeting|conference|desk|workstation|reception|writing desk|bar table|vanity table|dining set|table set)/.test(n)) return 'diningTable';
  if (/(bed|headboard|mattress|bunk|nightstand|dresser)/.test(n)) return 'bed';
  if (/(wardrobe|dresser|cabinet|sideboard|console|bookshelf|bookcase|shelf|storage|chest|drawer|pantry|unit|base|wall cabinet|island base|vanity|armoire|media console|sideboard|bookcase|filing|cupboard|nightstand)/.test(n)) return 'cabinet';
  if (/(rug|carpet|runner|mat)/.test(n)) return 'rug';
  if (/(door|doorway|sliding door|folding door)/.test(n)) return 'door';
  if (/(window|curtain|blind|shade|rod|skylight)/.test(n)) return 'window';
  if (/(plant|tree|planter|floral|botanical)/.test(n)) return 'plant';
  if (/(microwave|dishwasher|toaster|mixer|television|speaker|printer|ac|appliance)/.test(n)) return 'appliance';
  if (/(round wooden|wooden table)/.test(n)) return 'coffeeTable';
  return 'decor';
}

export function getFloorPlanFootprint(name = '') {
  const type = detectFloorPlanType(name);
  const sizes = {
    sectional: { w: 170, h: 115 },
    sofa: { w: 150, h: 58 },
    armchair: { w: 62, h: 66 },
    chair: { w: 42, h: 42 },
    coffeeTable: { w: 86, h: 44 },
    diningTable: { w: 95, h: 64 },
    bed: { w: 92, h: 135 },
    cabinet: { w: 95, h: 34 },
    rug: { w: 135, h: 90 },
    door: { w: 58, h: 16 },
    window: { w: 82, h: 18 },
    plant: { w: 36, h: 36 },
    appliance: { w: 58, h: 58 },
    decor: { w: 34, h: 34 },
    generic: { w: 34, h: 34 },
  };
  return sizes[type] || sizes.generic;
}

export function wrapFloorPlanSymbolSvg(innerMarkup) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="none">${innerMarkup}</svg>`;
}
