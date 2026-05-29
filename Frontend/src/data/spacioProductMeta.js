export const ROOM_TYPES = [
  'living_room', 'bedroom', 'dining_room', 'kitchen', 'bathroom', 'office',
  'entryway', 'hallway', 'nursery', 'closet', 'utility', 'balcony', 'outdoor', 'generic',
];

export const ROOM_TYPE_LABELS = {
  auto: 'Auto',
  all: 'All assets',
  living_room: 'Living Room',
  bedroom: 'Bedroom',
  dining_room: 'Dining Room',
  kitchen: 'Kitchen',
  bathroom: 'Bathroom',
  office: 'Office',
  entryway: 'Entryway',
  generic: 'Generic',
};

export const PLACEMENT_TYPES = ['floor', 'wall', 'ceiling', 'surface', 'rug'];

export const STYLE_TAGS = [
  'Scandinavian', 'Japandi', 'Modern', 'Minimal', 'Contemporary',
  'Industrial', 'Luxury', 'Bohemian', 'Classic',
];

export const FILTER_CATEGORIES = [
  'All', 'Seating', 'Tables', 'Storage', 'Lighting', 'Decor', 'Plants', 'Textiles', 'Art', 'Architecture',
];

const meta = (overrides) => ({
  roomTypes: ['generic'],
  styleTags: ['Modern'],
  placementType: 'floor',
  wallAttachable: false,
  ceilingAttachable: false,
  floorStanding: true,
  requiresWall: false,
  requiresCeiling: false,
  allowedRoomTypes: ['generic'],
  disallowedRoomTypes: [],
  materialSlots: ['primary'],
  collisionShape: 'box',
  defaultRotation: 0,
  defaultClearanceCm: 60,
  modelQuality: 'procedural',
  ...overrides,
});

