// ─── PRODUCT CATALOG ─────────────────────────────────────────────────────────
// Every product from the finalassets library + existing items, keyed by id.
const productCatalog = {

  // ── SEATING ──────────────────────────────────────────────────────────────────
  sofa_fabric:        { id: 'sofa_fabric',        name: 'Fabric Lounge Sofa',         type: 'Seating',       img: '/assets/products/thumbnails/obj-sofa.png' },
  sofa_contemporary:  { id: 'sofa_contemporary',  name: 'Contemporary 3-Seat Sofa',   type: 'Seating',       img: '/assets/products/thumbnails/realistic-sofa-005.png' },
  sofa_modular_linen: { id: 'sofa_modular_linen', name: 'Modular Linen Sofa',         type: 'Seating',       img: '/assets/products/thumbnails/modular-linen-sofa.png' },
  sofa_sectional_3s:  { id: 'sofa_sectional_3s',  name: '3-Seater Sectional Sofa',    type: 'Seating',       img: '/assets/products/thumbnails/3-seater-sectional.png' },
  sofa_realistic_004: { id: 'sofa_realistic_004', name: 'Plush Upholstered Sofa',     type: 'Seating',       img: '/assets/products/thumbnails/realistic-sofa-004.png' },
  sofa_realistic_010: { id: 'sofa_realistic_010', name: 'Deep Boucle Sofa',           type: 'Seating',       img: '/assets/products/thumbnails/realistic-sofa-010.png' },
  cloud_sectional:    { id: 'cloud_sectional',    name: 'Cloud Modular Sectional',    type: 'Seating',       img: '/assets/products/thumbnails/cloud-sectional.png' },
  low_arc_sectional:  { id: 'low_arc_sectional',  name: 'Low Arc Sectional',          type: 'Seating',       img: '/assets/products/thumbnails/low-arc-sectional.png' },
  armchair_boucle:    { id: 'armchair_boucle',    name: 'Curved Boucle Lounge Chair', type: 'Seating',       img: '/assets/products/thumbnails/curved-boucle-lounge-chair.png' },
  armchair_walnut:    { id: 'armchair_walnut',    name: 'Walnut Frame Armchair',      type: 'Seating',       img: '/assets/products/thumbnails/walnut-frame-armchair.png' },
  luna_chair:         { id: 'luna_chair',         name: 'Luna Velvet Accent Chair',   type: 'Seating',       img: '/assets/products/thumbnails/luna-chair.png' },
  slat_chair:         { id: 'slat_chair',         name: 'Slat Dining Chair',          type: 'Seating',       img: '/assets/products/thumbnails/slat-chair.png' },
  alto_stool:         { id: 'alto_stool',         name: 'Alto Bar Stool',             type: 'Seating',       img: '/assets/products/thumbnails/alto-stool.png' },
  chair_032:          { id: 'chair_032',          name: 'Ergonomic Chair 032',        type: 'Seating',       img: '/assets/products/thumbnails/chair-032.png' },

  // ── BEDS ─────────────────────────────────────────────────────────────────────
  channel_tufted_bed: { id: 'channel_tufted_bed', name: 'Channel Tufted Bed',        type: 'Bedroom',       img: '/assets/products/thumbnails/channel-tufted-bed.png' },
  lowline_bed:        { id: 'lowline_bed',        name: 'Lowline Platform Bed',       type: 'Bedroom',       img: '/assets/products/thumbnails/lowline-bed.png' },
  platform_storage_bed:{ id:'platform_storage_bed','name':'Platform Storage Bed',    type: 'Bedroom',       img: '/assets/products/thumbnails/platform-storage-bed.png' },
  gothic_bed:         { id: 'gothic_bed',         name: 'Gothic Carved Bed',          type: 'Bedroom',       img: '/assets/products/thumbnails/obj-bed.png' },
  classic_bedroom:    { id: 'classic_bedroom',    name: 'Classic Wood Bedroom Set',   type: 'Bedroom',       img: '/assets/products/thumbnails/obj-classic-bedroom.png' },

  // ── WARDROBES & BEDROOM STORAGE ──────────────────────────────────────────────
  emery_wardrobe:     { id: 'emery_wardrobe',     name: 'Emery Wardrobe',             type: 'Storage',       img: '/assets/products/thumbnails/emery-wardrobe.png' },
  wardrobe_alex:      { id: 'wardrobe_alex',      name: 'Alex Wardrobe A3',           type: 'Storage',       img: '/assets/products/thumbnails/obj-wardrobe-a3.png' },
  fluted_tall_cabinet:{ id: 'fluted_tall_cabinet','name':'Fluted Tall Cabinet',       type: 'Storage',       img: '/assets/products/thumbnails/fluted-tall-cabinet.png' },
  cupboard_015:       { id: 'cupboard_015',       name: 'Detailed Cupboard',          type: 'Storage',       img: '/assets/products/thumbnails/detailed-cupboard-015.png' },
  cupboard_020:       { id: 'cupboard_020',       name: 'Glass-Front Cupboard',       type: 'Storage',       img: '/assets/products/thumbnails/detailed-cupboard-020.png' },
  cupboard_043:       { id: 'cupboard_043',       name: 'Wood-Panel Cupboard',        type: 'Storage',       img: '/assets/products/thumbnails/detailed-cupboard-043.png' },
  country_chest:      { id: 'country_chest',      name: 'Country Chest of Drawers',   type: 'Storage',       img: '/assets/products/thumbnails/obj-country-chest.png' },

  // ── TABLES ───────────────────────────────────────────────────────────────────
  atlas_table:        { id: 'atlas_table',        name: 'Atlas Solid Oak Dining Table',type: 'Tables',       img: '/assets/products/thumbnails/atlas-table.png' },
  carrara_table:      { id: 'carrara_table',      name: 'Carrara Marble Coffee Table', type: 'Tables',       img: '/assets/products/thumbnails/carrara-table.png' },
  coffee_table_oak:   { id: 'coffee_table_oak',   name: 'Round Oak Coffee Table',     type: 'Tables',       img: '/assets/products/thumbnails/round-oak-coffee-table.png' },
  coffee_table_rect:  { id: 'coffee_table_rect',  name: 'Rectangular Coffee Table',   type: 'Tables',       img: '/assets/products/thumbnails/obj-coffee-table-rect.png' },
  linear_console:     { id: 'linear_console',     name: 'Linear Console Table',       type: 'Tables',       img: '/assets/products/thumbnails/linear-console.png' },
  kitchen_island:     { id: 'kitchen_island',     name: 'Kitchen Island',             type: 'Tables',       img: '/assets/products/thumbnails/kitchen-island.png' },
  modern_dining_set:  { id: 'modern_dining_set',  name: 'Modern Luxury Dining Set',   type: 'Tables',       img: '/assets/products/thumbnails/modern-dining-set.png' },
  pebble_tables:      { id: 'pebble_tables',      name: 'Pebble Nesting Tables',      type: 'Tables',       img: '/assets/products/thumbnails/pebble-tables.png' },
  travertine_side:    { id: 'travertine_side',    name: 'Travertine Side Table',      type: 'Tables',       img: '/assets/products/thumbnails/travertine-side-table.png' },

  // ── STORAGE ──────────────────────────────────────────────────────────────────
  oslo_sideboard:     { id: 'oslo_sideboard',     name: 'Oslo Sideboard',             type: 'Storage',       img: '/assets/products/thumbnails/oslo-sideboard.png' },
  grid_media:         { id: 'grid_media',         name: 'Grid Media Unit',            type: 'Storage',       img: '/assets/products/thumbnails/grid-media.png' },
  cube_bookshelf:     { id: 'cube_bookshelf',     name: 'Open Cube Bookshelf',        type: 'Storage',       img: '/assets/products/thumbnails/cube-bookshelf.png' },
  entry_bench:        { id: 'entry_bench',        name: 'Entry Bench Storage',        type: 'Storage',       img: '/assets/products/thumbnails/entry-bench.png' },
  cabinet_antares:    { id: 'cabinet_antares',    name: 'Antares Display Cabinet',    type: 'Storage',       img: '/assets/products/thumbnails/obj-antares.png' },
  ornate_sideboard:   { id: 'ornate_sideboard',   name: 'Ornate Four-Door Sideboard', type: 'Storage',       img: '/assets/products/thumbnails/obj-ornate-sideboard.png' },
  cabinet_blade:      { id: 'cabinet_blade',      name: 'Cabinet Blade',              type: 'Storage',       img: '/assets/products/thumbnails/obj-cabinet-blade.png' },
  cabinet_high:       { id: 'cabinet_high',       name: 'Prio Cabinet High',          type: 'Storage',       img: '/assets/products/thumbnails/obj-cabinet-high.png' },
  cabinet_low:        { id: 'cabinet_low',        name: 'Prio Cabinet Low',           type: 'Storage',       img: '/assets/products/thumbnails/obj-cabinet-low.png' },
  minimal_storage_console: { id: 'minimal_storage_console', name: 'Minimal Storage Console', type: 'Storage', img: '/assets/products/thumbnails/minimal-storage-console.png' },

  // ── LIGHTING ─────────────────────────────────────────────────────────────────
  arc_lamp:           { id: 'arc_lamp',           name: 'Arc Brass Floor Lamp',       type: 'Lighting',      img: '/assets/products/thumbnails/arc-lamp.png' },
  ceramic_lamp:       { id: 'ceramic_lamp',       name: 'Ceramic Table Lamp',         type: 'Lighting',      img: '/assets/products/thumbnails/ceramic-lamp.png' },
  globe_pendant:      { id: 'globe_pendant',      name: 'Globe Pendant',              type: 'Lighting',      img: '/assets/products/thumbnails/globe-pendant.png' },
  opal_pendant:       { id: 'opal_pendant',       name: 'Opal Globe Pendant',         type: 'Lighting',      img: '/assets/products/thumbnails/opal-globe-pendant.png' },
  ceiling_spot:       { id: 'ceiling_spot',       name: 'Recessed Ceiling Spot',      type: 'Lighting',      img: '/assets/products/thumbnails/ceiling-spot.png' },
  led_strip:          { id: 'led_strip',          name: 'Linear LED Strip',           type: 'Lighting',      img: '/assets/products/thumbnails/led-strip.png' },
  slim_floor_lamp:    { id: 'slim_floor_lamp',    name: 'Slim Black Floor Lamp',      type: 'Lighting',      img: '/assets/products/thumbnails/slim-black-floor-lamp.png' },
  lamp_wood_base:     { id: 'lamp_wood_base',     name: 'Wood-Base Table Lamp',       type: 'Lighting',      img: '/assets/products/thumbnails/obj-table-lamp.png' },

  // ── KITCHEN APPLIANCES & CABINETRY ───────────────────────────────────────────
  kitchen_elegant:    { id: 'kitchen_elegant',    name: 'Elegant Kitchen with Island', type: 'Kitchen',      img: '/assets/products/thumbnails/obj-elegant-kitchen.png' },
  kitchen_vedinge:    { id: 'kitchen_vedinge',    name: 'IKEA Vedinge Kitchen',        type: 'Kitchen',      img: '/assets/products/thumbnails/obj-ikea-kitchen.png' },
  cabinet_gas_stove:  { id: 'cabinet_gas_stove',  name: 'Cabinet with Gas Stove',     type: 'Kitchen',      img: '/assets/products/thumbnails/obj-cabinet-model-l-with-gas-stove-sx.png' },
  gas_stove_pro:      { id: 'gas_stove_pro',      name: 'Professional Gas Range',     type: 'Appliances',   img: '/assets/products/thumbnails/obj-stove.png' },
  cooktop_l:          { id: 'cooktop_l',          name: 'Induction Cooktop Module',   type: 'Appliances',   img: '/assets/products/thumbnails/obj-cooktop-module-l.png' },
  hood_ch60:          { id: 'hood_ch60',          name: 'Range Hood CH-60',           type: 'Appliances',   img: '/assets/products/thumbnails/obj-extractor-ch60.png' },
  fridge_samsung:     { id: 'fridge_samsung',     name: 'Samsung French Door Fridge', type: 'Appliances',   img: '/assets/products/thumbnails/obj-fridge-module-burner-sx.png' },
  kettle_k200:        { id: 'kettle_k200',        name: 'Electric Kettle K200',       type: 'Appliances',   img: '/assets/products/thumbnails/obj-kettle-k200.png' },
  espresso_machine:   { id: 'espresso_machine',   name: 'Espresso Machine L-1000',    type: 'Appliances',   img: '/assets/products/thumbnails/obj-coffee-machine-l1000.png' },
  coffee_maker:       { id: 'coffee_maker',       name: 'Coffee Maker L-90',          type: 'Appliances',   img: '/assets/products/thumbnails/obj-coffee-maker-l90.png' },
  bbq_module:         { id: 'bbq_module',         name: 'BBQ Grill Module',           type: 'Appliances',   img: '/assets/products/thumbnails/obj-barbecue-fga-module-w.png' },
  shock_chiller_w60:  { id: 'shock_chiller_w60',  name: 'Shock Chiller W-60',        type: 'Appliances',   img: '/assets/products/thumbnails/obj-shock-chiller-w60.png' },

  // ── NAMED KITCHEN COLLECTIONS (all varieties from finalassets) ───────────────
  kitchen_alegry:      { id: 'kitchen_alegry',    name: 'Kitchen Alegry Set',           type: 'Kitchen',    img: '/assets/products/thumbnails/obj-kitchen-alegry.png' },
  kitchen_astoria:     { id: 'kitchen_astoria',   name: 'Kitchen Astoria',              type: 'Kitchen',    img: '/assets/products/thumbnails/obj-kitchen-astoria.png' },
  kitchen_kt006:       { id: 'kitchen_kt006',     name: 'Kitchen KT006',                type: 'Kitchen',    img: '/assets/products/thumbnails/obj-kitchen-kt006.png' },
  kitchen_mia:         { id: 'kitchen_mia',       name: 'Kitchen Mia',                  type: 'Kitchen',    img: '/assets/products/thumbnails/obj-kitchen-mia.png' },
  kitchen_v2_full:     { id: 'kitchen_v2_full',   name: 'V2 Kitchen System',            type: 'Kitchen',    img: '/assets/products/thumbnails/obj-the-v2-kitchen.png' },
  kitchen_v2_island:   { id: 'kitchen_v2_island', name: 'V2 Kitchen Island Narrow',     type: 'Kitchen',    img: '/assets/products/thumbnails/obj-the-v2-kitchen-island-narrow.png' },
  kitchen_v2_wall:     { id: 'kitchen_v2_wall',   name: 'V2 Kitchen Wall Module',       type: 'Kitchen',    img: '/assets/products/thumbnails/obj-the-v2-kitchen-wall-module.png' },
  kitchen_v1_wall:     { id: 'kitchen_v1_wall',   name: 'V1 Kitchen Wall Module',       type: 'Kitchen',    img: '/assets/products/thumbnails/obj-kitchen-v1-wall-module.png' },
  kitchen_vipp_tall:   { id: 'kitchen_vipp_tall', name: 'VIPP Tall Pantry Module',      type: 'Kitchen',    img: '/assets/products/thumbnails/obj-kitchen-vipp-v1-tall-module.png' },
  gas_stove_high:      { id: 'gas_stove_high',    name: 'High Gas Stove',               type: 'Appliances', img: '/assets/products/thumbnails/obj-high-gas-stove.png' },
  hood_2:              { id: 'hood_2',            name: 'Designer Range Hood 2',         type: 'Appliances', img: '/assets/products/thumbnails/obj-hood-2.png' },
  faucet_berkel:       { id: 'faucet_berkel',     name: 'Kitchen Faucet Berkel 4807',   type: 'Appliances', img: '/assets/products/thumbnails/obj-faucet-berkel-4807.png' },
  faucet_rossel:       { id: 'faucet_rossel',     name: 'Kitchen Faucet Rossel 2800',   type: 'Appliances', img: '/assets/products/thumbnails/obj-faucet-rossel-2800.png' },
  faucet_karpo:        { id: 'faucet_karpo',      name: 'Bath Faucet Karpo D',          type: 'Bathroom',   img: '/assets/products/thumbnails/obj-faucet-karpo-d.png' },
  faucet_phobos:       { id: 'faucet_phobos',     name: 'Bath Faucet Phobos',           type: 'Bathroom',   img: '/assets/products/thumbnails/obj-faucet-phobos.png' },

  // ── BATHROOMS ────────────────────────────────────────────────────────────────
  freestanding_tub:   { id: 'freestanding_tub',   name: 'Freestanding Soaking Tub',  type: 'Bathroom',     img: '/assets/products/thumbnails/freestanding-tub.png' },
  bathtub_realistic:  { id: 'bathtub_realistic',  name: 'Sculpted Freestanding Bathtub', type: 'Bathroom', img: '/assets/products/thumbnails/realistic-bathtub.png' },
  bathtub_classic:    { id: 'bathtub_classic',    name: 'Classic Roll-Top Bathtub',   type: 'Bathroom',     img: '/assets/products/thumbnails/obj-bathtub.png' },
  bathroom_vanity:    { id: 'bathroom_vanity',    name: 'Bathroom Vanity Cabinet',    type: 'Bathroom',     img: '/assets/products/thumbnails/obj-bathroom-vanity.png' },
  marble_vanity:      { id: 'marble_vanity',      name: 'Marble-Top Floating Vanity', type: 'Bathroom',     img: '/assets/products/thumbnails/marble-vanity.png' },
  pedestal_sink_gold: { id: 'pedestal_sink_gold', name: 'Pedestal Sink with Gold Faucet', type: 'Bathroom', img: '/assets/products/thumbnails/obj-pedestal-sink.png' },
  shower_glass:       { id: 'shower_glass',       name: 'Rectangular Glass Shower',   type: 'Bathroom',     img: '/assets/products/thumbnails/obj-glass-shower.png' },
  toilet_sleek:       { id: 'toilet_sleek',       name: 'Sleek White Toilet',         type: 'Bathroom',     img: '/assets/products/thumbnails/obj-modern-toilet.png' },
  wall_toilet:        { id: 'wall_toilet',        name: 'Wall-Hung Toilet',           type: 'Bathroom',     img: '/assets/products/thumbnails/wall-toilet.png' },
  bath_suite:         { id: 'bath_suite',         name: 'Contemporary Bath Suite',    type: 'Bathroom',     img: '/assets/products/thumbnails/obj-contemporary-bath.png' },
  under_sink_storage: { id: 'under_sink_storage', name: 'Under-Sink Storage Organizer',type: 'Bathroom',    img: '/assets/products/thumbnails/under-sink-storage.png' },
  brass_towel_rack:   { id: 'brass_towel_rack',   name: 'Brass Towel Rack',           type: 'Bathroom',     img: '/assets/products/thumbnails/brass-towel-rack.png' },
  bath_mat:           { id: 'bath_mat',           name: 'Woven Bath Mat',             type: 'Textiles',     img: '/assets/products/thumbnails/bath-mat.png' },

  // ── DECOR & ART ──────────────────────────────────────────────────────────────
  fiddle_leaf:        { id: 'fiddle_leaf',        name: 'Fiddle Leaf Fig',            type: 'Plants',       img: '/assets/products/thumbnails/fiddle-leaf.png' },
  potted_plant:       { id: 'potted_plant',       name: 'Indoor Potted Plant',        type: 'Plants',       img: '/assets/products/thumbnails/potted-plant.png' },
  ceramic_vase:       { id: 'ceramic_vase',       name: 'Ceramic Vase',               type: 'Decor',        img: '/assets/products/thumbnails/ceramic-vase.png' },
  ribbed_vase:        { id: 'ribbed_vase',        name: 'Ceramic Ribbed Vase',        type: 'Decor',        img: '/assets/products/thumbnails/ceramic-ribbed-vase.png' },
  gradient_art:       { id: 'gradient_art',       name: 'Framed Gradient Wall Art',   type: 'Art',          img: '/assets/products/thumbnails/gradient-art.png' },
  frame_fancy:        { id: 'frame_fancy',        name: 'Ornate Picture Frame',       type: 'Decor',        img: '/assets/products/thumbnails/fancy-picture-frame.png' },
  frame_standing:     { id: 'frame_standing',     name: 'Standing Picture Frame',     type: 'Decor',        img: '/assets/products/thumbnails/standing-picture-frame.png' },
  bust_marble:        { id: 'bust_marble',        name: 'Marble Bust Sculpture',      type: 'Decor',        img: '/assets/products/thumbnails/marble-bust.png' },
  woven_rug:          { id: 'woven_rug',          name: 'Handwoven Area Rug',         type: 'Textiles',     img: 'https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?w=320&h=320&fit=crop' },
  linen_curtains:     { id: 'linen_curtains',     name: 'Linen Curtains',             type: 'Textiles',     img: '/assets/products/thumbnails/linen-curtains.png' },
  contemp_curtains:   { id: 'contemp_curtains',   name: 'Contemporary Curtains',      type: 'Textiles',     img: '/assets/products/thumbnails/obj-contemporary-curtains.png' },
  round_mirror:       { id: 'round_mirror',       name: 'Round Mirror',               type: 'Decor',        img: '/assets/products/thumbnails/round-mirror.png' },
  wall_mirror_soft:   { id: 'wall_mirror_soft',   name: 'Soft-Edge Wall Mirror',      type: 'Decor',        img: '/assets/products/thumbnails/soft-edge-wall-mirror.png' },

  // ── DOORS & WINDOWS ──────────────────────────────────────────────────────────
  door_arched_glass:  { id: 'door_arched_glass',  name: 'Arched Glass Door',          type: 'Architectural', img: '/assets/products/thumbnails/arched-glass-door.png' },
  door_flat_oak:      { id: 'door_flat_oak',      name: 'Flat Panel Oak Door',        type: 'Architectural', img: '/assets/products/thumbnails/flat-panel-oak-door.png' },
  door_bedroom:       { id: 'door_bedroom',       name: 'Bedroom Entry Door',         type: 'Architectural', img: '/assets/products/thumbnails/obj-bedroom-door.png' },
  door_house:         { id: 'door_house',         name: 'Single House Door',          type: 'Architectural', img: '/assets/products/thumbnails/obj-house-door.png' },
  door_wood_glass:    { id: 'door_wood_glass',    name: 'Wooden Door with Glass Panel',type: 'Architectural',img: '/assets/products/thumbnails/obj-wood-glass-door.png' },
  door_iron_arched:   { id: 'door_iron_arched',   name: 'Arched Wrought Iron Door',   type: 'Architectural', img: '/assets/products/thumbnails/obj-iron-door.png' },
  door_iron_ornate:   { id: 'door_iron_ornate',   name: 'Ornate Iron Entry Door',     type: 'Architectural', img: '/assets/products/thumbnails/obj-ornate-iron-door.png' },
  door_scandi:        { id: 'door_scandi',        name: 'Scandinavian Panel Door',    type: 'Architectural', img: '/assets/products/thumbnails/obj-scandi-door.png' },
  window_sash:        { id: 'window_sash',        name: 'Georgian Sash Window',       type: 'Architectural', img: '/assets/products/thumbnails/obj-classic-window.png' },
  window_modern:      { id: 'window_modern',      name: 'Modern Picture Window',      type: 'Architectural', img: '/assets/products/thumbnails/obj-window.png' },
  window_black_frame: { id: 'window_black_frame', name: 'Black Frame Picture Window', type: 'Architectural', img: '/assets/products/thumbnails/black-frame-picture-window.png' },
  window_slim:        { id: 'window_slim',        name: 'Slim Casement Window',       type: 'Architectural', img: '/assets/products/thumbnails/slim-casement-window.png' },
  window_casement:    { id: 'window_casement',    name: 'Classic Casement Window',    type: 'Architectural', img: '/assets/products/thumbnails/casement-window.png' },
  wooden_door:        { id: 'wooden_door',        name: 'Wooden Interior Door',       type: 'Architectural', img: '/assets/products/thumbnails/wooden-door.png' },
};

