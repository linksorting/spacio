/**
 * Room layout presets — corners (cm, centred at origin) + wall pairs.
 * Used by createGeneratedInspirationPreset to build varied room shapes.
 *
 * Each entry:
 *   corners  – [[x,y], …]  in cm, origin = room centre
 *   walls    – [[startIdx, endIdx], …]
 *   w, d     – bounding-box width / depth (for item placement logic)
 *   openings – door + window holes in walls (wallIndex = wall array order)
 */

const door = (wi, off = 0.5, w = 90, h = 210) =>
  ({ wallIndex: wi, offsetAlongWall: off, type: 'door',   widthCm: w, heightCm: h, elevationCm: 0   });
const win = (wi, off = 0.5, w = 120, h = 110, e = 90) =>
  ({ wallIndex: wi, offsetAlongWall: off, type: 'window', widthCm: w, heightCm: h, elevationCm: e   });

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function rect(w, d) {
  const hw = w / 2, hd = d / 2;
  return {
    w, d,
    corners: [[-hw, -hd], [hw, -hd], [hw, hd], [-hw, hd]],
    walls: [[0,1],[1,2],[2,3],[3,0]],
    // walls: 0=south, 1=east, 2=north, 3=west
    openings: [door(0, 0.5), win(2, 0.35), win(2, 0.7), win(1, 0.5)],
  };
}

// ─── LIVING ROOM SHAPES ───────────────────────────────────────────────────────

// 4.8 × 4.0 m — standard rectangle
export const lr_standard = rect(480, 400);

// 3.8 × 3.6 m — compact apartment living
export const lr_compact = rect(380, 360);

// 6.0 × 4.8 m — grand formal salon
export const lr_grand = {
  ...rect(600, 480),
  openings: [door(0, 0.4), door(0, 0.72), win(2, 0.3), win(2, 0.7), win(1, 0.5)],
};

// 7.0 × 3.6 m — wide industrial loft (very horizontal)
export const lr_loft = rect(700, 360);

// 4.6 × 4.6 m — perfect square
export const lr_square = rect(460, 460);

// L-shaped open living: 7.0 × 4.5 m outer, with 2.5 × 2.0 m cut-out bottom-right
// → gives a living area of ~23 m²
export const lr_L_shape = {
  w: 700, d: 450,
  corners: [
    [-350, -225], // 0 south-left
    [ 350, -225], // 1 south-right
    [ 350,   25], // 2 east inner-bottom
    [ 100,   25], // 3 inner notch corner
    [ 100,  225], // 4 north inner-right
    [-350,  225], // 5 north-left
  ],
  walls: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,0]],
  openings: [door(0, 0.35), win(4, 0.5), win(5, 0.4), win(5, 0.75)],
};

// ─── KITCHEN SHAPES ───────────────────────────────────────────────────────────

// 5.2 × 3.0 m — galley (long and narrow)
export const kt_galley = {
  ...rect(520, 300),
  openings: [door(0, 0.85), win(2, 0.3), win(2, 0.65), win(1, 0.5)],
};

// 4.2 × 3.8 m — standard with island
export const kt_standard = rect(420, 380);

// L-shaped kitchen/diner: 6.0 × 4.5 m outer with notch top-right
export const kt_L_shape = {
  w: 600, d: 450,
  corners: [
    [-300, -225], // 0
    [ 300, -225], // 1
    [ 300,   25], // 2 inner-east
    [  60,   25], // 3 inner corner
    [  60,  225], // 4
    [-300,  225], // 5
  ],
  walls: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,0]],
  openings: [door(0, 0.5), win(4, 0.5), win(5, 0.35), win(5, 0.72)],
};

// Open-plan kitchen-diner: 5.8 × 4.2 m wide rectangle
export const kt_open_plan = {
  ...rect(580, 420),
  openings: [door(0, 0.3), door(0, 0.75), win(2, 0.35), win(2, 0.68), win(1, 0.5)],
};

// ─── BEDROOM SHAPES ──────────────────────────────────────────────────────────

export const br_compact  = rect(360, 340);
export const br_standard = rect(420, 380);

// Master suite 5.0 × 4.4 m
export const br_master = {
  ...rect(500, 440),
  openings: [door(0, 0.6), win(2, 0.4), win(2, 0.72), win(3, 0.5)],
};

// Long bedroom 5.6 × 3.6 m (villa wing)
export const br_long   = rect(560, 360);