/** @type {Record<string, ReturnType<typeof meta>>} */
export const productMetaById = {
  'moderno-sofa': meta({ roomTypes: ['living_room'], allowedRoomTypes: ['living_room', 'office', 'generic'], styleTags: ['Scandinavian', 'Modern'], placementType: 'floor', categoryGroup: 'Seating' }),
  'vale-armchair': meta({ roomTypes: ['living_room', 'bedroom'], allowedRoomTypes: ['living_room', 'bedroom', 'office', 'generic'], styleTags: ['Scandinavian', 'Modern'], placementType: 'floor', categoryGroup: 'Seating' }),
  'slat-chair': meta({ roomTypes: ['dining_room', 'kitchen'], allowedRoomTypes: ['dining_room', 'kitchen', 'generic'], styleTags: ['Scandinavian', 'Japandi'], placementType: 'floor', categoryGroup: 'Seating' }),
  'alto-stool': meta({ roomTypes: ['kitchen'], allowedRoomTypes: ['kitchen', 'dining_room', 'generic'], styleTags: ['Industrial', 'Modern'], placementType: 'floor', categoryGroup: 'Seating' }),
  'cloud-sectional': meta({ roomTypes: ['living_room'], allowedRoomTypes: ['living_room', 'generic'], styleTags: ['Contemporary', 'Minimal'], placementType: 'floor', categoryGroup: 'Seating' }),
  'luna-chair': meta({ roomTypes: ['living_room', 'bedroom'], allowedRoomTypes: ['living_room', 'bedroom', 'generic'], styleTags: ['Luxury', 'Contemporary'], placementType: 'floor', categoryGroup: 'Seating' }),
  'atlas-table': meta({ roomTypes: ['dining_room'], allowedRoomTypes: ['dining_room', 'kitchen', 'generic'], styleTags: ['Scandinavian', 'Modern'], placementType: 'floor', categoryGroup: 'Tables' }),
  'carrara-table': meta({ roomTypes: ['living_room'], allowedRoomTypes: ['living_room', 'generic'], styleTags: ['Modern', 'Luxury'], placementType: 'floor', categoryGroup: 'Tables' }),
  'sol-side-table': meta({ roomTypes: ['living_room', 'bedroom'], allowedRoomTypes: ['living_room', 'bedroom', 'generic'], styleTags: ['Modern', 'Minimal'], placementType: 'floor', categoryGroup: 'Tables' }),
  'northline-desk': meta({ roomTypes: ['office'], allowedRoomTypes: ['office', 'bedroom', 'generic'], styleTags: ['Scandinavian', 'Modern'], placementType: 'floor', categoryGroup: 'Tables' }),
  'pebble-tables': meta({ roomTypes: ['living_room'], allowedRoomTypes: ['living_room', 'generic'], styleTags: ['Contemporary'], placementType: 'floor', categoryGroup: 'Tables' }),
  'linear-console': meta({ roomTypes: ['entryway', 'living_room'], allowedRoomTypes: ['entryway', 'living_room', 'hallway', 'generic'], styleTags: ['Minimal', 'Modern'], placementType: 'floor', categoryGroup: 'Tables' }),
  'stringline-shelf': meta({ roomTypes: ['living_room', 'office'], allowedRoomTypes: ['living_room', 'office', 'bedroom', 'generic'], styleTags: ['Scandinavian'], placementType: 'floor', wallAttachable: true, categoryGroup: 'Storage' }),
  'oslo-sideboard': meta({ roomTypes: ['dining_room', 'living_room'], allowedRoomTypes: ['dining_room', 'living_room', 'generic'], styleTags: ['Scandinavian', 'Modern'], placementType: 'floor', categoryGroup: 'Storage' }),
  'emery-wardrobe': meta({ roomTypes: ['bedroom'], allowedRoomTypes: ['bedroom', 'closet', 'generic'], disallowedRoomTypes: ['bathroom', 'kitchen'], styleTags: ['Scandinavian', 'Minimal'], placementType: 'floor', categoryGroup: 'Storage' }),
  'grid-media': meta({ roomTypes: ['living_room'], allowedRoomTypes: ['living_room', 'generic'], styleTags: ['Modern', 'Contemporary'], placementType: 'floor', categoryGroup: 'Storage' }),
  'cube-bookshelf': meta({ roomTypes: ['living_room', 'office'], allowedRoomTypes: ['living_room', 'office', 'generic'], styleTags: ['Industrial', 'Modern'], placementType: 'floor', categoryGroup: 'Storage' }),
  'entry-bench': meta({ roomTypes: ['entryway', 'bedroom'], allowedRoomTypes: ['entryway', 'bedroom', 'generic'], styleTags: ['Scandinavian'], placementType: 'floor', categoryGroup: 'Storage' }),
  'arc-lamp': meta({ roomTypes: ['living_room'], allowedRoomTypes: ['living_room', 'bedroom', 'generic'], styleTags: ['Modern', 'Luxury'], placementType: 'floor', categoryGroup: 'Lighting' }),
  'ceramic-lamp': meta({ roomTypes: ['bedroom', 'living_room'], allowedRoomTypes: ['bedroom', 'living_room', 'office', 'generic'], styleTags: ['Japandi', 'Scandinavian'], placementType: 'surface', floorStanding: false, categoryGroup: 'Lighting' }),
  'globe-pendant': meta({ roomTypes: ['kitchen', 'dining_room'], allowedRoomTypes: ['kitchen', 'dining_room', 'living_room', 'generic'], styleTags: ['Modern', 'Contemporary'], placementType: 'ceiling', ceilingAttachable: true, requiresCeiling: true, floorStanding: false, categoryGroup: 'Lighting' }),
  'ceiling-spot': meta({ roomTypes: ['generic'], allowedRoomTypes: ROOM_TYPES, styleTags: ['Minimal', 'Modern'], placementType: 'ceiling', ceilingAttachable: true, requiresCeiling: true, floorStanding: false, categoryGroup: 'Lighting' }),
  'led-strip': meta({ roomTypes: ['kitchen', 'office'], allowedRoomTypes: ROOM_TYPES, styleTags: ['Modern', 'Minimal'], placementType: 'ceiling', ceilingAttachable: true, floorStanding: false, categoryGroup: 'Lighting' }),
  'wall-sconce': meta({ roomTypes: ['bathroom', 'bedroom'], allowedRoomTypes: ['bathroom', 'bedroom', 'hallway', 'generic'], styleTags: ['Luxury', 'Modern'], placementType: 'wall', wallAttachable: true, requiresWall: true, floorStanding: false, categoryGroup: 'Lighting' }),
  'fiddle-leaf': meta({ roomTypes: ['living_room', 'office'], allowedRoomTypes: ['living_room', 'office', 'bedroom', 'generic'], styleTags: ['Scandinavian', 'Modern'], placementType: 'floor', categoryGroup: 'Plants' }),
  'succulent': meta({ roomTypes: ['kitchen', 'office'], allowedRoomTypes: ROOM_TYPES, styleTags: ['Minimal', 'Japandi'], placementType: 'surface', floorStanding: false, categoryGroup: 'Plants' }),
  'metal-sculpture': meta({ roomTypes: ['living_room', 'office'], allowedRoomTypes: ['living_room', 'office', 'generic'], styleTags: ['Contemporary', 'Luxury'], placementType: 'floor', categoryGroup: 'Decor' }),
  'ceramic-vase': meta({ roomTypes: ['living_room', 'dining_room'], allowedRoomTypes: ROOM_TYPES, styleTags: ['Japandi', 'Scandinavian'], placementType: 'surface', floorStanding: false, categoryGroup: 'Decor' }),
  'gradient-art': meta({ roomTypes: ['living_room', 'bedroom'], allowedRoomTypes: ['living_room', 'bedroom', 'office', 'dining_room', 'generic'], styleTags: ['Modern', 'Minimal'], placementType: 'wall', wallAttachable: true, requiresWall: true, floorStanding: false, categoryGroup: 'Art' }),
  'woven-rug': meta({ roomTypes: ['living_room', 'bedroom'], allowedRoomTypes: ['living_room', 'bedroom', 'dining_room', 'office', 'generic'], styleTags: ['Scandinavian', 'Bohemian'], placementType: 'rug', collisionShape: 'flat', defaultClearanceCm: 0, categoryGroup: 'Textiles' }),
  'linen-curtains': meta({ roomTypes: ['living_room', 'bedroom'], allowedRoomTypes: ['living_room', 'bedroom', 'dining_room', 'generic'], styleTags: ['Scandinavian', 'Japandi'], placementType: 'wall', wallAttachable: true, requiresWall: true, floorStanding: false, categoryGroup: 'Textiles' }),
  'throw-pillow': meta({ roomTypes: ['living_room', 'bedroom'], allowedRoomTypes: ['living_room', 'bedroom', 'generic'], styleTags: ['Scandinavian'], placementType: 'surface', floorStanding: false, categoryGroup: 'Textiles' }),
  'round-mirror': meta({ roomTypes: ['bathroom', 'bedroom', 'entryway'], allowedRoomTypes: ['bathroom', 'bedroom', 'entryway', 'generic'], styleTags: ['Modern', 'Minimal'], placementType: 'wall', wallAttachable: true, requiresWall: true, floorStanding: false, categoryGroup: 'Decor' }),
  'stacked-books': meta({ roomTypes: ['living_room', 'office'], allowedRoomTypes: ROOM_TYPES, styleTags: ['Classic', 'Modern'], placementType: 'surface', floorStanding: false, categoryGroup: 'Decor' }),
  'woven-basket': meta({ roomTypes: ['bedroom', 'bathroom'], allowedRoomTypes: ['bedroom', 'bathroom', 'living_room', 'generic'], styleTags: ['Bohemian', 'Scandinavian'], placementType: 'floor', categoryGroup: 'Decor' }),
  'staircase': meta({ roomTypes: ['generic'], allowedRoomTypes: ['generic', 'entryway', 'hallway'], styleTags: ['Modern'], placementType: 'floor', categoryGroup: 'Architecture' }),
  'lowline-bed': meta({ roomTypes: ['bedroom'], allowedRoomTypes: ['bedroom', 'generic'], disallowedRoomTypes: ['bathroom', 'kitchen', 'living_room'], styleTags: ['Japandi', 'Scandinavian'], placementType: 'floor', categoryGroup: 'Seating' }),
  'kitchen-island': meta({ roomTypes: ['kitchen'], allowedRoomTypes: ['kitchen', 'generic'], disallowedRoomTypes: ['bedroom', 'bathroom'], styleTags: ['Modern', 'Contemporary'], placementType: 'floor', categoryGroup: 'Tables' }),
  'marble-vanity': meta({ roomTypes: ['bathroom'], allowedRoomTypes: ['bathroom', 'generic'], disallowedRoomTypes: ['living_room', 'bedroom', 'kitchen'], styleTags: ['Luxury', 'Modern'], placementType: 'floor', categoryGroup: 'Storage' }),
  'wall-toilet': meta({ roomTypes: ['bathroom'], allowedRoomTypes: ['bathroom', 'generic'], disallowedRoomTypes: ['living_room', 'bedroom', 'kitchen'], styleTags: ['Modern', 'Minimal'], placementType: 'floor', categoryGroup: 'Architecture' }),
  'freestanding-tub': meta({ roomTypes: ['bathroom'], allowedRoomTypes: ['bathroom', 'generic'], styleTags: ['Luxury', 'Classic'], placementType: 'floor', categoryGroup: 'Architecture' }),
  'brass-towel-rack': meta({ roomTypes: ['bathroom'], allowedRoomTypes: ['bathroom', 'generic'], styleTags: ['Luxury', 'Modern'], placementType: 'wall', wallAttachable: true, requiresWall: true, floorStanding: false, categoryGroup: 'Decor' }),
  'bath-mat': meta({ roomTypes: ['bathroom'], allowedRoomTypes: ['bathroom', 'generic'], styleTags: ['Minimal', 'Scandinavian'], placementType: 'rug', collisionShape: 'flat', defaultClearanceCm: 0, categoryGroup: 'Textiles' }),
  'office-task-lamp': meta({ roomTypes: ['office'], allowedRoomTypes: ['office', 'bedroom', 'generic'], styleTags: ['Modern', 'Industrial'], placementType: 'surface', floorStanding: false, categoryGroup: 'Lighting' }),
  'realistic-sofa-004': meta({ roomTypes: ['living_room'], allowedRoomTypes: ['living_room', 'office', 'generic'], styleTags: ['Modern', 'Contemporary'], placementType: 'floor', categoryGroup: 'Seating' }),
  'realistic-sofa-005': meta({ roomTypes: ['living_room'], allowedRoomTypes: ['living_room', 'office', 'generic'], styleTags: ['Modern', 'Contemporary'], placementType: 'floor', categoryGroup: 'Seating' }),
  'realistic-sofa-009': meta({ roomTypes: ['living_room'], allowedRoomTypes: ['living_room', 'office', 'generic'], styleTags: ['Modern', 'Contemporary'], placementType: 'floor', categoryGroup: 'Seating' }),
  'realistic-sofa-010': meta({ roomTypes: ['living_room'], allowedRoomTypes: ['living_room', 'office', 'generic'], styleTags: ['Luxury', 'Contemporary'], placementType: 'floor', categoryGroup: 'Seating' }),
  '3-seater-sectional': meta({ roomTypes: ['living_room'], allowedRoomTypes: ['living_room', 'generic'], styleTags: ['Contemporary', 'Minimal'], placementType: 'floor', categoryGroup: 'Seating' }),
  'chair-032': meta({ roomTypes: ['office', 'dining_room'], allowedRoomTypes: ['office', 'dining_room', 'generic'], styleTags: ['Modern', 'Minimal'], placementType: 'floor', categoryGroup: 'Seating' }),
  'detailed-cupboard-015': meta({ roomTypes: ['living_room', 'bedroom'], allowedRoomTypes: ['living_room', 'bedroom', 'generic'], styleTags: ['Modern'], placementType: 'floor', categoryGroup: 'Storage' }),
  'detailed-cupboard-020': meta({ roomTypes: ['living_room', 'bedroom'], allowedRoomTypes: ['living_room', 'bedroom', 'generic'], styleTags: ['Minimal'], placementType: 'floor', categoryGroup: 'Storage' }),
  'detailed-cupboard-043': meta({ roomTypes: ['living_room', 'dining_room'], allowedRoomTypes: ['living_room', 'dining_room', 'generic'], styleTags: ['Classic', 'Modern'], placementType: 'floor', categoryGroup: 'Storage' }),
  'modern-dining-set': meta({ roomTypes: ['dining_room'], allowedRoomTypes: ['dining_room', 'kitchen', 'generic'], styleTags: ['Modern', 'Contemporary'], placementType: 'floor', categoryGroup: 'Tables' }),
  'under-sink-storage': meta({ roomTypes: ['bathroom', 'kitchen'], allowedRoomTypes: ['bathroom', 'kitchen', 'generic'], styleTags: ['Modern', 'Minimal'], placementType: 'floor', categoryGroup: 'Storage' }),
  'realistic-bathtub': meta({ roomTypes: ['bathroom'], allowedRoomTypes: ['bathroom', 'generic'], styleTags: ['Luxury', 'Classic'], placementType: 'floor', categoryGroup: 'Architecture' }),
  'casement-window': meta({ roomTypes: ['generic'], allowedRoomTypes: ROOM_TYPES, styleTags: ['Modern', 'Classic'], placementType: 'wall', wallAttachable: true, requiresWall: true, floorStanding: false, categoryGroup: 'Architecture' }),
  'wooden-door': meta({ roomTypes: ['generic'], allowedRoomTypes: ROOM_TYPES, styleTags: ['Classic', 'Modern'], placementType: 'wall', wallAttachable: true, requiresWall: true, floorStanding: false, categoryGroup: 'Architecture' }),
  'fancy-picture-frame': meta({ roomTypes: ['living_room', 'bedroom'], allowedRoomTypes: ROOM_TYPES, styleTags: ['Classic', 'Modern'], placementType: 'wall', wallAttachable: true, requiresWall: true, floorStanding: false, categoryGroup: 'Decor' }),
  'marble-bust': meta({ roomTypes: ['living_room', 'office'], allowedRoomTypes: ['living_room', 'office', 'generic'], styleTags: ['Classic', 'Luxury'], placementType: 'surface', floorStanding: false, categoryGroup: 'Decor' }),
  'potted-plant': meta({ roomTypes: ['living_room', 'office', 'bedroom'], allowedRoomTypes: ['living_room', 'office', 'bedroom', 'generic'], styleTags: ['Modern', 'Scandinavian'], placementType: 'floor', categoryGroup: 'Plants' }),
  'standing-picture-frame': meta({ roomTypes: ['living_room', 'bedroom'], allowedRoomTypes: ROOM_TYPES, styleTags: ['Modern', 'Contemporary'], placementType: 'floor', categoryGroup: 'Decor' }),
  'obj-sofa': meta({ roomTypes: ['living_room'], allowedRoomTypes: ['living_room', 'office', 'generic'], styleTags: ['Classic', 'Modern'], placementType: 'floor', categoryGroup: 'Seating' }),
  'obj-bed': meta({ roomTypes: ['bedroom'], allowedRoomTypes: ['bedroom', 'generic'], styleTags: ['Classic', 'Modern'], placementType: 'floor', categoryGroup: 'Seating' }),
  'obj-bathtub': meta({ roomTypes: ['bathroom'], allowedRoomTypes: ['bathroom', 'generic'], styleTags: ['Classic', 'Modern'], placementType: 'floor', categoryGroup: 'Architecture' }),
  'obj-stove': meta({ roomTypes: ['kitchen'], allowedRoomTypes: ['kitchen', 'generic'], styleTags: ['Modern', 'Contemporary'], placementType: 'floor', categoryGroup: 'Architecture' }),
  'obj-table-lamp': meta({ roomTypes: ['living_room', 'bedroom'], allowedRoomTypes: ['living_room', 'bedroom', 'office', 'generic'], styleTags: ['Classic', 'Modern'], placementType: 'surface', floorStanding: false, categoryGroup: 'Lighting' }),
  'obj-bedroom-door': meta({ roomTypes: ['generic'], allowedRoomTypes: ROOM_TYPES, styleTags: ['Classic', 'Modern'], placementType: 'wall', wallAttachable: true, requiresWall: true, floorStanding: false, categoryGroup: 'Architecture' }),
  'obj-house-door': meta({ roomTypes: ['generic'], allowedRoomTypes: ROOM_TYPES, styleTags: ['Classic', 'Modern'], placementType: 'wall', wallAttachable: true, requiresWall: true, floorStanding: false, categoryGroup: 'Architecture' }),
  'obj-window': meta({ roomTypes: ['generic'], allowedRoomTypes: ROOM_TYPES, styleTags: ['Classic', 'Modern'], placementType: 'wall', wallAttachable: true, requiresWall: true, floorStanding: false, categoryGroup: 'Architecture' }),
  'obj-wardrobe-a3': meta({ roomTypes: ['bedroom'], allowedRoomTypes: ['bedroom', 'closet', 'generic'], styleTags: ['Scandinavian', 'Modern'], placementType: 'floor', categoryGroup: 'Storage' }),
  'obj-cabinet-blade': meta({ roomTypes: ['living_room', 'bedroom'], allowedRoomTypes: ['living_room', 'bedroom', 'office', 'generic'], styleTags: ['Modern', 'Contemporary'], placementType: 'floor', categoryGroup: 'Storage' }),
  'obj-cabinet-object033': meta({ roomTypes: ['living_room', 'kitchen'], allowedRoomTypes: ['living_room', 'kitchen', 'office', 'generic'], styleTags: ['Industrial', 'Modern'], placementType: 'floor', categoryGroup: 'Storage' }),
  'obj-cabinet-high': meta({ roomTypes: ['bedroom', 'living_room'], allowedRoomTypes: ['bedroom', 'living_room', 'office', 'generic'], styleTags: ['Scandinavian', 'Minimal'], placementType: 'floor', categoryGroup: 'Storage' }),
  'obj-cabinet-low': meta({ roomTypes: ['living_room', 'dining_room'], allowedRoomTypes: ['living_room', 'dining_room', 'office', 'generic'], styleTags: ['Scandinavian', 'Minimal'], placementType: 'floor', categoryGroup: 'Storage' }),
  'obj-kupol': meta({ roomTypes: ['outdoor', 'generic'], allowedRoomTypes: ['outdoor', 'garden', 'generic'], styleTags: ['Modern', 'Contemporary'], placementType: 'floor', categoryGroup: 'Architecture' }),
  'obj-scandi-door': meta({ roomTypes: ['generic'], allowedRoomTypes: ROOM_TYPES, styleTags: ['Scandinavian', 'Modern'], placementType: 'wall', wallAttachable: true, requiresWall: true, floorStanding: false, categoryGroup: 'Architecture' }),
  'obj-classic-bedroom': meta({ roomTypes: ['bedroom'], allowedRoomTypes: ['bedroom', 'generic'], styleTags: ['Classic', 'Traditional'], placementType: 'floor', categoryGroup: 'Architecture' }),
  'obj-bathroom-vanity': meta({ roomTypes: ['bathroom'], allowedRoomTypes: ['bathroom', 'generic'], styleTags: ['Modern', 'Contemporary'], placementType: 'floor', categoryGroup: 'Storage' }),
  'obj-country-chest': meta({ roomTypes: ['bedroom', 'living_room'], allowedRoomTypes: ['bedroom', 'living_room', 'generic'], styleTags: ['Classic', 'Country'], placementType: 'floor', categoryGroup: 'Storage' }),
  'obj-ornate-sideboard': meta({ roomTypes: ['dining_room', 'living_room'], allowedRoomTypes: ['dining_room', 'living_room', 'generic'], styleTags: ['Classic', 'Traditional'], placementType: 'floor', categoryGroup: 'Storage' }),
  'obj-coffee-table-rect': meta({ roomTypes: ['living_room'], allowedRoomTypes: ['living_room', 'office', 'generic'], styleTags: ['Modern', 'Contemporary'], placementType: 'floor', categoryGroup: 'Tables' }),
  'obj-pedestal-sink': meta({ roomTypes: ['bathroom'], allowedRoomTypes: ['bathroom', 'generic'], styleTags: ['Classic', 'Modern'], placementType: 'floor', categoryGroup: 'Architecture' }),
  'obj-modern-toilet': meta({ roomTypes: ['bathroom'], allowedRoomTypes: ['bathroom', 'generic'], styleTags: ['Modern', 'Contemporary'], placementType: 'floor', categoryGroup: 'Architecture' }),
  'obj-glass-shower': meta({ roomTypes: ['bathroom'], allowedRoomTypes: ['bathroom', 'generic'], styleTags: ['Modern', 'Contemporary'], placementType: 'floor', categoryGroup: 'Architecture' }),
  'obj-contemporary-bath': meta({ roomTypes: ['bathroom'], allowedRoomTypes: ['bathroom', 'generic'], styleTags: ['Modern', 'Contemporary'], placementType: 'floor', categoryGroup: 'Architecture' }),
  'obj-elegant-kitchen': meta({ roomTypes: ['kitchen'], allowedRoomTypes: ['kitchen', 'dining_room', 'generic'], styleTags: ['Modern', 'Contemporary', 'Luxury'], placementType: 'floor', categoryGroup: 'Architecture' }),
  'obj-ikea-kitchen': meta({ roomTypes: ['kitchen'], allowedRoomTypes: ['kitchen', 'dining_room', 'generic'], styleTags: ['Scandinavian', 'Modern'], placementType: 'floor', categoryGroup: 'Architecture' }),
  'obj-classic-window': meta({ roomTypes: ['generic'], allowedRoomTypes: ROOM_TYPES, styleTags: ['Classic', 'Traditional'], placementType: 'wall', wallAttachable: true, requiresWall: true, floorStanding: false, categoryGroup: 'Architecture' }),
  'obj-iron-door': meta({ roomTypes: ['generic'], allowedRoomTypes: ROOM_TYPES, styleTags: ['Classic', 'Industrial', 'Traditional'], placementType: 'wall', wallAttachable: true, requiresWall: true, floorStanding: false, categoryGroup: 'Architecture' }),
  'obj-ornate-iron-door': meta({ roomTypes: ['generic'], allowedRoomTypes: ROOM_TYPES, styleTags: ['Traditional', 'Luxury', 'Industrial'], placementType: 'wall', wallAttachable: true, requiresWall: true, floorStanding: false, categoryGroup: 'Architecture' }),
  'obj-wood-glass-door': meta({ roomTypes: ['generic'], allowedRoomTypes: ROOM_TYPES, styleTags: ['Classic', 'Traditional'], placementType: 'wall', wallAttachable: true, requiresWall: true, floorStanding: false, categoryGroup: 'Architecture' }),
  'obj-contemporary-curtains': meta({ roomTypes: ['living_room', 'bedroom'], allowedRoomTypes: ['living_room', 'bedroom', 'generic'], styleTags: ['Modern', 'Contemporary'], placementType: 'floor', categoryGroup: 'Decor' }),
  'obj-cooktop-module-l': meta({ roomTypes: ['kitchen'], allowedRoomTypes: ['kitchen', 'generic'], styleTags: ['Modern', 'Contemporary'], placementType: 'floor', categoryGroup: 'Architecture' }),
  'obj-fridge-module-burner-sx': meta({ roomTypes: ['kitchen'], allowedRoomTypes: ['kitchen', 'generic'], styleTags: ['Modern', 'Contemporary'], placementType: 'floor', categoryGroup: 'Architecture' }),
  'obj-barbecue-fga-module-w': meta({ roomTypes: ['kitchen'], allowedRoomTypes: ['kitchen', 'generic'], styleTags: ['Modern', 'Contemporary'], placementType: 'floor', categoryGroup: 'Architecture' }),
  'obj-cabinet-model-l-with-gas-stove-sx': meta({ roomTypes: ['kitchen'], allowedRoomTypes: ['kitchen', 'generic'], styleTags: ['Modern', 'Contemporary'], placementType: 'floor', categoryGroup: 'Architecture' }),
  'obj-blast-chilling-life-w30': meta({ roomTypes: ['kitchen'], allowedRoomTypes: ['kitchen', 'generic'], styleTags: ['Modern', 'Contemporary'], placementType: 'floor', categoryGroup: 'Architecture' }),
  'obj-shock-chiller-w45': meta({ roomTypes: ['kitchen'], allowedRoomTypes: ['kitchen', 'generic'], styleTags: ['Modern', 'Contemporary'], placementType: 'floor', categoryGroup: 'Architecture' }),
  'obj-shock-chiller-w60': meta({ roomTypes: ['kitchen'], allowedRoomTypes: ['kitchen', 'generic'], styleTags: ['Modern', 'Contemporary'], placementType: 'floor', categoryGroup: 'Architecture' }),
  'obj-garlyn-ch-50': meta({ roomTypes: ['kitchen'], allowedRoomTypes: ['kitchen', 'generic'], styleTags: ['Modern', 'Contemporary'], placementType: 'floor', categoryGroup: 'Architecture' }),
  'obj-garlyn-h-7000': meta({ roomTypes: ['kitchen'], allowedRoomTypes: ['kitchen', 'generic'], styleTags: ['Modern', 'Contemporary'], placementType: 'floor', categoryGroup: 'Architecture' }),
  'obj-metal-grill-grate-l': meta({ roomTypes: ['kitchen'], allowedRoomTypes: ['kitchen', 'generic'], styleTags: ['Modern', 'Industrial'], placementType: 'floor', categoryGroup: 'Architecture' }),
  'obj-worktop-module-l': meta({ roomTypes: ['kitchen'], allowedRoomTypes: ['kitchen', 'generic'], styleTags: ['Modern', 'Contemporary'], placementType: 'floor', categoryGroup: 'Architecture' }),
  'obj-kettle-k200': meta({ roomTypes: ['kitchen'], allowedRoomTypes: ['kitchen', 'generic'], styleTags: ['Modern', 'Contemporary'], placementType: 'surface', floorStanding: false, categoryGroup: 'Lighting' }),
  'obj-coffee-machine-l1000': meta({ roomTypes: ['kitchen'], allowedRoomTypes: ['kitchen', 'generic'], styleTags: ['Modern', 'Contemporary'], placementType: 'surface', floorStanding: false, categoryGroup: 'Lighting' }),
  'obj-coffee-maker-l90': meta({ roomTypes: ['kitchen'], allowedRoomTypes: ['kitchen', 'generic'], styleTags: ['Modern', 'Contemporary'], placementType: 'surface', floorStanding: false, categoryGroup: 'Lighting' }),
  'obj-extractor-ch60': meta({ roomTypes: ['kitchen'], allowedRoomTypes: ['kitchen', 'generic'], styleTags: ['Modern', 'Contemporary'], placementType: 'floor', categoryGroup: 'Architecture' }),
  'obj-patio-table-03': meta({ roomTypes: ['living_room'], allowedRoomTypes: ['living_room', 'outdoor', 'generic'], styleTags: ['Modern', 'Contemporary'], placementType: 'floor', categoryGroup: 'Tables' }),
  'obj-patio-table-03-v2': meta({ roomTypes: ['living_room'], allowedRoomTypes: ['living_room', 'outdoor', 'generic'], styleTags: ['Modern', 'Contemporary'], placementType: 'floor', categoryGroup: 'Tables' }),
  'obj-under-sink-storage': meta({ roomTypes: ['bathroom', 'kitchen'], allowedRoomTypes: ['bathroom', 'kitchen', 'generic'], styleTags: ['Modern', 'Minimal'], placementType: 'floor', categoryGroup: 'Storage' }),
  'obj-antares': meta({ roomTypes: ['living_room', 'office'], allowedRoomTypes: ['living_room', 'office', 'generic'], styleTags: ['Modern', 'Contemporary'], placementType: 'floor', categoryGroup: 'Decor' }),
  'obj-dm11': meta({ roomTypes: ['living_room', 'office'], allowedRoomTypes: ['living_room', 'office', 'generic'], styleTags: ['Modern', 'Contemporary'], placementType: 'floor', categoryGroup: 'Decor' }),
  'obj-dm12': meta({ roomTypes: ['living_room', 'office'], allowedRoomTypes: ['living_room', 'office', 'generic'], styleTags: ['Modern', 'Contemporary'], placementType: 'floor', categoryGroup: 'Decor' }),
  'obj-dm13': meta({ roomTypes: ['living_room', 'office'], allowedRoomTypes: ['living_room', 'office', 'generic'], styleTags: ['Modern', 'Contemporary'], placementType: 'floor', categoryGroup: 'Decor' }),
  'obj-venus': meta({ roomTypes: ['living_room', 'office'], allowedRoomTypes: ['living_room', 'office', 'generic'], styleTags: ['Modern', 'Contemporary'], placementType: 'floor', categoryGroup: 'Decor' }),
};