// ─── INSPIRATION ENTRIES ─────────────────────────────────────────────────────
// 36 designs across 6 room types: 6 per category.
const inspirationEntries = [

  // ═══════════════════════════════════════════════════════════════════════════
  // LIVING ROOMS
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'lr-01-contemporary-white',
    title: 'Contemporary White Living Room',
    roomType: 'Living Room',
    style: 'Contemporary',
    category: 'Living',
    segment: 'Residential',
    by: 'Designer Pro',
    wallPalette: 'Crisp white walls with warm undertones, natural oak flooring',
    description: 'Pure white walls meet a boucle sectional and sculptural oak coffee table. Arched black-frame windows flood the room in natural light while a globe pendant anchors the ceiling.',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1400&h=1000&fit=crop',
    productCount: 14,
    searchTerms: ['contemporary', 'white', 'living room', 'boucle', 'modern', 'bright'],
    productTypes: [
      { label: 'Seating',       count: 4 },
      { label: 'Tables',        count: 2 },
      { label: 'Lighting',      count: 3 },
      { label: 'Decor',         count: 3 },
      { label: 'Architectural', count: 2 }
    ],
    productIds: ['cloud_sectional', 'armchair_boucle', 'carrara_table', 'coffee_table_oak', 'globe_pendant', 'ceiling_spot', 'arc_lamp', 'fiddle_leaf', 'gradient_art', 'woven_rug', 'window_black_frame', 'door_flat_oak', 'ribbed_vase', 'contemp_curtains']
  },
  {
    id: 'lr-02-japandi-sanctuary',
    title: 'Warm Japandi Sanctuary',
    roomType: 'Living Room',
    style: 'Japandi',
    category: 'Living',
    segment: 'Residential',
    by: 'Designer Pro',
    wallPalette: 'Warm clay walls, smoked oak floors, linen textures throughout',
    description: 'A low-slung linen sofa, wabi-sabi pottery, and a single brushed-brass floor lamp make this room feel unhurried. A Georgian sash window frames greenery beyond while warm clay walls envelop every corner.',
    image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb3?w=1400&h=1000&fit=crop',
    productCount: 13,
    searchTerms: ['japandi', 'wabi-sabi', 'living room', 'linen', 'warm', 'clay', 'minimal'],
    productTypes: [
      { label: 'Seating',       count: 3 },
      { label: 'Tables',        count: 2 },
      { label: 'Lighting',      count: 2 },
      { label: 'Decor',         count: 4 },
      { label: 'Architectural', count: 2 }
    ],
    productIds: ['sofa_modular_linen', 'armchair_walnut', 'coffee_table_oak', 'pebble_tables', 'arc_lamp', 'ceramic_lamp', 'fiddle_leaf', 'potted_plant', 'ceramic_vase', 'woven_rug', 'window_sash', 'door_scandi', 'linen_curtains']
  },
  {
    id: 'lr-03-jewel-tone-maximalist',
    title: 'Jewel-Tone Maximalist Lounge',
    roomType: 'Living Room',
    style: 'Maximalist',
    category: 'Living',
    segment: 'Residential',
    by: 'Designer Pro',
    wallPalette: 'Deep forest green accent wall, gallery plaster, warm brass accents',
    description: 'An emerald velvet sectional commands the room. Ornate iron doors frame the entry, an rattan pendant casts dappled gold light, and a marble bust adds sculptural drama beside curated gallery art.',
    image: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=1400&h=1000&fit=crop',
    productCount: 16,
    searchTerms: ['maximalist', 'jewel tone', 'green', 'velvet', 'rich', 'ornate', 'gallery'],
    productTypes: [
      { label: 'Seating',       count: 4 },
      { label: 'Tables',        count: 2 },
      { label: 'Lighting',      count: 3 },
      { label: 'Decor',         count: 5 },
      { label: 'Architectural', count: 2 }
    ],
    productIds: ['low_arc_sectional', 'luna_chair', 'armchair_boucle', 'carrara_table', 'linear_console', 'globe_pendant', 'arc_lamp', 'led_strip', 'bust_marble', 'frame_fancy', 'ornate_sideboard', 'gradient_art', 'potted_plant', 'woven_rug', 'door_iron_ornate', 'window_sash']
  },
  {
    id: 'lr-04-industrial-loft',
    title: 'Moody Industrial Loft',
    roomType: 'Living Room',
    style: 'Industrial',
    category: 'Living',
    segment: 'Residential',
    by: 'Designer Pro',
    wallPalette: 'Raw concrete walls, dark stained oak floors, matte black fixtures',
    description: 'Exposed concrete textures, a low dark sofa, and gunmetal cable lighting define this moody loft. A black-frame picture window soaks the space in dramatic afternoon light.',
    image: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=1400&h=1000&fit=crop',
    productCount: 13,
    searchTerms: ['industrial', 'loft', 'dark', 'concrete', 'moody', 'urban'],
    productTypes: [
      { label: 'Seating',       count: 3 },
      { label: 'Tables',        count: 2 },
      { label: 'Lighting',      count: 3 },
      { label: 'Storage',       count: 2 },
      { label: 'Architectural', count: 3 }
    ],
    productIds: ['sofa_realistic_004', 'chair_032', 'coffee_table_rect', 'travertine_side', 'slim_floor_lamp', 'ceiling_spot', 'led_strip', 'grid_media', 'cabinet_antares', 'window_black_frame', 'door_iron_arched', 'frame_standing', 'bust_marble']
  },
  {
    id: 'lr-05-coastal-breezy',
    title: 'Coastal Breezy Open Living',
    roomType: 'Living Room',
    style: 'Coastal',
    category: 'Living',
    segment: 'Residential',
    by: 'Designer Pro',
    wallPalette: 'Soft sage-white walls, bleached oak floors, sea-glass greens and sandy naturals',
    description: 'Rattan, linen, and driftwood accents fill this airy retreat. Sliding glass-panel doors open to a terrace, two potted palms flank the room, and a breezy linen sofa invites relaxation.',
    image: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=1400&h=1000&fit=crop',
    productCount: 14,
    searchTerms: ['coastal', 'breezy', 'rattan', 'linen', 'light', 'airy', 'beach house'],
    productTypes: [
      { label: 'Seating',       count: 3 },
      { label: 'Tables',        count: 2 },
      { label: 'Lighting',      count: 2 },
      { label: 'Decor',         count: 4 },
      { label: 'Architectural', count: 3 }
    ],
    productIds: ['sofa_contemporary', 'armchair_walnut', 'coffee_table_oak', 'pebble_tables', 'opal_pendant', 'arc_lamp', 'potted_plant', 'fiddle_leaf', 'ceramic_vase', 'woven_rug', 'linen_curtains', 'door_wood_glass', 'window_slim', 'window_casement']
  },
  {
    id: 'lr-06-classic-heritage',
    title: 'Classic Heritage Parlour',
    roomType: 'Living Room',
    style: 'Classic',
    category: 'Living',
    segment: 'Residential',
    by: 'Designer Pro',
    wallPalette: 'Dusty rose plaster walls, herringbone parquet floor, brass and ivory tones',
    description: 'An ornate sideboard anchors classic symmetry, flanked by velvet armchairs and a low sofa. Gilded frames, a marble bust, and arched iron entry doors give this parlour timeless gravitas.',
    image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=1400&h=1000&fit=crop',
    productCount: 15,
    searchTerms: ['classic', 'heritage', 'traditional', 'ornate', 'velvet', 'brass', 'parlour'],
    productTypes: [
      { label: 'Seating',       count: 4 },
      { label: 'Tables',        count: 2 },
      { label: 'Lighting',      count: 3 },
      { label: 'Storage',       count: 2 },
      { label: 'Decor',         count: 4 }
    ],
    productIds: ['sofa_fabric', 'luna_chair', 'armchair_boucle', 'alto_stool', 'atlas_table', 'linear_console', 'globe_pendant', 'ceramic_lamp', 'arc_lamp', 'ornate_sideboard', 'cabinet_antares', 'bust_marble', 'frame_fancy', 'gradient_art', 'door_iron_ornate']
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // KITCHENS  — 6 distinct styles using every new appliance & cabinet model
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'kt-01-noir-brass',
    title: 'Noir & Brass Chef\'s Domain',
    roomType: 'Kitchen',
    style: 'Moody',
    category: 'Kitchen',
    segment: 'Residential',
    by: 'Designer Pro',
    wallPalette: 'Matte charcoal slab-fronts, polished black granite counters, aged brass hardware and pendants',
    description: 'Midnight-black slab cabinets rise to the ceiling on three walls. A High Gas Stove sits beneath the dramatic Designer Range Hood 2. The Shock Chiller sits at the end of the run like professional catering kit. A Berkel faucet in brushed brass arches over the twin sink, three Alto stools saddle the waterfall island, and a brass pendant cluster hangs low. Arched iron glazed doors to the dining room and a picture window above the sink let in just enough light to make the black sing.',
    image: 'https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=1400&h=1000&fit=crop',
    productCount: 21,
    searchTerms: ['kitchen', 'dark', 'noir', 'black', 'brass', 'dramatic', 'chef', 'professional range', 'moody'],
    productTypes: [
      { label: 'Kitchen',       count: 4 },
      { label: 'Appliances',    count: 7 },
      { label: 'Seating',       count: 3 },
      { label: 'Lighting',      count: 4 },
      { label: 'Architectural', count: 3 }
    ],
    productIds: ['kitchen_alegry', 'kitchen_v2_wall', 'kitchen_vipp_tall', 'kitchen_island', 'gas_stove_high', 'hood_2', 'shock_chiller_w60', 'fridge_samsung', 'faucet_berkel', 'espresso_machine', 'kettle_k200', 'alto_stool', 'alto_stool', 'alto_stool', 'globe_pendant', 'globe_pendant', 'led_strip', 'ceiling_spot', 'door_iron_arched', 'window_black_frame', 'ribbed_vase']
  },
  {
    id: 'kt-02-sage-shaker',
    title: 'Sage Green Shaker Range Kitchen',
    roomType: 'Kitchen',
    style: 'Warm Contemporary',
    category: 'Kitchen',
    segment: 'Residential',
    by: 'Designer Pro',
    wallPalette: 'Sage green shaker cabinets, cream limestone counters, warm linen walls, brushed brass hardware',
    description: 'Kitchen Mia\'s sage-green shaker fronts frame a full professional range with V1 Wall Modules stacked above. A Rossel faucet in brushed brass arches over the Belfast-style basin, a Samsung fridge stands at the end of the run, and the VIPP Tall Pantry Module stores dry goods. Two rattan pendants warm the island while Georgian sash windows flood the countertop in morning light. A pair of slat chairs at the breakfast end complete the kitchen.',
    image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1400&h=1000&fit=crop',
    productCount: 20,
    searchTerms: ['kitchen', 'sage green', 'shaker', 'range cooker', 'farmhouse', 'warm', 'countryside'],
    productTypes: [
      { label: 'Kitchen',       count: 4 },
      { label: 'Appliances',    count: 5 },
      { label: 'Seating',       count: 3 },
      { label: 'Lighting',      count: 4 },
      { label: 'Architectural', count: 4 }
    ],
    productIds: ['kitchen_mia', 'kitchen_v1_wall', 'kitchen_vipp_tall', 'kitchen_island', 'gas_stove_pro', 'hood_ch60', 'fridge_samsung', 'faucet_rossel', 'coffee_maker', 'kettle_k200', 'alto_stool', 'alto_stool', 'slat_chair', 'opal_pendant', 'opal_pendant', 'ceiling_spot', 'led_strip', 'window_sash', 'window_casement', 'door_flat_oak']
  },
  {
    id: 'kt-03-handleless-quartz',
    title: 'Handleless White Quartz Statement Kitchen',
    roomType: 'Kitchen',
    style: 'Contemporary',
    category: 'Kitchen',
    segment: 'Residential',
    by: 'Designer Pro',
    wallPalette: 'Gloss chalk-white handleless fronts, white quartz counters, warm greige walls, matte black accents',
    description: 'Kitchen KT006\'s pure handleless slab doors vanish into the walls. The V2 Kitchen Wall Module forms a continuous overhead run and the VIPP Tall Module acts as a full-height pantry. An induction Cooktop L is flush-set into the quartz counter beside a Berkel faucet. Trio of opal pendants hover above the island where three alto bar stools pull up. A black-frame floor-to-ceiling window wall delivers panoramic views; a wood-glass panel door with slim casements frames the garden.',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1400&h=1000&fit=crop',
    productCount: 20,
    searchTerms: ['kitchen', 'handleless', 'white', 'quartz', 'minimal', 'contemporary', 'slab front'],
    productTypes: [
      { label: 'Kitchen',       count: 4 },
      { label: 'Appliances',    count: 5 },
      { label: 'Seating',       count: 3 },
      { label: 'Lighting',      count: 4 },
      { label: 'Architectural', count: 4 }
    ],
    productIds: ['kitchen_kt006', 'kitchen_v2_wall', 'kitchen_vipp_tall', 'kitchen_v2_island', 'cooktop_l', 'hood_ch60', 'fridge_samsung', 'faucet_berkel', 'espresso_machine', 'kettle_k200', 'alto_stool', 'alto_stool', 'alto_stool', 'opal_pendant', 'opal_pendant', 'opal_pendant', 'ceiling_spot', 'window_black_frame', 'window_slim', 'door_wood_glass']
  },
  {
    id: 'kt-04-raw-oak-concrete',
    title: 'Raw Oak & Poured Concrete Industrial',
    roomType: 'Kitchen',
    style: 'Industrial',
    category: 'Kitchen',
    segment: 'Residential',
    by: 'Designer Pro',
    wallPalette: 'Textured raw oak flat-fronts, poured grey concrete island, exposed steel, aged iron pendants',
    description: 'The V2 Kitchen System\'s tactile oak runs the full perimeter, capped by a polished concrete island. A free-standing High Gas Stove stands like a centrepiece piece — no range hood enclosure, just the Designer Hood 2 on raw steel rod fixings. The Shock Chiller keeps product cold beside the Samsung fridge. A Rossel faucet in matte black and Edison globe cluster pendant rail complete the raw industrial story. A black arched iron door separates kitchen from dining.',
    image: 'https://images.unsplash.com/photo-1556910638-6cdac31d44dc?w=1400&h=1000&fit=crop',
    productCount: 20,
    searchTerms: ['kitchen', 'industrial', 'raw oak', 'concrete', 'loft', 'urban', 'professional'],
    productTypes: [
      { label: 'Kitchen',       count: 4 },
      { label: 'Appliances',    count: 6 },
      { label: 'Seating',       count: 2 },
      { label: 'Lighting',      count: 4 },
      { label: 'Architectural', count: 4 }
    ],
    productIds: ['kitchen_v2_full', 'kitchen_v2_wall', 'kitchen_v2_island', 'kitchen_island', 'gas_stove_high', 'hood_2', 'shock_chiller_w60', 'fridge_samsung', 'faucet_rossel', 'coffee_maker', 'alto_stool', 'alto_stool', 'globe_pendant', 'globe_pendant', 'globe_pendant', 'led_strip', 'door_iron_arched', 'window_modern', 'window_black_frame', 'kettle_k200']
  },
  {
    id: 'kt-05-cobalt-mediterranean',
    title: 'Cobalt Blue Mediterranean Feast Kitchen',
    roomType: 'Kitchen',
    style: 'Mediterranean',
    category: 'Kitchen',
    segment: 'Residential',
    by: 'Designer Pro',
    wallPalette: 'Cobalt blue lower cabinets, white upper cabinets, hand-painted terracotta tiles, copper accessories',
    description: 'Kitchen Astoria\'s cobalt blue lowers pop against white uppers and hand-painted terracotta tile splashbacks. A Cabinet with Gas Stove anchors the cooking wall beneath a copper-finish Hood CH-60. A Phobos wall-mount tap in antique brass rises above the farmhouse basin. The coffee machine and kettle claim a dedicated counter niche beside ceramic herb pots. An oak dining table with slat chairs wraps the kitchen end, lit by a rattan-diffuser ceramic pendant. Georgian sash windows frame the herb garden.',
    image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1400&h=1000&fit=crop&crop=bottom',
    productCount: 21,
    searchTerms: ['kitchen', 'cobalt', 'mediterranean', 'terracotta', 'copper', 'warm', 'handmade'],
    productTypes: [
      { label: 'Kitchen',       count: 3 },
      { label: 'Appliances',    count: 6 },
      { label: 'Tables',        count: 1 },
      { label: 'Seating',       count: 3 },
      { label: 'Lighting',      count: 4 },
      { label: 'Architectural', count: 4 }
    ],
    productIds: ['kitchen_astoria', 'kitchen_v1_wall', 'cabinet_gas_stove', 'gas_stove_pro', 'hood_ch60', 'fridge_samsung', 'faucet_phobos', 'espresso_machine', 'coffee_maker', 'kettle_k200', 'atlas_table', 'slat_chair', 'slat_chair', 'alto_stool', 'ceramic_lamp', 'globe_pendant', 'globe_pendant', 'ceiling_spot', 'window_sash', 'window_sash', 'door_scandi']
  },
  {
    id: 'kt-06-japandi-pale-oak',
    title: 'Japandi Pale Oak & Warm Marble Kitchen',
    roomType: 'Kitchen',
    style: 'Japandi',
    category: 'Kitchen',
    segment: 'Residential',
    by: 'Designer Pro',
    wallPalette: 'Pale natural oak flat-fronts, warm white Venetian plaster walls, warm marble island, brass hairpin handles',
    description: 'Kitchen Alegry in pale linen oak provides a seamless perimeter run — V2 Wall Modules overhead for open shelving, VIPP Tall Module as a statement pantry. An Induction Cooktop L is flush-set beside a Rossel faucet in satin brass. The Samsung fridge is fully panel-integrated. Three opal pendants drop in a close cluster above the marble kitchen island where two Alto stools park. A coffee maker and kettle occupy a quiet niche. Slim casement windows on two walls, a Scandinavian sliding panel door.',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1400&h=1000&fit=crop&crop=right',
    productCount: 20,
    searchTerms: ['kitchen', 'japandi', 'pale oak', 'warm marble', 'minimal', 'induction', 'serene'],
    productTypes: [
      { label: 'Kitchen',       count: 4 },
      { label: 'Appliances',    count: 5 },
      { label: 'Seating',       count: 2 },
      { label: 'Lighting',      count: 4 },
      { label: 'Architectural', count: 5 }
    ],
    productIds: ['kitchen_alegry', 'kitchen_v2_wall', 'kitchen_vipp_tall', 'kitchen_island', 'cooktop_l', 'hood_ch60', 'fridge_samsung', 'faucet_rossel', 'coffee_maker', 'kettle_k200', 'alto_stool', 'alto_stool', 'opal_pendant', 'opal_pendant', 'opal_pendant', 'ceiling_spot', 'window_slim', 'window_casement', 'window_slim', 'door_scandi']
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // BEDROOMS
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'br-01-japandi-serenity',
    title: 'Japandi Serenity Master Bedroom',
    roomType: 'Bedroom',
    style: 'Japandi',
    category: 'Bedroom',
    segment: 'Residential',
    by: 'Designer Pro',
    wallPalette: 'Warm ivory walls, smoked oak floors, linen tones, stone accents',
    description: 'A low platform bed dressed in heavy linen sits opposite a full-height fluted wardrobe. A single wood-base table lamp casts amber light while a potted Monstera anchors the corner beneath a tall sash window.',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1400&h=1000&fit=crop',
    productCount: 13,
    searchTerms: ['japandi', 'bedroom', 'linen', 'minimal', 'serenity', 'warm white', 'platform bed'],
    productTypes: [
      { label: 'Bedroom',       count: 3 },
      { label: 'Storage',       count: 2 },
      { label: 'Lighting',      count: 2 },
      { label: 'Decor',         count: 3 },
      { label: 'Architectural', count: 3 }
    ],
    productIds: ['lowline_bed', 'fluted_tall_cabinet', 'emery_wardrobe', 'lamp_wood_base', 'ceramic_lamp', 'potted_plant', 'fiddle_leaf', 'ceramic_vase', 'woven_rug', 'window_sash', 'door_bedroom', 'linen_curtains', 'travertine_side']
  },
  {
    id: 'br-02-luxe-dark-suite',
    title: 'Luxe Dark Velvet Master Suite',
    roomType: 'Bedroom',
    style: 'Luxe',
    category: 'Bedroom',
    segment: 'Residential',
    by: 'Designer Pro',
    wallPalette: 'Charcoal plaster walls, deep forest green velvet, brushed brass accents',
    description: 'A channel-tufted bed with a towering velvet headboard anchors this dramatic suite. An ornate sideboard serves as the dresser, twin globe pendants hang low from the ceiling, and a glazed door leads to the ensuite.',
    image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1400&h=1000&fit=crop',
    productCount: 14,
    searchTerms: ['luxe', 'dark', 'velvet', 'bedroom', 'master suite', 'dramatic', 'charcoal'],
    productTypes: [
      { label: 'Bedroom',       count: 3 },
      { label: 'Storage',       count: 3 },
      { label: 'Lighting',      count: 3 },
      { label: 'Decor',         count: 3 },
      { label: 'Architectural', count: 2 }
    ],
    productIds: ['channel_tufted_bed', 'ornate_sideboard', 'cupboard_015', 'wardrobe_alex', 'globe_pendant', 'globe_pendant', 'led_strip', 'bust_marble', 'frame_fancy', 'gradient_art', 'woven_rug', 'door_wood_glass', 'window_black_frame', 'contemp_curtains']
  },
  {
    id: 'br-03-nordic-white',
    title: 'Nordic White Bedroom Retreat',
    roomType: 'Bedroom',
    style: 'Nordic',
    category: 'Bedroom',
    segment: 'Residential',
    by: 'Designer Pro',
    wallPalette: 'Bright white walls, bleached pine floors, soft grey and cream layered textiles',
    description: 'All-white restraint: a tall wardrobe, crisp platform bed, and glass-front cupboard keep the room serene. A potted plant by the window and a standing picture frame are the only adornments needed.',
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1400&h=1000&fit=crop',
    productCount: 12,
    searchTerms: ['nordic', 'white', 'bedroom', 'scandi', 'serene', 'minimal', 'pine'],
    productTypes: [
      { label: 'Bedroom',       count: 2 },
      { label: 'Storage',       count: 3 },
      { label: 'Lighting',      count: 2 },
      { label: 'Decor',         count: 2 },
      { label: 'Architectural', count: 3 }
    ],
    productIds: ['platform_storage_bed', 'emery_wardrobe', 'cupboard_020', 'cabinet_high', 'ceiling_spot', 'arc_lamp', 'potted_plant', 'frame_standing', 'woven_rug', 'window_slim', 'door_scandi', 'linen_curtains']
  },
  {
    id: 'br-04-classic-wood',
    title: 'Classic Wood Heritage Bedroom',
    roomType: 'Bedroom',
    style: 'Classic',
    category: 'Bedroom',
    segment: 'Residential',
    by: 'Designer Pro',
    wallPalette: 'Sage green wainscoting, warm walnut furniture, cream upholstery, brass fixtures',
    description: 'A gothic carved bed frame in rich walnut anchors this heritage suite. Sage-green panelled walls complement the country chest of drawers and an antique-style wardrobe. Ornate iron doors and a sash window complete the look.',
    image: 'https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=1400&h=1000&fit=crop',
    productCount: 14,
    searchTerms: ['classic', 'wood', 'heritage', 'walnut', 'bedroom', 'traditional', 'sage green'],
    productTypes: [
      { label: 'Bedroom',       count: 3 },
      { label: 'Storage',       count: 3 },
      { label: 'Lighting',      count: 3 },
      { label: 'Decor',         count: 3 },
      { label: 'Architectural', count: 2 }
    ],
    productIds: ['gothic_bed', 'country_chest', 'wardrobe_alex', 'cupboard_043', 'globe_pendant', 'ceramic_lamp', 'lamp_wood_base', 'bust_marble', 'frame_fancy', 'ribbed_vase', 'woven_rug', 'window_sash', 'door_iron_ornate', 'contemp_curtains']
  },
  {
    id: 'br-05-modern-platform',
    title: 'Sleek Modern Platform Bedroom',
    roomType: 'Bedroom',
    style: 'Modern',
    category: 'Bedroom',
    segment: 'Residential',
    by: 'Designer Pro',
    wallPalette: 'Warm greige walls, dark walnut veneer, matte black fittings, grey stone flooring',
    description: 'A floating platform bed with integrated storage sits flush against a floor-to-ceiling wardrobe wall. Recessed ceiling spots, an LED strip behind the headboard, and a glass-panel door to the ensuite bring this modern suite together.',
    image: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=1400&h=1000&fit=crop',
    productCount: 13,
    searchTerms: ['modern', 'platform bed', 'bedroom', 'minimal', 'dark wood', 'integrated storage'],
    productTypes: [
      { label: 'Bedroom',       count: 2 },
      { label: 'Storage',       count: 4 },
      { label: 'Lighting',      count: 4 },
      { label: 'Architectural', count: 3 }
    ],
    productIds: ['platform_storage_bed', 'emery_wardrobe', 'cupboard_015', 'cupboard_020', 'fluted_tall_cabinet', 'ceiling_spot', 'ceiling_spot', 'led_strip', 'slim_floor_lamp', 'door_wood_glass', 'window_modern', 'window_slim', 'woven_rug']
  },
  {
    id: 'br-06-boho-eclectic',
    title: 'Boho Eclectic Dreamer\'s Bedroom',
    roomType: 'Bedroom',
    style: 'Bohemian',
    category: 'Bedroom',
    segment: 'Residential',
    by: 'Designer Pro',
    wallPalette: 'Dusty terracotta walls, rattan and bamboo textures, warm layered macramé',
    description: 'Layered textiles on a classic wood bed, oversized macramé, dip-dyed curtains, and a cluster of ceramic vessels bring this bohemian retreat to life. The ornate iron door and Georgian sash window frame a setting full of personality.',
    image: 'https://images.unsplash.com/photo-1556020685-ae41abfc9365?w=1400&h=1000&fit=crop',
    productCount: 15,
    searchTerms: ['boho', 'eclectic', 'bedroom', 'rattan', 'macramé', 'layered', 'terracotta'],
    productTypes: [
      { label: 'Bedroom',       count: 3 },
      { label: 'Storage',       count: 2 },
      { label: 'Lighting',      count: 3 },
      { label: 'Decor',         count: 5 },
      { label: 'Architectural', count: 2 }
    ],
    productIds: ['gothic_bed', 'classic_bedroom', 'country_chest', 'cupboard_043', 'arc_lamp', 'ceramic_lamp', 'globe_pendant', 'potted_plant', 'fiddle_leaf', 'ceramic_vase', 'ribbed_vase', 'frame_standing', 'woven_rug', 'contemp_curtains', 'window_sash']
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // BATHROOMS
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'ba-01-volcanic-copper-spa',
    title: 'Volcanic Stone & Copper Spa',
    roomType: 'Bathroom',
    style: 'Spa Luxury',
    category: 'Bathroom',
    segment: 'Residential',
    by: 'Designer Pro',
    wallPalette: 'Dark basalt slate tiles, raw volcanic stone basin plinth, polished copper fixtures, warm amber lighting',
    description: 'Dark basalt slate walls make every fixture glow. The Sculpted Freestanding Bathtub rests on the heated stone floor beside an oversized Glass Shower Enclosure with a natural pebble tray. A Karpo D wall-mount faucet in polished copper fills the Bathroom Vanity trough sink. The Sleek White Toilet hides behind a fluted partition wall. LED strip recessed at floor-level traces the perimeter in amber light; a single opal pendant warms the tub zone. A wood-glass panel door and a modern picture window ensure the room breathes.',
    image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=1400&h=1000&fit=crop',
    productCount: 16,
    searchTerms: ['bathroom', 'volcanic', 'stone', 'copper', 'spa', 'dramatic', 'dark', 'luxury'],
    productTypes: [
      { label: 'Bathroom',      count: 7 },
      { label: 'Lighting',      count: 4 },
      { label: 'Decor',         count: 2 },
      { label: 'Architectural', count: 3 }
    ],
    productIds: ['bathtub_realistic', 'bathroom_vanity', 'shower_glass', 'toilet_sleek', 'faucet_karpo', 'under_sink_storage', 'brass_towel_rack', 'bath_mat', 'led_strip', 'led_strip', 'opal_pendant', 'ceiling_spot', 'potted_plant', 'ribbed_vase', 'door_wood_glass', 'window_modern']
  },
  {
    id: 'ba-02-victorian-arched',
    title: 'Victorian Arched Sanctuary',
    roomType: 'Bathroom',
    style: 'Classic',
    category: 'Bathroom',
    segment: 'Residential',
    by: 'Designer Pro',
    wallPalette: 'Victorian hexagonal floor tiles, sage-green dado rail, cream Venetian plaster above, polished brass',
    description: 'The Ornate Iron Entry Door swings open to reveal a high-ceilinged Victorian sanctuary. A Classic Roll-Top Bathtub occupies the window bay — lit by a Georgian Sash Window and a wall-mount Phobos bath faucet in polished brass. The Pedestal Sink with Gold Faucet stands on hex tiles beside a high-tank Wall-Hung Toilet. A ceramic wall sconce casts warm pools of light and a round mirror doubles the brass reflections. Under-sink storage keeps the classical composition uncluttered.',
    image: 'https://images.unsplash.com/photo-1620626011761-996317702782?w=1400&h=1000&fit=crop',
    productCount: 14,
    searchTerms: ['bathroom', 'victorian', 'arched', 'clawfoot', 'brass', 'heritage', 'classic', 'pedestal'],
    productTypes: [
      { label: 'Bathroom',      count: 6 },
      { label: 'Lighting',      count: 3 },
      { label: 'Decor',         count: 2 },
      { label: 'Architectural', count: 3 }
    ],
    productIds: ['bathtub_classic', 'pedestal_sink_gold', 'faucet_phobos', 'wall_toilet', 'under_sink_storage', 'brass_towel_rack', 'bath_mat', 'ceramic_lamp', 'ceiling_spot', 'round_mirror', 'bust_marble', 'door_iron_ornate', 'window_sash', 'frame_fancy']
  },
  {
    id: 'ba-03-rainforest-botanica',
    title: 'Rainforest Botanica Suite',
    roomType: 'Bathroom',
    style: 'Earthy Warm',
    category: 'Bathroom',
    segment: 'Residential',
    by: 'Designer Pro',
    wallPalette: 'Tropical leaf wallpaper feature wall, sage-toned zellige tiles, brushed brass, natural linen tones',
    description: 'Layered botanics set the scene: a Fiddle Leaf Fig in the corner, trailing potted plants on the vanity shelf, and tropical-print wallpaper behind the tub. The Sculpted Freestanding Bathtub sits by the Black Frame Picture Window drawing the garden inside. A Rossel faucet in brushed brass serves the Marble Vanity twin-basin. The Glass Shower Enclosure has a Karpo D rain head and a mosaic stone tray. A single globe pendant hangs above the tub; LED strips run behind the vanity mirror and the Flat Panel Oak Door opens from the dressing room.',
    image: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=1400&h=1000&fit=crop',
    productCount: 17,
    searchTerms: ['bathroom', 'rainforest', 'botanical', 'tropical', 'warm', 'brass', 'greenery'],
    productTypes: [
      { label: 'Bathroom',      count: 7 },
      { label: 'Lighting',      count: 4 },
      { label: 'Decor',         count: 3 },
      { label: 'Architectural', count: 3 }
    ],
    productIds: ['bathtub_realistic', 'marble_vanity', 'shower_glass', 'toilet_sleek', 'faucet_rossel', 'faucet_karpo', 'under_sink_storage', 'brass_towel_rack', 'bath_mat', 'globe_pendant', 'led_strip', 'ceiling_spot', 'ceiling_spot', 'fiddle_leaf', 'potted_plant', 'door_flat_oak', 'window_black_frame']
  },
  {
    id: 'ba-04-midnight-navy-gold',
    title: 'Midnight Navy, Gold & Marble Suite',
    roomType: 'Bathroom',
    style: 'Boutique Hotel',
    category: 'Bathroom',
    segment: 'Residential',
    by: 'Designer Pro',
    wallPalette: 'Midnight navy lacquered walls, Calacatta gold marble floor, polished-brass fixtures throughout',
    description: 'Navy lacquered walls create a jewel-box effect around a matte-white Classic Roll-Top Bathtub fitted with a Berkel faucet in polished gold. The Glass Shower Enclosure has gold-frame glass panels beside a Marble Vanity with twin basins and a statement soft-edge mirror. The Wall-Hung Toilet conceals behind a half-height marble partition. LED strips recessed in the marble floor create a floating glow effect. The Arched Wrought Iron Door in burnished gold frames a perfect silhouette.',
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1400&h=1000&fit=crop',
    productCount: 16,
    searchTerms: ['bathroom', 'midnight navy', 'gold', 'marble', 'boutique hotel', 'luxury', 'jewel'],
    productTypes: [
      { label: 'Bathroom',      count: 7 },
      { label: 'Lighting',      count: 4 },
      { label: 'Decor',         count: 2 },
      { label: 'Architectural', count: 3 }
    ],
    productIds: ['bathtub_classic', 'marble_vanity', 'shower_glass', 'wall_toilet', 'faucet_berkel', 'under_sink_storage', 'brass_towel_rack', 'bath_mat', 'led_strip', 'led_strip', 'opal_pendant', 'ceiling_spot', 'wall_mirror_soft', 'ribbed_vase', 'door_iron_arched', 'window_sash']
  },
  {
    id: 'ba-05-wabi-sabi-soaking',
    title: 'Wabi-Sabi Japanese Soaking Room',
    roomType: 'Bathroom',
    style: 'Japandi',
    category: 'Bathroom',
    segment: 'Residential',
    by: 'Designer Pro',
    wallPalette: 'Unpainted Hinoki timber panelling, raw cement floor, earth-toned hand-formed tiles, iron fittings',
    description: 'A deep Freestanding Soaking Tub with a Karpo D wall-mount spout in matte iron occupies the quiet centre of this Japanese-inspired bathroom. The Glass Shower has a natural pebble-mosaic floor and a recessed shelf. A Bathroom Vanity on a timber plinth holds a single wabi-sabi vessel basin with a Phobos wall tap. The Woven Bath Mat, a single Potted Plant in a raw ceramic bowl, and a row of ribbed vases on the window sill add organic texture. Slim casement windows and a Scandinavian timber panel door let in soft filtered light.',
    image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=1400&h=1000&fit=crop&crop=right',
    productCount: 15,
    searchTerms: ['bathroom', 'japandi', 'japanese', 'wabi-sabi', 'soaking tub', 'timber', 'zen', 'minimal'],
    productTypes: [
      { label: 'Bathroom',      count: 6 },
      { label: 'Lighting',      count: 4 },
      { label: 'Decor',         count: 3 },
      { label: 'Architectural', count: 2 }
    ],
    productIds: ['freestanding_tub', 'bathroom_vanity', 'shower_glass', 'toilet_sleek', 'faucet_karpo', 'faucet_phobos', 'bath_mat', 'lamp_wood_base', 'led_strip', 'ceiling_spot', 'ceiling_spot', 'potted_plant', 'ceramic_vase', 'ribbed_vase', 'door_scandi']
  },
  {
    id: 'ba-06-hamptons-chrome',
    title: 'Hamptons White Shiplap Boutique',
    roomType: 'Bathroom',
    style: 'Coastal',
    category: 'Bathroom',
    segment: 'Residential',
    by: 'Designer Pro',
    wallPalette: 'Crisp white shiplap, chrome and white fixtures, pale grey patterned penny tiles, woven linen accessories',
    description: 'White-painted shiplap walls and classic chrome fixtures give this Hamptons bathroom its breezy confidence. The Contemporary Bath Suite anchors one end — a deep bath and a rainfall shower in the same marble-tiled zone. A Pedestal Sink with a Rossel faucet stands on the penny-tile floor beside the Wall-Hung Toilet. A round mirror and pair of recessed spots above the vanity, a Woven Bath Mat, stacked white towels on the Brass Towel Rack. Classic Casement Windows and a Flat Panel Oak Door admit ocean-white light.',
    image: 'https://images.unsplash.com/photo-1620626011761-996317702782?w=1400&h=1000&fit=crop&crop=right',
    productCount: 16,
    searchTerms: ['bathroom', 'hamptons', 'shiplap', 'white', 'coastal', 'chrome', 'clean', 'classic'],
    productTypes: [
      { label: 'Bathroom',      count: 7 },
      { label: 'Lighting',      count: 3 },
      { label: 'Decor',         count: 3 },
      { label: 'Architectural', count: 3 }
    ],
    productIds: ['bath_suite', 'pedestal_sink_gold', 'faucet_rossel', 'shower_glass', 'wall_toilet', 'under_sink_storage', 'brass_towel_rack', 'bath_mat', 'ceiling_spot', 'ceiling_spot', 'arc_lamp', 'round_mirror', 'woven_rug', 'potted_plant', 'window_casement', 'door_flat_oak']
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // DINING ROOMS
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'di-01-marble-formal',
    title: 'Marble & Velvet Formal Dining',
    roomType: 'Dining',
    style: 'Formal',
    category: 'Dining',
    segment: 'Residential',
    by: 'Designer Pro',
    wallPalette: 'Ivory plaster walls, Calacatta marble table, velvet dining chairs, brass chandelier',
    description: 'A polished marble dining table seats eight beneath a sculptural rattan chandelier. Velvet high-back chairs, a full-length ornate sideboard, and a glazed iron door make this dining room the definitive showpiece of the home.',
    image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=1400&h=1000&fit=crop',
    productCount: 14,
    searchTerms: ['dining', 'formal', 'marble', 'velvet', 'chandelier', 'elegant', 'dinner party'],
    productTypes: [
      { label: 'Tables',        count: 2 },
      { label: 'Seating',       count: 4 },
      { label: 'Lighting',      count: 3 },
      { label: 'Storage',       count: 2 },
      { label: 'Decor',         count: 3 }
    ],
    productIds: ['modern_dining_set', 'atlas_table', 'luna_chair', 'slat_chair', 'alto_stool', 'globe_pendant', 'opal_pendant', 'ceiling_spot', 'ornate_sideboard', 'oslo_sideboard', 'bust_marble', 'frame_fancy', 'gradient_art', 'woven_rug']
  },
  {
    id: 'di-02-farmhouse-harvest',
    title: 'Farmhouse Harvest Dining Room',
    roomType: 'Dining',
    style: 'Farmhouse',
    category: 'Dining',
    segment: 'Residential',
    by: 'Designer Pro',
    wallPalette: 'Shiplap white walls, aged oak table, iron pendant, linen runner',
    description: 'A long aged-oak trestle table surrounded by slat-back chairs brings warmth and community to this farmhouse dining space. A clustered pendant over the table, a fiddle leaf fig in the corner, and Georgian windows add the perfect pastoral touches.',
    image: 'https://images.unsplash.com/photo-1616047006789-b7af5afb8c20?w=1400&h=1000&fit=crop',
    productCount: 13,
    searchTerms: ['farmhouse', 'dining', 'oak table', 'rustic', 'country', 'harvest', 'warm'],
    productTypes: [
      { label: 'Tables',        count: 1 },
      { label: 'Seating',       count: 4 },
      { label: 'Lighting',      count: 3 },
      { label: 'Storage',       count: 1 },
      { label: 'Decor',         count: 4 }
    ],
    productIds: ['atlas_table', 'slat_chair', 'slat_chair', 'slat_chair', 'alto_stool', 'globe_pendant', 'globe_pendant', 'arc_lamp', 'cabinet_low', 'fiddle_leaf', 'potted_plant', 'woven_rug', 'window_sash']
  },
  {
    id: 'di-03-jewel-maximalist',
    title: 'Jewel-Tone Maximalist Dining',
    roomType: 'Dining',
    style: 'Maximalist',
    category: 'Dining',
    segment: 'Residential',
    by: 'Designer Pro',
    wallPalette: 'Burnt sienna walls, cobalt velvet chairs, rattan chandelier, abstract gallery wall',
    description: 'Cobalt velvet chairs surround an ornate dining table under a showstopper rattan chandelier. An abstract gallery wall opposite, an ornate sideboard, and classic iron entry doors command every eye in the room.',
    image: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=1400&h=1000&fit=crop',
    productCount: 14,
    searchTerms: ['maximalist', 'dining', 'jewel tone', 'cobalt', 'ornate', 'statement', 'bold'],
    productTypes: [
      { label: 'Tables',        count: 1 },
      { label: 'Seating',       count: 4 },
      { label: 'Lighting',      count: 3 },
      { label: 'Storage',       count: 2 },
      { label: 'Decor',         count: 4 }
    ],
    productIds: ['modern_dining_set', 'luna_chair', 'luna_chair', 'armchair_boucle', 'armchair_walnut', 'globe_pendant', 'opal_pendant', 'arc_lamp', 'ornate_sideboard', 'cabinet_antares', 'bust_marble', 'frame_fancy', 'gradient_art', 'door_iron_ornate']
  },
  {
    id: 'di-04-scandi-open',
    title: 'Scandi Open Dining Corner',
    roomType: 'Dining',
    style: 'Scandinavian',
    category: 'Dining',
    segment: 'Residential',
    by: 'Designer Pro',
    wallPalette: 'Chalk-white walls, pale ash furniture, woven pendant, muted sage accents',
    description: 'A round pale-ash dining table with slat chairs keeps this Scandinavian corner easy and honest. A single opal pendant, a potted Monstera, and a standing picture frame are all the decoration this confident room needs.',
    image: 'https://images.unsplash.com/photo-1449247666642-264389f5f5b1?w=1400&h=1000&fit=crop',
    productCount: 10,
    searchTerms: ['scandi', 'dining', 'minimal', 'ash', 'white', 'round table', 'honest'],
    productTypes: [
      { label: 'Tables',        count: 1 },
      { label: 'Seating',       count: 3 },
      { label: 'Lighting',      count: 2 },
      { label: 'Decor',         count: 2 },
      { label: 'Architectural', count: 2 }
    ],
    productIds: ['atlas_table', 'slat_chair', 'slat_chair', 'slat_chair', 'opal_pendant', 'ceiling_spot', 'potted_plant', 'frame_standing', 'window_slim', 'door_scandi']
  },
  {
    id: 'di-05-industrial-dining',
    title: 'Industrial Urban Dining Room',
    roomType: 'Dining',
    style: 'Industrial',
    category: 'Dining',
    segment: 'Residential',
    by: 'Designer Pro',
    wallPalette: 'Exposed concrete walls, steel and reclaimed oak, Edison bulb pendants',
    description: 'A long reclaimed-oak table on blackened steel legs seats eight beneath Edison bulb pendants. The arched iron door, grid media unit, and abstract standing frames give this loft dining room its raw urban energy.',
    image: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=1400&h=1000&fit=crop&crop=bottom',
    productCount: 13,
    searchTerms: ['industrial', 'dining', 'urban', 'loft', 'steel', 'edison', 'dark'],
    productTypes: [
      { label: 'Tables',        count: 1 },
      { label: 'Seating',       count: 4 },
      { label: 'Lighting',      count: 3 },
      { label: 'Storage',       count: 2 },
      { label: 'Decor',         count: 3 }
    ],
    productIds: ['atlas_table', 'chair_032', 'chair_032', 'alto_stool', 'alto_stool', 'globe_pendant', 'globe_pendant', 'slim_floor_lamp', 'grid_media', 'cabinet_blade', 'frame_standing', 'frame_fancy', 'door_iron_arched']
  },
  {
    id: 'di-06-classic-ornate',
    title: 'Classic Ornate Formal Dining',
    roomType: 'Dining',
    style: 'Classic',
    category: 'Dining',
    segment: 'Residential',
    by: 'Designer Pro',
    wallPalette: 'Deep burgundy damask walls, polished mahogany, ivory candelabra, gold leaf',
    description: 'Ornate sideboard, upholstered dining chairs, and a rattan chandelier reinterpreted in gilded copper establish the mood. A marble bust on the console, plaster arch entry door, and classical art complete this grand dining room.',
    image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=1400&h=1000&fit=crop&crop=right',
    productCount: 15,
    searchTerms: ['classic', 'ornate', 'dining', 'formal', 'traditional', 'mahogany', 'grand'],
    productTypes: [
      { label: 'Tables',        count: 2 },
      { label: 'Seating',       count: 4 },
      { label: 'Lighting',      count: 3 },
      { label: 'Storage',       count: 2 },
      { label: 'Decor',         count: 4 }
    ],
    productIds: ['modern_dining_set', 'linear_console', 'luna_chair', 'armchair_boucle', 'slat_chair', 'alto_stool', 'globe_pendant', 'ceramic_lamp', 'arc_lamp', 'ornate_sideboard', 'cabinet_antares', 'bust_marble', 'frame_fancy', 'gradient_art', 'door_iron_ornate']
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // MULTI-ROOM / WHOLE HOME
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'mh-01-modern-apartment',
    title: 'Complete Modern Apartment',
    roomType: 'Multi-Room',
    style: 'Contemporary',
    category: 'Whole Home',
    segment: 'Residential',
    by: 'Designer Pro',
    wallPalette: 'Warm white throughout, matching oak floors, black and brass accents unify every space',
    description: 'An open-plan apartment where the living zone, kitchen island, and dining table flow together. Every room — living, kitchen, bedroom, bathroom — shares the same warm-white and brass language, connected by glass-panel doors and picture windows.',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1400&h=1000&fit=crop&crop=right',
    productCount: 28,
    searchTerms: ['apartment', 'open plan', 'complete', 'whole home', 'modern', 'cohesive'],
    productTypes: [
      { label: 'Seating',       count: 5 },
      { label: 'Kitchen',       count: 4 },
      { label: 'Bedroom',       count: 3 },
      { label: 'Bathroom',      count: 3 },
      { label: 'Lighting',      count: 5 },
      { label: 'Architectural', count: 5 },
      { label: 'Decor',         count: 3 }
    ],
    productIds: ['sofa_contemporary', 'armchair_boucle', 'coffee_table_oak', 'alto_stool', 'alto_stool', 'kitchen_elegant', 'kitchen_island', 'fridge_samsung', 'hood_ch60', 'modern_dining_set', 'lowline_bed', 'emery_wardrobe', 'bathtub_realistic', 'shower_glass', 'marble_vanity', 'globe_pendant', 'ceiling_spot', 'led_strip', 'arc_lamp', 'opal_pendant', 'door_wood_glass', 'door_flat_oak', 'window_black_frame', 'window_modern', 'window_slim', 'potted_plant', 'woven_rug', 'gradient_art']
  },
  {
    id: 'mh-02-scandi-family',
    title: 'Scandinavian Family Home',
    roomType: 'Multi-Room',
    style: 'Scandinavian',
    category: 'Whole Home',
    segment: 'Residential',
    by: 'Designer Pro',
    wallPalette: 'Chalky white paint, pale ash furniture, wool textiles, sage-green kitchen',
    description: 'A complete Scandinavian home layout: cloud sectional in the living room, sage-green IKEA-style kitchen, a Japandi master bedroom, a clean family bathroom, and a simple oak dining table. All connected by natural light and honest materials.',
    image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb3?w=1400&h=1000&fit=crop&crop=right',
    productCount: 26,
    searchTerms: ['scandi', 'family home', 'whole home', 'chalk white', 'sage kitchen', 'nordic'],
    productTypes: [
      { label: 'Seating',       count: 4 },
      { label: 'Kitchen',       count: 3 },
      { label: 'Bedroom',       count: 3 },
      { label: 'Bathroom',      count: 3 },
      { label: 'Lighting',      count: 5 },
      { label: 'Architectural', count: 5 },
      { label: 'Decor',         count: 3 }
    ],
    productIds: ['cloud_sectional', 'slat_chair', 'armchair_walnut', 'atlas_table', 'kitchen_vedinge', 'cooktop_l', 'fridge_samsung', 'platform_storage_bed', 'emery_wardrobe', 'bath_suite', 'shower_glass', 'wall_toilet', 'ceiling_spot', 'opal_pendant', 'arc_lamp', 'ceramic_lamp', 'globe_pendant', 'door_scandi', 'door_bedroom', 'window_slim', 'window_casement', 'window_sash', 'potted_plant', 'fiddle_leaf', 'woven_rug', 'linen_curtains']
  },
  {
    id: 'mh-03-urban-studio',
    title: 'Urban Studio Apartment',
    roomType: 'Multi-Room',
    style: 'Compact Modern',
    category: 'Whole Home',
    segment: 'Residential',
    by: 'Designer Pro',
    wallPalette: 'Dove grey walls, dark herringbone floors, charcoal and caramel accents',
    description: 'A studio that does it all: a compact kitchen with induction cooktop along one wall, a platform bed with integrated storage behind a dividing shelf unit, a glass shower wet room, and a slim sofa — all connected by clever compact design.',
    image: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=1400&h=1000&fit=crop&crop=left',
    productCount: 20,
    searchTerms: ['studio', 'compact', 'urban', 'space saving', 'efficient', 'apartment'],
    productTypes: [
      { label: 'Seating',       count: 3 },
      { label: 'Kitchen',       count: 3 },
      { label: 'Bedroom',       count: 2 },
      { label: 'Bathroom',      count: 2 },
      { label: 'Lighting',      count: 4 },
      { label: 'Storage',       count: 4 },
      { label: 'Architectural', count: 2 }
    ],
    productIds: ['sofa_modular_linen', 'armchair_boucle', 'coffee_table_rect', 'kitchen_vedinge', 'cooktop_l', 'fridge_samsung', 'platform_storage_bed', 'shower_glass', 'wall_toilet', 'cube_bookshelf', 'grid_media', 'entry_bench', 'minimal_storage_console', 'ceiling_spot', 'led_strip', 'slim_floor_lamp', 'arc_lamp', 'door_flat_oak', 'window_black_frame', 'woven_rug']
  },
  {
    id: 'mh-04-luxury-villa',
    title: 'Luxury Villa Suite',
    roomType: 'Multi-Room',
    style: 'Luxury',
    category: 'Whole Home',
    segment: 'Residential',
    by: 'Designer Pro',
    wallPalette: 'Venetian plaster, Calacatta gold marble, bespoke millwork, soft gold and emerald',
    description: 'Grand proportions across every room: a jewel-tone living room, marble professional kitchen, gothic master bedroom, and a full hotel spa bathroom. Ornate iron entry doors, arched internal glazing, and towering windows amplify the sense of scale.',
    image: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=1400&h=1000&fit=crop&crop=right',
    productCount: 32,
    searchTerms: ['luxury', 'villa', 'grand', 'high end', 'opulent', 'marble', 'whole home'],
    productTypes: [
      { label: 'Seating',       count: 5 },
      { label: 'Kitchen',       count: 4 },
      { label: 'Bedroom',       count: 4 },
      { label: 'Bathroom',      count: 5 },
      { label: 'Lighting',      count: 6 },
      { label: 'Architectural', count: 5 },
      { label: 'Decor',         count: 3 }
    ],
    productIds: ['low_arc_sectional', 'luna_chair', 'armchair_boucle', 'cloud_sectional', 'carrara_table', 'kitchen_elegant', 'kitchen_island', 'gas_stove_pro', 'hood_ch60', 'fridge_samsung', 'gothic_bed', 'cupboard_015', 'wardrobe_alex', 'fluted_tall_cabinet', 'bathtub_realistic', 'bath_suite', 'shower_glass', 'marble_vanity', 'toilet_sleek', 'globe_pendant', 'opal_pendant', 'led_strip', 'ceiling_spot', 'arc_lamp', 'ceramic_lamp', 'slim_floor_lamp', 'door_iron_ornate', 'door_arched_glass', 'window_black_frame', 'window_sash', 'window_modern', 'bust_marble']
  },
  {
    id: 'mh-05-coastal-retreat',
    title: 'Coastal Weekend Retreat',
    roomType: 'Multi-Room',
    style: 'Coastal',
    category: 'Whole Home',
    segment: 'Residential',
    by: 'Designer Pro',
    wallPalette: 'Limewash white, bleached driftwood, sea-grass and sand tones, casement windows',
    description: 'Every room of this coastal house breathes sea air: a rattan-accented living room, a clean white kitchen with oak island, a breezy bedroom with linen curtains, and an earthy spa bathroom. Casement windows and glazed doors bring the outside in.',
    image: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=1400&h=1000&fit=crop&crop=right',
    productCount: 24,
    searchTerms: ['coastal', 'beach house', 'weekend retreat', 'rattan', 'linen', 'whole home'],
    productTypes: [
      { label: 'Seating',       count: 4 },
      { label: 'Kitchen',       count: 3 },
      { label: 'Bedroom',       count: 3 },
      { label: 'Bathroom',      count: 3 },
      { label: 'Lighting',      count: 4 },
      { label: 'Architectural', count: 4 },
      { label: 'Decor',         count: 3 }
    ],
    productIds: ['sofa_contemporary', 'armchair_walnut', 'armchair_boucle', 'coffee_table_oak', 'kitchen_vedinge', 'kitchen_island', 'cooktop_l', 'lowline_bed', 'emery_wardrobe', 'bathtub_classic', 'shower_glass', 'wall_toilet', 'globe_pendant', 'opal_pendant', 'ceiling_spot', 'arc_lamp', 'door_wood_glass', 'door_bedroom', 'window_casement', 'window_slim', 'potted_plant', 'fiddle_leaf', 'woven_rug', 'linen_curtains']
  },
  {
    id: 'mh-06-heritage-classic',
    title: 'Classic Heritage Home',
    roomType: 'Multi-Room',
    style: 'Classic',
    category: 'Whole Home',
    segment: 'Residential',
    by: 'Designer Pro',
    wallPalette: 'Plantation green wainscoting, aged brass hardware, parquet floors, plaster cornicing',
    description: 'A complete classic home: an ornate-doored entrance parlour, classic kitchen with copper range hood, a gothic bedroom with country chest, and a clawfoot bath suite. Sash windows, ornate iron doors, and heritage panelling throughout.',
    image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=1400&h=1000&fit=crop&crop=right',
    productCount: 26,
    searchTerms: ['classic', 'heritage', 'traditional', 'Victorian', 'whole home', 'wainscoting'],
    productTypes: [
      { label: 'Seating',       count: 4 },
      { label: 'Kitchen',       count: 3 },
      { label: 'Bedroom',       count: 4 },
      { label: 'Bathroom',      count: 4 },
      { label: 'Lighting',      count: 4 },
      { label: 'Architectural', count: 5 },
      { label: 'Decor',         count: 2 }
    ],
    productIds: ['sofa_fabric', 'armchair_boucle', 'luna_chair', 'atlas_table', 'kitchen_elegant', 'gas_stove_pro', 'hood_ch60', 'gothic_bed', 'country_chest', 'wardrobe_alex', 'cupboard_043', 'freestanding_tub', 'pedestal_sink_gold', 'bath_suite', 'wall_toilet', 'globe_pendant', 'ceramic_lamp', 'arc_lamp', 'arc_lamp', 'door_iron_ornate', 'door_arched_glass', 'door_wood_glass', 'window_sash', 'window_sash', 'window_casement', 'bust_marble']
  }
];

export const inspirationLibrary = inspirationEntries.map((entry) => ({
  ...entry,
  products: entry.productIds.map((pid) => productCatalog[pid]).filter(Boolean)
}));

export const ROOM_TYPES = ['All', 'Living Room', 'Kitchen', 'Bedroom', 'Bathroom', 'Dining', 'Multi-Room'];

export const ROOM_TYPE_META = {
  'Living Room': { color: '#d97706', bg: 'rgba(217,119,6,0.1)',  icon: '🛋️' },
  'Kitchen':     { color: '#059669', bg: 'rgba(5,150,105,0.1)',  icon: '🍳' },
  'Bedroom':     { color: '#7c3aed', bg: 'rgba(124,58,237,0.1)', icon: '🛏️' },
  'Bathroom':    { color: '#0ea5e9', bg: 'rgba(14,165,233,0.1)', icon: '🛁' },
  'Dining':      { color: '#db2777', bg: 'rgba(219,39,119,0.1)', icon: '🍽️' },
  'Multi-Room':  { color: '#64748b', bg: 'rgba(100,116,139,0.1)','icon': '🏠' },
};