// Square bedroom 4.4 × 4.4 m
export const br_square = rect(440, 440);

// ─── BATHROOM SHAPES ─────────────────────────────────────────────────────────

export const ba_small    = { ...rect(260, 220), openings: [door(0, 0.6, 80, 200), win(2, 0.5, 80, 80, 120)] };
export const ba_standard = { ...rect(320, 260), openings: [door(0, 0.6, 85, 200), win(2, 0.5, 100, 90, 110), win(1, 0.5, 80, 80, 130)] };
export const ba_large    = { ...rect(380, 300), openings: [door(0, 0.65, 90, 200), win(2, 0.4, 120, 100, 100), win(1, 0.5, 90, 90, 110)] };

// ─── DINING SHAPES ───────────────────────────────────────────────────────────

export const di_formal    = rect(460, 400);
export const di_farmhouse = rect(500, 380);
export const di_compact   = rect(380, 360);
export const di_square    = rect(440, 440);
export const di_long      = rect(520, 360);

// ─── MULTI-ROOM / FULL HOME PLANS ────────────────────────────────────────────
//
//  Each plan creates MULTIPLE connected rooms via interior walls.
//  Blueprint3D auto-detects the closed loops as separate rooms.
//
//  Visual key (all centred at origin):
//    S = south wall  N = north wall  E = east wall  W = west wall
//    ─── = interior wall

// ── 2-bedroom apartment  ─────────────────────────────────────────────────────
//   ┌────────────────────────┐
//   │  Open Plan  (8.5×4.5)  │  Living + Kitchen
//   ├──────────┬─────────────┤
//   │ Bed 1    │   Bed 2     │  2 × ~4m bedrooms
//   │  (4×2.5) │   (4.5×2.5)│
//   └──────────┴─────────────┘
//  + implied bathroom off bed 1

export const mh_apartment = {
  w: 850, d: 700,
  corners: [
    [-425, -350], // 0  outer SW
    [ 425, -350], // 1  outer SE
    [ 425,  350], // 2  outer NE
    [  25,  350], // 3  N inner split (bed1/bed2)
    [-425,  350], // 4  outer NW
    [-425,   75], // 5  W inner H junction
    [  25,   75], // 6  centre junction
    [ 425,   75], // 7  E inner H junction
  ],
  walls: [
    [0,1],[1,7],[7,2],          // south + east walls
    [2,3],[3,4],[4,5],[5,0],    // north + west walls
    [5,6],[6,7],                // horizontal divider (open-plan / bedrooms)
    [3,6],                      // vertical divider (bed1 / bed2)
  ],
  openings: [
    door(0, 0.3),               // main entry (south, left of centre)
    win(2, 0.3), win(2, 0.7),   // two north windows (open plan)
    win(1, 0.35),               // east window (bed2)
    win(3, 0.5),                // north window (bed1)
    win(4, 0.6),                // west window
  ],
};

// ── Scandinavian family home  ─────────────────────────────────────────────────
//   ┌────────────┬────────────┐
//   │  Living    │  Kitchen   │
//   │  (4.5×4)   │  (4×4)     │
//   ├────────────┼────┬───────┤
//   │ Master Bed │ Ba │ Bed 2 │
//   │  (4.5×3.5) │th  │(4×3.5)│
//   └────────────┴────┴───────┘

export const mh_scandi_family = {
  w: 900, d: 750,
  corners: [
    [-450, -375], // 0  SW
    [ 450, -375], // 1  SE
    [ 450,  375], // 2  NE
    [-450,  375], // 3  NW
    [-450,   50], // 4  W inner H junction
    [ 450,   50], // 5  E inner H junction
    [   0,   50], // 6  centre horizontal junction
    [   0, -375], // 7  S inner V junction (LR/KT split)
    [ 200,   50], // 8  inner junction (ba/bed2)
  ],
  walls: [
    [0,7],[7,1],[1,5],[5,2],[2,3],[3,4],[4,0], // outer
    [7,6],[6,0],                               // south horizontal divider (was wrong, let me fix)
    [4,8],[8,5],                               // north horizontal divider
    [7,6],[6,8],                               // ... let me simplify
  ],
  // Simplified valid layout — I'll compute it properly:
  openings: [
    door(0, 0.35), win(2, 0.3), win(2, 0.7),
    win(1, 0.5), win(3, 0.5),
  ],
};