export const enrichProduct = (product) => {
  const extra = productMetaById[product.id] || meta({});
  return {
    ...product,
    ...extra,
    roomTypes: extra.roomTypes,
    styleTags: extra.styleTags,
    footprint2D: {
      w: product.dimensionsCm.w,
      d: product.dimensionsCm.d,
    },
    collisionShape: extra.collisionShape,
  };
};

export const filterProducts = (products, { roomFilter = 'auto', category = 'All', style = 'All', placement = 'All', query = '', activeRoomType = 'generic', showAllOverride = false }) => {
  const effectiveRoom = roomFilter === 'auto' ? activeRoomType : roomFilter === 'all' ? null : roomFilter;
  return products.filter((product) => {
    if (category !== 'All' && product.category !== category && product.categoryGroup !== category) return false;
    if (style !== 'All' && !product.styleTags?.includes(style)) return false;
    if (placement !== 'All') {
      const map = { 'Floor-standing': 'floor', 'Wall-mounted': 'wall', 'Ceiling-mounted': 'ceiling', 'Surface decor': 'surface' };
      if (map[placement] && product.placementType !== map[placement]) return false;
    }
    if (query && !`${product.name} ${product.brand} ${product.materials?.join(' ')}`.toLowerCase().includes(query.toLowerCase())) return false;
    if (showAllOverride || roomFilter === 'all' || !effectiveRoom) return true;
    if (product.disallowedRoomTypes?.includes(effectiveRoom)) return false;
    return product.allowedRoomTypes?.includes(effectiveRoom) || product.allowedRoomTypes?.includes('generic');
  });
};

export const getRoomTypeFromRoom = (room) => room?.roomType || 'generic';
