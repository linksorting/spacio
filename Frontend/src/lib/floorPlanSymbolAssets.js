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

  // ── KITCHEN / APPLIANCE SYMBOLS ────────────────────────────────────────────

  stove: `<g>
    <rect x="8" y="8" width="84" height="84" rx="3" fill="#c8cdd2" stroke="#555" stroke-width="1.6"/>
    <rect x="14" y="14" width="72" height="40" rx="2" fill="#e8eaec" stroke="#777" stroke-width="0.8"/>
    <circle cx="32" cy="34" r="11" fill="#b0b8c0" stroke="#666" stroke-width="1.2"/>
    <circle cx="32" cy="34" r="6" fill="#888" stroke="#555" stroke-width="0.8"/>
    <circle cx="32" cy="34" r="2.5" fill="#555"/>
    <circle cx="68" cy="34" r="11" fill="#b0b8c0" stroke="#666" stroke-width="1.2"/>
    <circle cx="68" cy="34" r="6" fill="#888" stroke="#555" stroke-width="0.8"/>
    <circle cx="68" cy="34" r="2.5" fill="#555"/>
    <circle cx="32" cy="22" r="6" fill="#b0b8c0" stroke="#666" stroke-width="1"/>
    <circle cx="32" cy="22" r="2.5" fill="#888"/>
    <circle cx="68" cy="22" r="6" fill="#b0b8c0" stroke="#666" stroke-width="1"/>
    <circle cx="68" cy="22" r="2.5" fill="#888"/>
    <rect x="14" y="62" width="72" height="22" rx="2" fill="#d0d5da" stroke="#666" stroke-width="0.8"/>
    <rect x="20" y="66" width="60" height="13" rx="1.5" fill="#b8bec4" stroke="#888" stroke-width="0.5"/>
    <circle cx="82" cy="18" r="3.5" fill="#c0392b"/>
    <circle cx="82" cy="28" r="3.5" fill="#f39c12"/>
    <circle cx="82" cy="38" r="3.5" fill="#27ae60"/>
  </g>`,

  cooktop: `<g>
    <rect x="8" y="18" width="84" height="64" rx="3" fill="#d0d5da" stroke="#555" stroke-width="1.6"/>
    <rect x="14" y="24" width="72" height="52" rx="2" fill="#e4e7ea" stroke="#888" stroke-width="0.8"/>
    <circle cx="33" cy="38" r="12" fill="#b8bec5" stroke="#666" stroke-width="1.2"/>
    <circle cx="33" cy="38" r="7" fill="#8a9099" stroke="#555" stroke-width="0.8"/>
    <circle cx="33" cy="38" r="2.5" fill="#444"/>
    <circle cx="67" cy="38" r="12" fill="#b8bec5" stroke="#666" stroke-width="1.2"/>
    <circle cx="67" cy="38" r="7" fill="#8a9099" stroke="#555" stroke-width="0.8"/>
    <circle cx="67" cy="38" r="2.5" fill="#444"/>
    <circle cx="33" cy="62" r="9" fill="#b8bec5" stroke="#666" stroke-width="1"/>
    <circle cx="33" cy="62" r="5" fill="#8a9099" stroke="#555" stroke-width="0.7"/>
    <circle cx="67" cy="62" r="9" fill="#b8bec5" stroke="#666" stroke-width="1"/>
    <circle cx="67" cy="62" r="5" fill="#8a9099" stroke="#555" stroke-width="0.7"/>
    <line x1="14" y1="24" x2="86" y2="76" stroke="#aaa" stroke-width="0.4" opacity="0.4"/>
    <line x1="86" y1="24" x2="14" y2="76" stroke="#aaa" stroke-width="0.4" opacity="0.4"/>
  </g>`,

  fridge: `<g>
    <rect x="14" y="6" width="72" height="88" rx="4" fill="#dde2e7" stroke="#555" stroke-width="1.6"/>
    <rect x="18" y="10" width="64" height="36" rx="2" fill="#c8d0d8" stroke="#777" stroke-width="0.8"/>
    <rect x="18" y="50" width="64" height="40" rx="2" fill="#d5dbe0" stroke="#777" stroke-width="0.8"/>
    <rect x="72" y="24" width="6" height="18" rx="2" fill="#a0a8b0" stroke="#777" stroke-width="0.8"/>
    <rect x="72" y="56" width="6" height="18" rx="2" fill="#a0a8b0" stroke="#777" stroke-width="0.8"/>
    <line x1="18" y1="30" x2="82" y2="30" stroke="#aaa" stroke-width="0.6" opacity="0.6"/>
    <line x1="18" y1="62" x2="82" y2="62" stroke="#aaa" stroke-width="0.6" opacity="0.6"/>
    <circle cx="50" cy="47" r="2" fill="#888"/>
  </g>`,

  sink_k: `<g>
    <rect x="8" y="14" width="84" height="72" rx="3" fill="#b8c8d0" stroke="#4a6070" stroke-width="1.5"/>
    <rect x="14" y="20" width="72" height="60" rx="2" fill="#ccdde5" stroke="#6a8090" stroke-width="1"/>
    <rect x="18" y="24" width="64" height="26" rx="2" fill="#d8eaf0" stroke="#7a9aaa" stroke-width="0.8"/>
    <ellipse cx="50" cy="37" rx="12" ry="8" fill="#a8c0cc" stroke="#5a7a88" stroke-width="0.8"/>
    <rect x="18" y="54" width="64" height="22" rx="2" fill="#d8eaf0" stroke="#7a9aaa" stroke-width="0.8"/>
    <ellipse cx="50" cy="65" rx="10" ry="6" fill="#a8c0cc" stroke="#5a7a88" stroke-width="0.8"/>
    <rect x="44" y="44" width="12" height="8" rx="2" fill="#8aaab8" stroke="#4a6a78" stroke-width="0.8"/>
    <circle cx="50" cy="76" r="2.5" fill="#4a6a78"/>
  </g>`,

  sink_b: `<g>
    <rect x="14" y="8" width="72" height="84" rx="4" fill="#c8d8e0" stroke="#4a6070" stroke-width="1.5"/>
    <rect x="20" y="16" width="60" height="68" rx="3" fill="#d8e8f0" stroke="#6a8898" stroke-width="1"/>
    <ellipse cx="50" cy="50" rx="24" ry="28" fill="#e0eff5" stroke="#7a9aaa" stroke-width="1"/>
    <ellipse cx="50" cy="50" rx="14" ry="18" fill="#c5dde8" stroke="#6a8898" stroke-width="0.8"/>
    <circle cx="50" cy="50" r="3.5" fill="#5a7888"/>
    <rect x="46" y="16" width="8" height="10" rx="2" fill="#9ab8c5" stroke="#4a6070" stroke-width="0.8"/>
    <circle cx="38" cy="22" r="3" fill="#7a9aaa"/>
    <circle cx="62" cy="22" r="3" fill="#7a9aaa"/>
  </g>`,

  bathtub: `<g>
    <rect x="8" y="10" width="84" height="80" rx="6" fill="#dce9f0" stroke="#4a6a80" stroke-width="1.8"/>
    <rect x="14" y="16" width="72" height="68" rx="5" fill="#edf5fa" stroke="#6a8a9a" stroke-width="1"/>
    <ellipse cx="50" cy="50" rx="32" ry="28" fill="#f4f9fc" stroke="#7a9aaa" stroke-width="1"/>
    <ellipse cx="50" cy="50" rx="20" ry="18" fill="#e8f3f8" stroke="#88a8ba" stroke-width="0.6"/>
    <rect x="14" y="14" width="72" height="12" rx="3" fill="#cddde8" stroke="#5a7888" stroke-width="1"/>
    <circle cx="50" cy="78" r="3.5" fill="#6a8898" stroke="#4a6878" stroke-width="0.8"/>
    <circle cx="38" cy="20" r="4" fill="#8aaab8" stroke="#4a6a78" stroke-width="0.8"/>
    <circle cx="62" cy="20" r="4" fill="#8aaab8" stroke="#4a6a78" stroke-width="0.8"/>
    <rect x="44" y="17" width="12" height="7" rx="2" fill="#7a9ab0" stroke="#4a6a80" stroke-width="0.7"/>
  </g>`,

  shower: `<g>
    <rect x="8" y="8" width="84" height="84" rx="4" fill="#cee0ea" stroke="#4a6a80" stroke-width="1.6"/>
    <rect x="14" y="14" width="72" height="72" rx="3" fill="#e0eff7" stroke="#6a8898" stroke-width="1"/>
    <line x1="14" y1="14" x2="86" y2="14" stroke="#a0c0d0" stroke-width="1.5"/>
    <line x1="14" y1="14" x2="14" y2="86" stroke="#a0c0d0" stroke-width="1.5"/>
    <line x1="86" y1="14" x2="86" y2="86" stroke="#ccd8de" stroke-width="1"/>
    <line x1="14" y1="86" x2="86" y2="86" stroke="#ccd8de" stroke-width="1"/>
    <line x1="14" y1="30" x2="86" y2="30" stroke="#b8d0dc" stroke-width="0.5" opacity="0.7"/>
    <line x1="14" y1="46" x2="86" y2="46" stroke="#b8d0dc" stroke-width="0.5" opacity="0.7"/>
    <line x1="14" y1="62" x2="86" y2="62" stroke="#b8d0dc" stroke-width="0.5" opacity="0.7"/>
    <line x1="14" y1="78" x2="86" y2="78" stroke="#b8d0dc" stroke-width="0.5" opacity="0.7"/>
    <line x1="30" y1="14" x2="30" y2="86" stroke="#b8d0dc" stroke-width="0.5" opacity="0.7"/>
    <line x1="46" y1="14" x2="46" y2="86" stroke="#b8d0dc" stroke-width="0.5" opacity="0.7"/>
    <line x1="62" y1="14" x2="62" y2="86" stroke="#b8d0dc" stroke-width="0.5" opacity="0.7"/>
    <line x1="78" y1="14" x2="78" y2="86" stroke="#b8d0dc" stroke-width="0.5" opacity="0.7"/>
    <circle cx="50" cy="50" r="6" fill="#88b0c5" stroke="#4a6a80" stroke-width="1.2"/>
    <circle cx="50" cy="50" r="3" fill="#5a8aa0"/>
    <circle cx="16" cy="16" r="5" fill="#5a8aa0" stroke="#3a5a70" stroke-width="0.8"/>
    <circle cx="16" cy="16" r="2" fill="#3a5a70"/>
    <path d="M8 14 A6 6 0 0 1 14 8" fill="none" stroke="#5a8898" stroke-width="1.5"/>
  </g>`,

  toilet: `<g>
    <rect x="28" y="8" width="44" height="20" rx="3" fill="#d8d8d6" stroke="#555" stroke-width="1.4"/>
    <ellipse cx="50" cy="58" rx="34" ry="36" fill="#e5e5e3" stroke="#555" stroke-width="1.6"/>
    <ellipse cx="50" cy="60" rx="26" ry="28" fill="#f0f0ee" stroke="#777" stroke-width="0.8"/>
    <ellipse cx="50" cy="62" rx="18" ry="20" fill="#f8f8f6" stroke="#888" stroke-width="0.6"/>
    <rect x="36" y="26" width="28" height="6" rx="2" fill="#c8c8c6" stroke="#666" stroke-width="0.8"/>
    <circle cx="50" cy="95" r="2.5" fill="#777"/>
    <circle cx="44" cy="18" r="2" fill="#888"/>
    <circle cx="56" cy="18" r="2" fill="#888"/>
  </g>`,

  vanity_bath: `<g>
    <rect x="8" y="14" width="84" height="72" rx="3" fill="#b8c5cc" stroke="#4a6070" stroke-width="1.5"/>
    <rect x="14" y="20" width="72" height="60" rx="2" fill="#ccd8e0" stroke="#6a8090" stroke-width="1"/>
    <ellipse cx="50" cy="50" rx="26" ry="22" fill="#dde9f0" stroke="#7a9aaa" stroke-width="1"/>
    <ellipse cx="50" cy="50" rx="16" ry="14" fill="#e8f2f7" stroke="#88a8ba" stroke-width="0.8"/>
    <circle cx="50" cy="50" r="3.5" fill="#5a7888" stroke="#3a5868" stroke-width="0.7"/>
    <rect x="38" y="20" width="24" height="10" rx="2" fill="#9ab8c8" stroke="#5a7888" stroke-width="0.8"/>
    <circle cx="40" cy="25" r="3" fill="#7a9aaa"/>
    <circle cx="60" cy="25" r="3" fill="#7a9aaa"/>
    <line x1="14" y1="50" x2="86" y2="50" stroke="#8a9ea8" stroke-width="0.6" opacity="0.5"/>
    <rect x="14" y="68" width="32" height="12" rx="2" fill="#b8c8d0" stroke="#6a8090" stroke-width="0.7"/>
    <rect x="54" y="68" width="32" height="12" rx="2" fill="#b8c8d0" stroke="#6a8090" stroke-width="0.7"/>
  </g>`,

  full_kitchen: `<g>
    <rect x="6" y="6" width="88" height="30" rx="2" fill="#9c8a70" stroke="#4a3826" stroke-width="1.5"/>
    <rect x="8" y="8" width="26" height="26" rx="1.5" fill="#b0a080" stroke="#5a4830" stroke-width="1"/>
    <rect x="36" y="8" width="26" height="26" rx="1.5" fill="#b0a080" stroke="#5a4830" stroke-width="1"/>
    <rect x="64" y="8" width="26" height="26" rx="1.5" fill="#b0a080" stroke="#5a4830" stroke-width="1"/>
    <circle cx="16" cy="20" r="6" fill="#888" stroke="#555" stroke-width="0.8"/>
    <circle cx="16" cy="20" r="2.5" fill="#555"/>
    <circle cx="54" cy="20" r="4.5" fill="#888" stroke="#555" stroke-width="0.7"/>
    <circle cx="54" cy="20" r="1.8" fill="#555"/>
    <rect x="66" y="10" width="22" height="22" rx="2" fill="#c0d8e0" stroke="#5a7888" stroke-width="0.8"/>
    <ellipse cx="77" cy="21" rx="8" ry="8" fill="#d8eaf0" stroke="#6a8898" stroke-width="0.6"/>
    <rect x="8" y="40" width="84" height="54" rx="2" fill="#7a6550" stroke="#3a2818" stroke-width="1.5"/>
    <rect x="12" y="44" width="28" height="46" rx="1.5" fill="#8a7560" stroke="#4a3828" stroke-width="1"/>
    <rect x="44" y="44" width="44" height="46" rx="1.5" fill="#8a7560" stroke="#4a3828" stroke-width="1"/>
    <circle cx="24" cy="58" r="2" fill="#4a3828"/>
    <circle cx="24" cy="68" r="2" fill="#4a3828"/>
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
  // ── kitchen / appliances ──────────────────────────────────────────────────
  if (/(gas stove|gas range|stove|range|high gas|gas hob|induction stove)/.test(n)) return 'stove';
  if (/(cooktop|cook top|hob|induction cooktop|cooker)/.test(n)) return 'cooktop';
  if (/(fridge|refrigerator|freezer|samsung.*fridge|french door fridge)/.test(n)) return 'fridge';
  if (/(kitchen.*faucet|faucet.*kitchen|kitchen.*tap|undermount sink|kitchen sink|basin tap)/.test(n)) return 'sink_k';
  if (/(full.*kitchen|kitchen.*system|kitchen.*set|kitchen.*alegry|kitchen.*astoria|kitchen.*mia|kitchen.*kt|v2 kitchen|vedinge|kitchen.*island.*module|kitchen.*wall.*module|elegant kitchen)/.test(n)) return 'full_kitchen';
  // ── bathroom ─────────────────────────────────────────────────────────────
  if (/(bathtub|bath tub|soaking tub|freestanding tub|roll.top|claw.?foot|slipper bath|oval.*bath|bath.*oval)/.test(n)) return 'bathtub';
  if (/(shower.*enclosure|glass shower|rain shower|shower.*cabin|shower.*tray|shower.*suite)/.test(n)) return 'shower';
  if (/(toilet|wc|water closet|bidet|loo)/.test(n)) return 'toilet';
  if (/(bathroom.*vanity|vanity.*cabinet|vanity.*sink|pedestal.*sink|sink.*pedestal|basin.*unit|bath.*sink|wash.*basin)/.test(n)) return 'vanity_bath';
  if (/(bath.*faucet|faucet.*bath|bath.*tap|karpo|phobos|rossel|berkel)/.test(n)) return 'sink_b';
  if (/(bath.*suite|contemporary.*bath|bathroom.*suite)/.test(n)) return 'bathtub';
  // ── furniture ────────────────────────────────────────────────────────────
  if (/(dining chair|chair|stool|bench|seat|training chair|visitor chair|executive chair|task chair|desk chair|bar chair)/.test(n)) return 'chair';
  if (/(coffee table|side table|end table|nesting|console table|accent table|center table|meeting table)/.test(n)) return 'coffeeTable';
  if (/(dining table|meeting|conference|desk|workstation|reception|writing desk|bar table|vanity table|dining set|table set)/.test(n)) return 'diningTable';
  if (/(bed|headboard|mattress|bunk|nightstand|dresser)/.test(n)) return 'bed';
  if (/(wardrobe|dresser|cabinet|sideboard|console|bookshelf|bookcase|shelf|storage|chest|drawer|pantry|unit|base|wall cabinet|island base|armoire|media console|filing|cupboard)/.test(n)) return 'cabinet';
  if (/(rug|carpet|runner|mat)/.test(n)) return 'rug';
  if (/(door|doorway|sliding door|folding door)/.test(n)) return 'door';
  if (/(window|curtain|blind|shade|rod|skylight)/.test(n)) return 'window';
  if (/(plant|tree|planter|floral|botanical)/.test(n)) return 'plant';
  if (/(microwave|dishwasher|toaster|mixer|television|speaker|printer|ac unit|appliance|espresso|kettle|coffee maker|hood|range hood|extractor)/.test(n)) return 'appliance';
  if (/(round wooden|wooden table)/.test(n)) return 'coffeeTable';
  return 'decor';
}

// Physical dimensions in cm → used to set the model footprint in the 2D planner.
// These match real-world object sizes so items scale correctly in the floor plan.
export function getFloorPlanFootprint(name = '') {
  const type = detectFloorPlanType(name);
  const sizes = {
    // seating
    sectional:    { w: 250, h: 160 },
    sofa:         { w: 220, h: 90  },
    armchair:     { w: 80,  h: 85  },
    chair:        { w: 45,  h: 45  },
    // tables
    coffeeTable:  { w: 100, h: 55  },
    diningTable:  { w: 160, h: 90  },
    // bedroom
    bed:          { w: 160, h: 210 },
    // storage / joinery
    cabinet:      { w: 120, h: 45  },
    // soft furnishings
    rug:          { w: 240, h: 170 },
    // architectural
    door:         { w: 90,  h: 15  },
    window:       { w: 100, h: 15  },
    // plants
    plant:        { w: 40,  h: 40  },
    // ── kitchen ──────────────────────────────────────
    stove:        { w: 60,  h: 60  },   // standard 60cm hob
    cooktop:      { w: 60,  h: 52  },   // flush cooktop
    fridge:       { w: 70,  h: 70  },   // typical fridge depth
    sink_k:       { w: 80,  h: 52  },   // kitchen double sink
    full_kitchen: { w: 360, h: 65  },   // kitchen run / full scene
    // ── bathroom ─────────────────────────────────────
    bathtub:      { w: 170, h: 80  },   // standard bath
    shower:       { w: 90,  h: 90  },   // 900×900 shower tray
    toilet:       { w: 38,  h: 68  },   // standard toilet
    vanity_bath:  { w: 90,  h: 52  },   // vanity unit
    sink_b:       { w: 50,  h: 50  },   // pedestal / vessel sink
    // generic
    appliance:    { w: 55,  h: 55  },
    decor:        { w: 35,  h: 35  },
    generic:      { w: 35,  h: 35  },
  };
  return sizes[type] || sizes.generic;
}

export function wrapFloorPlanSymbolSvg(innerMarkup) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="none">${innerMarkup}</svg>`;
}