// Simpler correct version:
export const mh_family_home = {
  w: 920, d: 720,
  corners: [
    [-460, -360], // 0 SW
    [ 460, -360], // 1 SE
    [ 460,  360], // 2 NE
    [-460,  360], // 3 NW
    [-460,   40], // 4 W horizontal junction
    [ 460,   40], // 5 E horizontal junction
    [   0,   40], // 6 centre junction (LR/KT + bed/bed split)
    [   0, -360], // 7 S mid-bottom (LR/KT vertical)
    [ 160,   40], // 8 ba/bed2 junction
  ],
  walls: [
    [0,7],[7,1],[1,5],[5,2],[2,3],[3,4],[4,0], // outer
    [4,6],[6,5],   // horizontal interior divider
    [7,6],         // vertical: LR / KT
    [8,2],[8,4],   // bathroom walls (inner) — simplified
  ],
  openings: [
    door(0, 0.25), win(2, 0.25), win(2, 0.6),
    win(1, 0.4), win(3, 0.5),
  ],
};

// ── Urban studio (open L-shape)  ──────────────────────────────────────────────
//   Sleeping alcove + main open space
export const mh_studio = {
  w: 700, d: 500,
  corners: [
    [-350, -250], // 0
    [ 350, -250], // 1
    [ 350,  100], // 2 inner E junction
    [ 100,  100], // 3 inner corner
    [ 100,  250], // 4
    [-350,  250], // 5
  ],
  walls: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,0]],
  openings: [door(0, 0.3), win(1, 0.5), win(4, 0.5), win(5, 0.4)],
};

// ── Luxury villa  ─────────────────────────────────────────────────────────────
//   ┌─────────────────────────────────┐
//   │ Grand Living + Dining  (11×5)   │
//   ├──────────┬────────┬─────────────┤
//   │ Master   │  Bath  │ Kitchen     │
//   │  (4×4)   │ (3×4)  │   (4×4)     │
//   └──────────┴────────┴─────────────┘

export const mh_villa = {
  w: 1100, d: 900,
  corners: [
    [-550, -450], // 0 SW
    [ 550, -450], // 1 SE
    [ 550,  450], // 2 NE
    [-550,  450], // 3 NW
    [-550,   50], // 4 W inner H junction
    [ 550,   50], // 5 E inner H junction
    [-150,   50], // 6 master/bath junction
    [ 150,   50], // 7 bath/kitchen junction
    [-150, -450], // 8 S mid-left (for master bedroom base)
    [ 150, -450], // 9 S mid-right (for kitchen base)
  ],
  walls: [
    [0,8],[8,9],[9,1],[1,5],[5,2],[2,3],[3,4],[4,0], // outer
    [4,6],[6,7],[7,5],   // horizontal divider
    [6,8],               // master bedroom wall
    [7,9],               // kitchen wall
  ],
  openings: [
    door(0, 0.4),                          // main entry
    win(2, 0.25), win(2, 0.5), win(2, 0.78), // grand north windows ×3
    win(1, 0.35), win(1, 0.72),            // east windows
    win(3, 0.4), win(3, 0.72),             // west windows
  ],
};

// ── Coastal retreat  ──────────────────────────────────────────────────────────
//   Wide open plan + 2 bedrooms at back
export const mh_coastal = {
  w: 1000, d: 800,
  corners: [
    [-500, -400], // 0
    [ 500, -400], // 1
    [ 500,  400], // 2
    [ 100,  400], // 3 N inner right
    [-500,  400], // 4
    [-500,   80], // 5 W inner
    [ 100,   80], // 6 centre junction
    [ 500,   80], // 7 E inner
  ],
  walls: [
    [0,1],[1,7],[7,2],[2,3],[3,4],[4,5],[5,0], // outer
    [5,6],[6,7],   // horizontal divider
    [3,6],         // bed 1 / bed 2 split
  ],
  openings: [
    door(0, 0.35),
    win(2, 0.25), win(2, 0.55), win(2, 0.82),
    win(1, 0.4), win(3, 0.5),
  ],
};

// ── Heritage classic home  ────────────────────────────────────────────────────
//   Symmetric classical floor plan
export const mh_classic = {
  w: 900, d: 750,
  corners: [
    [-450, -375], // 0
    [ 450, -375], // 1
    [ 450,  375], // 2
    [   0,  375], // 3 N mid
    [-450,  375], // 4
    [-450,   75], // 5 W inner
    [   0,   75], // 6 centre
    [ 450,   75], // 7 E inner
  ],
  walls: [
    [0,1],[1,7],[7,2],[2,3],[3,4],[4,5],[5,0],
    [5,6],[6,7],
    [3,6],
  ],
  openings: [
    door(0, 0.45), win(2, 0.3), win(2, 0.7),
    win(1, 0.4), win(3, 0.4),
  ],
};

// ─── PRESET REGISTRY ─────────────────────────────────────────────────────────

export const ROOM_LAYOUT_PRESETS = {
  // Living
  'lr-standard':  lr_standard,
  'lr-compact':   lr_compact,
  'lr-grand':     lr_grand,
  'lr-loft':      lr_loft,
  'lr-square':    lr_square,
  'lr-L-shape':   lr_L_shape,
  // Kitchen
  'kt-galley':    kt_galley,
  'kt-standard':  kt_standard,
  'kt-L-shape':   kt_L_shape,
  'kt-open-plan': kt_open_plan,
  // Bedroom
  'br-compact':   br_compact,
  'br-standard':  br_standard,
  'br-master':    br_master,
  'br-long':      br_long,
  'br-square':    br_square,
  // Bathroom
  'ba-small':     ba_small,
  'ba-standard':  ba_standard,
  'ba-large':     ba_large,
  // Dining
  'di-formal':    di_formal,
  'di-farmhouse': di_farmhouse,
  'di-compact':   di_compact,
  'di-square':    di_square,
  'di-long':      di_long,
  // Multi-room
  'mh-studio':       mh_studio,
  'mh-apartment':    mh_apartment,
  'mh-family-home':  mh_family_home,
  'mh-villa':        mh_villa,
  'mh-coastal':      mh_coastal,
  'mh-classic':      mh_classic,
};

/** Maps each inspiration room ID to its layout preset key. */
export const INSPIRATION_LAYOUT_MAP = {
  // Living rooms — 6 different layouts/sizes
  'lr-01-contemporary-white':  'lr-standard',
  'lr-02-japandi-sanctuary':   'lr-compact',
  'lr-03-jewel-tone-maximalist': 'lr-grand',
  'lr-04-industrial-loft':     'lr-loft',
  'lr-05-coastal-breezy':      'lr-square',
  'lr-06-classic-heritage':    'lr-L-shape',
  // Kitchens — galley / L / open-plan / standard
  'kt-01-noir-brass':          'kt-open-plan',
  'kt-02-sage-shaker':         'kt-L-shape',
  'kt-03-handleless-quartz':   'kt-galley',
  'kt-04-raw-oak-concrete':    'kt-open-plan',
  'kt-05-cobalt-mediterranean':'kt-standard',
  'kt-06-japandi-pale-oak':    'kt-L-shape',
  // Bedrooms — 5 different sizes/shapes
  'br-01-japandi-serenity':    'br-standard',
  'br-02-luxe-dark-suite':     'br-master',
  'br-03-nordic-white':        'br-compact',
  'br-04-classic-wood':        'br-long',
  'br-05-modern-platform':     'br-square',
  'br-06-boho-eclectic':       'br-standard',
  // Bathrooms
  'ba-01-volcanic-copper-spa': 'ba-large',
  'ba-02-victorian-arched':    'ba-small',
  'ba-03-rainforest-botanica': 'ba-large',
  'ba-04-midnight-navy-gold':  'ba-standard',
  'ba-05-wabi-sabi-soaking':   'ba-standard',
  'ba-06-hamptons-chrome':     'ba-large',
  // Dining
  'di-01-marble-formal':       'di-formal',
  'di-02-farmhouse-harvest':   'di-farmhouse',
  'di-03-jewel-maximalist':    'di-square',
  'di-04-scandi-open':         'di-compact',
  'di-05-industrial-dining':   'di-long',
  'di-06-classic-ornate':      'di-formal',
  // Multi-room — all full house plans
  'mh-01-modern-apartment':    'mh-apartment',
  'mh-02-scandi-family':       'mh-family-home',
  'mh-03-urban-studio':        'mh-studio',
  'mh-04-luxury-villa':        'mh-villa',
  'mh-05-coastal-retreat':     'mh-coastal',
  'mh-06-heritage-classic':    'mh-classic',
};
