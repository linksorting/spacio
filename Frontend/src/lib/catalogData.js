/** @typedef {{ id: string, name: string, thumbnail: string, modelUrl: string, previewModelUrl?: string, materialUrl?: string, type: number, widthCm: number, depthCm: number, heightCm: number, placementMode?: 'floor' | 'wall' | 'surface', mountHeightCm?: number, rotationOffsetY?: number, tags?: string[], source: 'legacy' | 'imported' }} FurnitureItem */
/** @typedef {{ id: string, name: string, thumbnail: string, itemCount: number, items: FurnitureItem[] }} CategoryCard */
/** @typedef {{ id: string, name: string, thumbnail: string, style: string, description?: string, presetId?: string, editablePresetId?: string, sceneModelUrl?: string, roomWidthCm?: number, roomDepthCm?: number }} InspirationRoom */
/** @typedef {{ id: string, label: string, rooms: InspirationRoom[] }} InspirationCategory */

export const CATALOG_FILTERS = [
  'All',
  'Living Room',
  'Bedroom',
  'Kitchen',
  'Bathroom',
  'Office',
];

/**
 * @param {string} id
 * @param {string} name
 * @param {string} slug
 * @param {string} modelFile
 * @param {string} thumbnail
 * @param {number} widthCm
 * @param {number} depthCm
 * @param {number} heightCm
 * @param {number} [type=1]
 * @param {'floor' | 'wall' | 'surface'} [placementMode='floor']
 * @param {number} [mountHeightCm=0]
 * @param {string} [materialFile='']
 * @returns {FurnitureItem}
 */
function imported(id, name, slug, modelFile, thumbnail, widthCm, depthCm, heightCm, type = 1, placementMode = 'floor', mountHeightCm = 0, materialFile = '') {
  const modelUrl = `/models/imported-products/${slug}/${modelFile}`;
  let thumb;
  if (thumbnail.startsWith('/')) {
    thumb = thumbnail;
  } else if (modelFile.endsWith('.glb') || thumbnail === 'preview.png') {
    thumb = `/models/imported-products/${slug}/${thumbnail}`;
  } else {
    thumb = `/models/imported-products/${slug}/textures/${thumbnail}`;
  }
  return {
    id,
    name,
    thumbnail: thumb,
    modelUrl,
    previewModelUrl: modelUrl,
    materialUrl: materialFile ? `/models/imported-products/${slug}/${materialFile}` : '',
    type,
    widthCm,
    depthCm,
    heightCm,
    placementMode,
    mountHeightCm,
    source: 'imported',
  };
}

/** @type {CategoryCard[]} */
export const CATALOG_CATEGORIES = [
  {
    id: 'imported-sofas',
    name: 'Detailed Sofas',
    thumbnail: '/models/imported-products/sofa-01/textures/Sofa_01_diff_1k.jpg',
    itemCount: 4,
    items: [
      imported('imported-sofa-01', 'Textured Sofa 01', 'sofa-01', 'Sofa_01_1k.gltf', 'Sofa_01_diff_1k.jpg', 220, 92, 85),
      imported('imported-sofa-02', 'Textured Sofa 02', 'sofa-02', 'sofa_02_1k.gltf', 'sofa_02_diff_1k.jpg', 220, 92, 85),
      imported('imported-sofa-03', 'Textured Sofa 03', 'sofa-03', 'sofa_03_1k.gltf', 'sofa_03_diff_1k.jpg', 235, 95, 88),
      imported('obj-sofa', 'Classic Sofa', 'obj-sofa', 'sofa.obj', '/assets/products/thumbnails/obj-sofa.png', 220, 92, 85, 1, 'floor', 0, 'sofa.mtl'),
    ],
  },
  {
    id: 'imported-feature-seating',
    name: 'Detailed Seating',
    thumbnail: '/models/imported-products/modern-arm-chair-01/textures/modern_arm_chair_01_pillow_diff_1k.jpg',
    itemCount: 1,
    items: [
      imported('imported-modern-arm-chair', 'Modern Textured Arm Chair', 'modern-arm-chair-01', 'modern_arm_chair_01_1k.gltf', 'modern_arm_chair_01_pillow_diff_1k.jpg', 82, 88, 86),
    ],
  },
  {
    id: 'imported-tables',
    name: 'Detailed Tables',
    thumbnail: '/models/imported-products/coffee-table-round-01/textures/coffee_table_round_01_diff_1k.jpg',
    itemCount: 5,
    items: [
      imported('imported-coffee-table-round', 'Round Coffee Table', 'coffee-table-round-01', 'coffee_table_round_01_1k.gltf', 'coffee_table_round_01_diff_1k.jpg', 105, 105, 42),
      imported('imported-round-wood-table', 'Round Wooden Dining Table', 'round-wooden-table-01', 'round_wooden_table_01_1k.gltf', 'round_wooden_table_01_diff_1k.jpg', 120, 120, 76),
      imported('obj-coffee-table-rect', 'Rectangular Coffee Table', 'obj-coffee-table-rect', 'Coffee Table.obj', '/assets/products/thumbnails/obj-coffee-table-rect.png', 120, 60, 45, 1, 'floor', 0, 'Coffee Table.mtl'),
      imported('obj-patio-table-03', 'Patio Coffee Table 03', 'obj-patio-table-03', 'Patio_Coffee_Table_Square_03.obj', '/assets/products/thumbnails/obj-patio-table-03.png', 90, 90, 45, 1, 'floor', 0, 'Patio_Coffee_Table_Square_03.mtl'),
      imported('obj-patio-table-03-v2', 'Patio Coffee Table 03 V2', 'obj-patio-table-03-v2', 'Patio_Coffee_Table_Square_03_v2.obj', '/assets/products/thumbnails/obj-patio-table-03-v2.png', 95, 95, 45, 1, 'floor', 0, 'Patio_Coffee_Table_Square_03_v2.mtl'),
    ],
  },
  {
    id: 'imported-bedroom',
    name: 'Detailed Bedroom',
    thumbnail: '/models/imported-products/gothic-bed-01/textures/GothicBed_01_diff_1k.jpg',
    itemCount: 3,
    items: [
      imported('imported-gothic-bed', 'Gothic Bed', 'gothic-bed-01', 'GothicBed_01_1k.gltf', 'GothicBed_01_diff_1k.jpg', 190, 220, 110),
      imported('obj-bed', 'Classic Bed', 'obj-bed', 'Bed.obj', '/models/imported-products/obj-bed/Bed.png', 160, 210, 110, 1, 'floor', 0, 'Bed.mtl'),
      imported('obj-classic-bedroom', 'Classic Wood Bedroom Interior', 'obj-classic-bedroom', 'CGcos_Bedroom1.obj', '/assets/products/thumbnails/obj-classic-bedroom.png', 400, 400, 270, 1, 'floor', 0, 'CGcos_Bedroom1.mtl'),
    ],
  },
  {
    id: 'imported-storage',
    name: 'Detailed Storage',
    thumbnail: '/assets/products/thumbnails/obj-wardrobe-a3.png',
    itemCount: 29,
    items: [
      imported('imported-chinese-cabinet', 'Chinese Cabinet', 'chinese-cabinet', 'chinese_cabinet_1k.gltf', 'chinese_cabinet_diff_1k.jpg', 115, 55, 190),
      imported('obj-wardrobe-a3', 'ALEX Wardrobe A3', 'obj-wardrobe-a3', 'ALEX Wardrobe A3.obj', '/assets/products/thumbnails/obj-wardrobe-a3.png', 126, 68, 200, 1, 'floor', 0, 'ALEX Wardrobe A3.mtl'),
      imported('obj-cabinet-blade', 'Cabinet Blade', 'obj-cabinet-blade', 'Cabinet Blade.obj', '/assets/products/thumbnails/obj-cabinet-blade.png', 80, 40, 90, 1, 'floor', 0, 'Cabinet Blade.mtl'),
      imported('obj-cabinet-object033', 'Cabinet Object033', 'obj-cabinet-object033', 'Cabinet Object033.obj', '/assets/products/thumbnails/obj-cabinet-object033.png', 39, 23, 90, 1, 'floor', 0, 'Cabinet Object033.mtl'),
      imported('obj-cabinet-high', 'Prio Cabinet High Birch', 'obj-cabinet-high', 'Prio Cabinet High  Birch.obj', '/assets/products/thumbnails/obj-cabinet-high.png', 136, 59, 180, 1, 'floor', 0, 'Prio Cabinet High  Birch.mtl'),
      imported('obj-cabinet-low', 'Prio Cabinet Low Birch', 'obj-cabinet-low', 'Prio Cabinet Low  Birch.obj', '/assets/products/thumbnails/obj-cabinet-low.png', 90, 39, 80, 1, 'floor', 0, 'Prio Cabinet Low  Birch.mtl'),
      imported('obj-bathroom-vanity', 'Bathroom Vanity Cabinet', 'obj-bathroom-vanity', 'Bathroom_Sink_Cabinet.obj', '/assets/products/thumbnails/obj-bathroom-vanity.png', 80, 50, 85, 1, 'floor', 0, 'Bathroom_Sink_Cabinet.mtl'),
      imported('obj-country-chest', 'Country Chest of Drawers', 'obj-country-chest', 'Traditional_Dresser.obj', '/assets/products/thumbnails/obj-country-chest.png', 66, 57, 90, 1, 'floor', 0, 'Traditional_Dresser.mtl'),
      imported('obj-ornate-sideboard', 'Ornate Sideboard', 'obj-ornate-sideboard', 'Classical_Sideboard.obj', '/assets/products/thumbnails/obj-ornate-sideboard.png', 137, 150, 81, 1, 'floor', 0, 'Classical_Sideboard.mtl'),
      imported('obj-under-sink-storage', 'Under Sink Storage Organizer', 'obj-under-sink-storage', '18_Under Sink Storage Organizer.obj', '/assets/products/thumbnails/obj-under-sink-storage.png', 36, 26, 50, 1, 'floor', 0),
      imported('obj-cabinet', 'Cabinet', 'obj-cabinet', 'Cabinet.obj', '/assets/products/thumbnails/obj-cabinet.png', 19, 34, 90, 1, 'floor', 0, 'Cabinet.mtl'),
      imported('obj-cabinet-fissure', 'Cabinet Fissure', 'obj-cabinet-fissure', 'Cabinet Fissure.obj', '/assets/products/thumbnails/obj-cabinet-fissure.png', 69, 21, 90, 1, 'floor', 0, 'Cabinet Fissure.mtl'),
      imported('obj-cabinet-kami', 'Cabinet Kami', 'obj-cabinet-kami', 'Cabinet Kami.obj', '/assets/products/thumbnails/obj-cabinet-kami.png', 41, 26, 90, 1, 'floor', 0, 'Cabinet Kami.mtl'),
      imported('obj-cabinet-st-07-3', 'Cabinet ST 07 3', 'obj-cabinet-st-07-3', 'Cabinet ST 07 3.obj', '/assets/products/thumbnails/obj-cabinet-st-07-3.png', 53, 14, 90, 1, 'floor', 0, 'Cabinet ST 07 3.mtl'),
      imported('obj-cabinet-st-07-8', 'Cabinet ST 07 8', 'obj-cabinet-st-07-8', 'Cabinet ST 07 8.obj', '/assets/products/thumbnails/obj-cabinet-st-07-8.png', 81, 14, 90, 1, 'floor', 0, 'Cabinet ST 07 8.mtl'),
      imported('obj-cabinet-tm-013', 'Cabinet TM 013', 'obj-cabinet-tm-013', 'Cabinet TM 013.obj', '/assets/products/thumbnails/obj-cabinet-tm-013.png', 90, 22, 64, 1, 'floor', 0, 'Cabinet TM 013.mtl'),
      imported('obj-cabinets-mantone', 'Cabinets Mantone', 'obj-cabinets-mantone', 'Cabinets Mantone.obj', '/assets/products/thumbnails/obj-cabinets-mantone.png', 90, 60, 90, 1, 'floor', 0, 'Cabinets Mantone.mtl'),
      imported('obj-bookcase', 'Bookcase', 'obj-bookcase', 'Bookcase.obj', '/assets/products/thumbnails/obj-bookcase.png', 32, 132, 180, 1, 'floor', 0, 'Bookcase.mtl'),
      imported('obj-rounded-cabinet', 'Rounded Cabinet', 'obj-rounded-cabinet', 'Rounded cabinet.obj', '/assets/products/thumbnails/obj-rounded-cabinet.png', 50, 38, 90, 1, 'floor', 0, 'Rounded cabinet.mtl'),
      imported('obj-bar-cabinet-3115', 'Bar Cabinet 3115', 'obj-bar-cabinet-3115', 'Bar cabinet 3115.obj', '/assets/products/thumbnails/obj-bar-cabinet-3115.png', 56, 56, 100, 1, 'floor', 0, 'Bar cabinet 3115.mtl'),
      imported('obj-eye-two-doors', 'Eye Two Doors Cabinet', 'obj-eye-two-doors', 'Eye two doors.obj', '/assets/products/thumbnails/obj-eye-two-doors.png', 62, 18, 90, 1, 'floor', 0, 'Eye two doors.mtl'),
      imported('obj-eye-two-doors-display', 'Eye Two Doors Display Cabinet', 'obj-eye-two-doors-display', 'Eye two doors display cabinet.obj', '/assets/products/thumbnails/obj-eye-two-doors-display.png', 68, 34, 180, 1, 'floor', 0, 'Eye two doors display cabinet.mtl'),
      imported('obj-model-1s', 'Model 1S Cabinet', 'obj-model-1s', 'Model 1S.obj', '/assets/products/thumbnails/obj-model-1s.png', 66, 66, 90, 1, 'floor', 0, 'Model 1S.mtl'),
      imported('obj-showcase-mantone', 'Showcase Mantone', 'obj-showcase-mantone', 'Showcase Mantone.obj', '/assets/products/thumbnails/obj-showcase-mantone.png', 90, 180, 30, 1, 'floor', 0, 'Showcase Mantone.mtl'),
      imported('obj-showcase-santro', 'Showcase Santro', 'obj-showcase-santro', 'Showcase Santro.obj', '/assets/products/thumbnails/obj-showcase-santro.png', 90, 180, 32, 1, 'floor', 0, 'Showcase Santro.mtl'),
      imported('obj-showcase-tivoli', 'Showcase Tivoli', 'obj-showcase-tivoli', 'Showcase Tivoli.obj', '/assets/products/thumbnails/obj-showcase-tivoli.png', 90, 180, 31, 1, 'floor', 0, 'Showcase Tivoli.mtl'),
      imported('obj-sideboard-tynd', 'Sideboard Tynd', 'obj-sideboard-tynd', 'Tynd_Servant_Public.obj', '/assets/products/thumbnails/obj-sideboard-tynd.png', 150, 46, 75, 1, 'floor', 0, 'Tynd_Servant_Public.mtl'),
      imported('obj-tynd-wardrobe', 'Tynd Wardrobe', 'obj-tynd-wardrobe', 'Tynd_wardrobe_1200x600.obj', '/assets/products/thumbnails/obj-tynd-wardrobe.png', 112, 200, 56, 1, 'floor', 0, 'Tynd_wardrobe_1200x600.mtl'),
      imported('obj-wardrobe-parmino', 'Wardrobe Parmino', 'obj-wardrobe-parmino', 'Wardrobe Parmino.obj', '/assets/products/thumbnails/obj-wardrobe-parmino.png', 116, 52, 200, 1, 'floor', 0, 'Wardrobe Parmino.mtl'),
    ],
  },
  {
    id: 'imported-kitchen',
    name: 'Kitchen, Bath & Appliances',
    thumbnail: '/models/imported-products/obj-stove/stove_with_range_panel.jpg',
    itemCount: 58,
    items: [
      imported('obj-stove', 'Modern Stove with Range', 'obj-stove', '11655_stove_with_range_v1_l2.obj', '/models/imported-products/obj-stove/stove_with_range_panel.jpg', 90, 65, 90, 1, 'floor', 0, '11655_stove_with_range_v1_l2.mtl'),
      imported('obj-bathtub', 'Classic Bathtub', 'obj-bathtub', 'Bathtub.obj', '/models/imported-products/obj-bathtub/Bathtub.png', 170, 80, 58, 1, 'floor', 0, 'Bathtub.mtl'),
      imported('obj-pedestal-sink', 'Pedestal Sink with Gold Faucet', 'obj-pedestal-sink', 'Classical_Bathroom_Sink_v1_Empty.obj', '/assets/products/thumbnails/obj-pedestal-sink.png', 60, 50, 100, 1, 'floor', 0, 'Classical_Bathroom_Sink_v1_Empty.mtl'),
      imported('obj-modern-toilet', 'Modern Toilet Open Seat', 'obj-modern-toilet', 'Modern_Toilet_Open_OBJ.obj', '/assets/products/thumbnails/obj-modern-toilet.png', 45, 65, 80, 1, 'floor', 0, 'Modern_Toilet_Open_OBJ.mtl'),
      imported('obj-glass-shower', 'Glass Shower Enclosure', 'obj-glass-shower', 'Shower.obj', '/assets/products/thumbnails/obj-glass-shower.png', 90, 90, 220, 1, 'floor', 0),
      imported('obj-contemporary-bath', 'Contemporary Bath Suite', 'obj-contemporary-bath', 'Modern Bathroom_obj.obj', '/assets/products/thumbnails/obj-contemporary-bath.png', 300, 250, 250, 1, 'floor', 0, 'Modern Bathroom_obj.mtl'),
      imported('obj-elegant-kitchen', 'Elegant Kitchen with Island', 'obj-elegant-kitchen', 'Kitchen_2_obj.obj', '/assets/products/thumbnails/obj-elegant-kitchen.png', 400, 400, 270, 1, 'floor', 0, 'Kitchen_2_obj.mtl'),
      imported('obj-ikea-kitchen', 'IKEA Vedinge Kitchen', 'obj-ikea-kitchen', 'Ikea Vedinge Kitchen.obj', '/assets/products/thumbnails/obj-ikea-kitchen.png', 400, 300, 270, 1, 'floor', 0, 'Ikea Vedinge Kitchen.mtl'),
      imported('obj-cooktop-module-l', 'Cooktop Module L', 'obj-cooktop-module-l', 'Cooktop Module L.obj', '/assets/products/thumbnails/obj-cooktop-module-l.png', 85, 59, 77, 1, 'floor', 0, 'Cooktop Module L.mtl'),
      imported('obj-fridge-module-burner-sx', 'Fridge Module with Burner SX', 'obj-fridge-module-burner-sx', 'Fridge module with burner gas SX.obj', '/assets/products/thumbnails/obj-fridge-module-burner-sx.png', 133, 133, 180, 1, 'floor', 0, 'Fridge module with burner gas SX.mtl'),
      imported('obj-barbecue-fga-module-w', 'Barbecue FGA Module W', 'obj-barbecue-fga-module-w', 'Barbecue FGA module W.obj', '/assets/products/thumbnails/obj-barbecue-fga-module-w.png', 120, 81, 117, 1, 'floor', 0, 'Barbecue FGA module W.mtl'),
      imported('obj-cabinet-model-l-with-gas-stove-sx', 'Cabinet Model L with Gas Stove', 'obj-cabinet-model-l-with-gas-stove-sx', 'Cabinet model L with gas stove SX.obj', '/assets/products/thumbnails/obj-cabinet-model-l-with-gas-stove-sx.png', 85, 59, 77, 1, 'floor', 0, 'Cabinet model L with gas stove SX.mtl'),
      imported('obj-blast-chilling-life-w30', 'Blast Chilling Life W30', 'obj-blast-chilling-life-w30', 'Blast chilling Life W30.obj', '/assets/products/thumbnails/obj-blast-chilling-life-w30.png', 85, 64, 54, 1, 'floor', 0, 'Blast chilling Life W30.mtl'),
      imported('obj-shock-chiller-w45', 'Domestic Shock Chiller W45', 'obj-shock-chiller-w45', 'Domestic shock chiller Life W45.obj', '/assets/products/thumbnails/obj-shock-chiller-w45.png', 60, 60, 85, 1, 'floor', 0, 'Domestic shock chiller Life W45.mtl'),
      imported('obj-shock-chiller-w60', 'Domestic Shock Chiller W60', 'obj-shock-chiller-w60', 'Domestic shock chiller Life W60.obj', '/assets/products/thumbnails/obj-shock-chiller-w60.png', 60, 60, 85, 1, 'floor', 0, 'Domestic shock chiller Life W60.mtl'),
      imported('obj-garlyn-ch-50', 'GARLYN CH-50 Hood', 'obj-garlyn-ch-50', 'GARLYN CH-50.obj', '/assets/products/thumbnails/obj-garlyn-ch-50.png', 60, 50, 60, 1, 'floor', 0, 'GARLYN CH-50.mtl'),
      imported('obj-garlyn-h-7000', 'GARLYN H-7000 Hood', 'obj-garlyn-h-7000', 'GARLYN H-7000.obj', '/assets/products/thumbnails/obj-garlyn-h-7000.png', 60, 54, 55, 1, 'floor', 0, 'GARLYN H-7000.mtl'),
      imported('obj-metal-grill-grate-l', 'Metal Grill Grate L', 'obj-metal-grill-grate-l', 'Metal grill grate L.obj', '/assets/products/thumbnails/obj-metal-grill-grate-l.png', 90, 51, 18, 1, 'floor', 0, 'Metal grill grate L.mtl'),
      imported('obj-worktop-module-l', 'Worktop Module L with Large Door', 'obj-worktop-module-l', 'Worktop Module L with large door.obj', '/assets/products/thumbnails/obj-worktop-module-l.png', 85, 60, 77, 1, 'floor', 0, 'Worktop Module L with large door.mtl'),
      imported('obj-kettle-k200', 'Kettle K200', 'obj-kettle-k200', 'K200.obj', '/assets/products/thumbnails/obj-kettle-k200.png', 30, 30, 35, 1, 'surface', 85, 'K200.mtl'),
      imported('obj-coffee-machine-l1000', 'Coffee Machine L-1000', 'obj-coffee-machine-l1000', 'L-1000.obj', '/assets/products/thumbnails/obj-coffee-machine-l1000.png', 40, 35, 45, 1, 'surface', 85, 'L-1000.mtl'),
      imported('obj-coffee-maker-l90', 'Coffee Maker L90', 'obj-coffee-maker-l90', 'L90.obj', '/assets/products/thumbnails/obj-coffee-maker-l90.png', 35, 30, 40, 1, 'surface', 85, 'L90.mtl'),
      imported('obj-extractor-ch60', 'Extractor Hood CH-60', 'obj-extractor-ch60', 'CH-60.obj', '/assets/products/thumbnails/obj-extractor-ch60.png', 60, 50, 60, 1, 'floor', 0, 'CH-60.mtl'),
      imported('obj-kitchen-alegry', 'Kitchen Alegry', 'obj-kitchen-alegry', 'Kitchen Alegry.obj', '/assets/products/thumbnails/obj-kitchen-alegry.png', 200, 60, 90, 1, 'floor', 0, 'Kitchen Alegry.mtl'),
      imported('obj-kitchen-astoria', 'Kitchen Astoria', 'obj-kitchen-astoria', 'Kitchen Astoria.obj', '/assets/products/thumbnails/obj-kitchen-astoria.png', 160, 60, 90, 1, 'floor', 0, 'Kitchen Astoria.mtl'),
      imported('obj-kitchen-kt006', 'Kitchen KT006', 'obj-kitchen-kt006', 'Kitchen KT006.obj', '/assets/products/thumbnails/obj-kitchen-kt006.png', 90, 60, 90, 1, 'floor', 0, 'Kitchen KT006.mtl'),
      imported('obj-kitchen-mia', 'Kitchen MIA', 'obj-kitchen-mia', 'Kitchen MIA.obj', '/assets/products/thumbnails/obj-kitchen-mia.png', 160, 60, 90, 1, 'floor', 0, 'Kitchen MIA.mtl'),
      imported('obj-kitchen-v1-wall-module', 'Kitchen V1 Wall Module', 'obj-kitchen-v1-wall-module', 'Kitchen V1 wall module.obj', '/assets/products/thumbnails/obj-kitchen-v1-wall-module.png', 85, 35, 72, 1, 'floor', 0, 'Kitchen V1 wall module.mtl'),
      imported('obj-kitchen-vipp-v1-tall-module', 'Kitchen Vipp V1 Tall Module', 'obj-kitchen-vipp-v1-tall-module', 'Kitchen Vipp V1 Tall module.obj', '/assets/products/thumbnails/obj-kitchen-vipp-v1-tall-module.png', 60, 60, 200, 1, 'floor', 0, 'Kitchen Vipp V1 Tall module.mtl'),
      imported('obj-the-v2-kitchen', 'The V2 Kitchen', 'obj-the-v2-kitchen', 'The V2 kitchen.obj', '/assets/products/thumbnails/obj-the-v2-kitchen.png', 200, 65, 200, 1, 'floor', 0, 'The V2 kitchen.mtl'),
      imported('obj-the-v2-kitchen-island-narrow', 'The V2 Kitchen Island Narrow Module', 'obj-the-v2-kitchen-island-narrow', 'The V2 kitchen Island Narrow module.obj', '/assets/products/thumbnails/obj-the-v2-kitchen-island-narrow.png', 120, 90, 90, 1, 'floor', 0, 'The V2 kitchen Island Narrow module.mtl'),
      imported('obj-the-v2-kitchen-wall-module', 'The V2 Kitchen Wall Module', 'obj-the-v2-kitchen-wall-module', 'The V2 kitchen Wall module.obj', '/assets/products/thumbnails/obj-the-v2-kitchen-wall-module.png', 85, 35, 72, 1, 'floor', 0, 'The V2 kitchen Wall module.mtl'),
      imported('obj-high-gas-stove', 'High Gas Stove', 'obj-high-gas-stove', 'High gas stove.obj', '/assets/products/thumbnails/obj-high-gas-stove.png', 90, 70, 90, 1, 'floor', 0, 'High gas stove.mtl'),
      imported('obj-master-gas', 'Master Gas Stove', 'obj-master-gas', 'Master gas.obj', '/assets/products/thumbnails/obj-master-gas.png', 90, 65, 85, 1, 'floor', 0, 'Master gas.mtl'),
      imported('obj-hood-2', 'Hood 2', 'obj-hood-2', 'Hood 2.obj', '/assets/products/thumbnails/obj-hood-2.png', 90, 50, 55, 1, 'floor', 0, 'Hood 2.mtl'),
      imported('obj-kh-deluxe', 'KH-Deluxe Hood', 'obj-kh-deluxe', 'KH-Deluxe.obj', '/assets/products/thumbnails/obj-kh-deluxe.png', 60, 50, 60, 1, 'floor', 0, 'KH-Deluxe.mtl'),
      imported('obj-hansa', 'Hansa Hood', 'obj-hansa', 'Hansa.obj', '/assets/products/thumbnails/obj-hansa.png', 60, 54, 60, 1, 'floor', 0, 'Hansa.mtl'),
      imported('obj-hausberg-black', 'Hausberg Black Hood', 'obj-hausberg-black', 'Hausberg black.obj', '/assets/products/thumbnails/obj-hausberg-black.png', 60, 55, 55, 1, 'floor', 0, 'Hausberg black.mtl'),
      imported('obj-hausberg-sensorni-2', 'Hausberg Sensorni 2 Hood', 'obj-hausberg-sensorni-2', 'Hausberg sensorni 2.obj', '/assets/products/thumbnails/obj-hausberg-sensorni-2.png', 60, 50, 65, 1, 'floor', 0, 'Hausberg sensorni 2.mtl'),
      imported('obj-elbe-7407', 'Elbe 7407 Hood', 'obj-elbe-7407', 'Elbe 7407.obj', '/assets/products/thumbnails/obj-elbe-7407.png', 60, 50, 65, 1, 'floor', 0, 'Elbe 7407.mtl'),
      imported('obj-leine-3507', 'Leine 3507 Hood', 'obj-leine-3507', 'Leine 3507.obj', '/assets/products/thumbnails/obj-leine-3507.png', 60, 50, 60, 1, 'floor', 0, 'Leine 3507.mtl'),
      imported('obj-neime-1907', 'Neime 1907 Hood', 'obj-neime-1907', 'Neime 1907.obj', '/assets/products/thumbnails/obj-neime-1907.png', 60, 50, 60, 1, 'floor', 0, 'Neime 1907.mtl'),
      imported('obj-vienna', 'Vienna Hood', 'obj-vienna', 'Vienna.obj', '/assets/products/thumbnails/obj-vienna.png', 60, 50, 60, 1, 'floor', 0, 'Vienna.mtl'),
      imported('obj-amper-2903', 'Amper 2903 Hood', 'obj-amper-2903', 'Amper 2903.obj', '/assets/products/thumbnails/obj-amper-2903.png', 90, 60, 65, 1, 'floor', 0, 'Amper 2903.mtl'),
      imported('obj-7107', '7107 Hood', 'obj-7107', '7707.obj', '/assets/products/thumbnails/obj-7107.png', 60, 55, 60, 1, 'floor', 0, '7707.mtl'),
      imported('obj-kubersberg', 'Kubersberg Hood', 'obj-kubersberg', 'Kubersberg.obj', '/assets/products/thumbnails/obj-kubersberg.png', 90, 55, 65),
      imported('obj-dispenser', 'Dispenser', 'obj-dispenser', 'Dispenser.obj', '/assets/products/thumbnails/obj-dispenser.png', 35, 15, 23, 1, 'floor', 0, 'Dispenser.mtl'),
      imported('obj-freezer-m-7606-140-n', 'Freezer M-7606-140-N', 'obj-freezer-m-7606-140-n', 'Freezer M-7606-140-N.obj', '/assets/products/thumbnails/obj-freezer-m-7606-140-n.png', 45, 49, 140, 1, 'floor', 0, 'Freezer M-7606-140-N.mtl'),
      imported('obj-refrigerator-46-nd', 'Refrigerator with Display 46-ND', 'obj-refrigerator-46-nd', 'Refrigerator with display 46-ND.obj', '/assets/products/thumbnails/obj-refrigerator-46-nd.png', 70, 65, 180, 1, 'floor', 0, 'Refrigerator with display 46-ND.mtl'),
      imported('obj-samsung-rf28m9580', 'Samsung RF28M9580 Refrigerator', 'obj-samsung-rf28m9580', 'Samsung RF28M9580.obj', '/assets/products/thumbnails/obj-samsung-rf28m9580.png', 91, 73, 180, 1, 'floor', 0, 'Samsung RF28M9580.mtl'),
      imported('obj-microwave-3-modes', 'Microwave with 3 Modes', 'obj-microwave-3-modes', 'Microwave with 3 modes.obj', '/assets/products/thumbnails/obj-microwave-3-modes.png', 60, 43, 33, 1, 'floor', 0, 'Microwave with 3 modes.mtl'),
      imported('obj-faucet-karpo-d', 'Faucet Karpo-D', 'obj-faucet-karpo-d', 'Faucet Karpo-D.obj', '/assets/products/thumbnails/obj-faucet-karpo-d.png', 3, 30, 27, 1, 'surface', 85, 'Faucet Karpo-D.mtl'),
      imported('obj-faucet-phobos', 'Faucet Phobos', 'obj-faucet-phobos', 'Faucet Phobos.obj', '/assets/products/thumbnails/obj-faucet-phobos.png', 21, 4, 30, 1, 'surface', 85, 'Faucet Phobos.mtl'),
      imported('obj-faucet-berkel-4807', 'Kitchen Faucet Berkel 4807', 'obj-faucet-berkel-4807', 'Berkel 4803.obj', '/assets/products/thumbnails/obj-faucet-berkel-4807.png', 10, 34, 35, 1, 'surface', 85, 'Berkel 4803.mtl'),
      imported('obj-faucet-rossel-2800', 'Kitchen Faucet Rossel 2800', 'obj-faucet-rossel-2800', 'Kitchen faucet Rossel 2800.obj', '/assets/products/thumbnails/obj-faucet-rossel-2800.png', 25, 25, 30, 1, 'surface', 85, 'Kitchen faucet Rossel 2800.mtl'),
      imported('obj-alba', 'Alba Sink', 'obj-alba', 'Alba.obj', '/assets/products/thumbnails/obj-alba.png', 50, 7, 14, 1, 'surface', 85, 'Alba.mtl'),
      imported('obj-enny', 'Enny Sink', 'obj-enny', 'Enny.obj', '/assets/products/thumbnails/obj-enny.png', 8, 50, 30, 1, 'surface', 85, 'Enny.mtl'),
      imported('obj-era', 'Era Sink', 'obj-era', 'Era.obj', '/assets/products/thumbnails/obj-era.png', 50, 25, 30, 1, 'surface', 85, 'Era.mtl'),
    ],
  },
  {
    id: 'imported-decor',
    name: 'Decor, Art & Lighting',
    thumbnail: '/assets/products/thumbnails/obj-kupol.png',
    itemCount: 19,
    items: [
      imported('imported-fancy-picture-frame', 'Fancy Picture Frame', 'fancy-picture-frame', 'fancy_picture_frame_02_1k.gltf', '/assets/products/thumbnails/fancy-picture-frame.png', 60, 5, 80),
      imported('imported-marble-bust', 'Marble Bust', 'marble-bust', 'marble_bust_01_1k.gltf', '/assets/products/thumbnails/marble-bust.png', 30, 30, 50),
      imported('imported-standing-picture-frame', 'Standing Picture Frame', 'standing-picture-frame', 'standing_picture_frame_01_1k.gltf', '/assets/products/thumbnails/standing-picture-frame.png', 50, 30, 100),
      imported('obj-table-lamp', 'Wood Base Table Lamp', 'obj-table-lamp', '5. Table Lamp.obj', '/assets/products/thumbnails/obj-table-lamp.png', 40, 40, 55),
      imported('obj-bedroom-door', 'Single Bedroom Door', 'obj-bedroom-door', 'Single Door Bedroom.obj', '/models/imported-products/obj-bedroom-door/Preview Image 1.jpg', 90, 10, 210, 3, 'wall', 0, 'Single Door Bedroom.mtl'),
      imported('obj-house-door', 'House Front Door', 'obj-house-door', 'Single House Door.obj', '/models/imported-products/obj-house-door/Preview Image 1.jpg', 100, 10, 220, 3, 'wall', 0, 'Single House Door.mtl'),
      imported('obj-window', 'Classic 3D Window', 'obj-window', '15_Window.obj', '/models/imported-products/obj-window/15_Window.001.png', 100, 10, 120, 3, 'wall', 88, '15_Window.mtl'),
      imported('obj-kupol', 'Kupol Dome', 'obj-kupol', 'Kupol.obj', '/assets/products/thumbnails/obj-kupol.png', 200, 200, 150, 1, 'floor', 0, 'Kupol.mtl'),
      imported('obj-scandi-door', 'Scandinavian Door', 'obj-scandi-door', 'Doors_Academy_Scandi_1.obj', '/assets/products/thumbnails/obj-scandi-door.png', 90, 10, 210, 3, 'wall', 0, 'Doors_Academy_Scandi_1.mtl'),
      imported('obj-classic-window', 'Classic Sash Window', 'obj-classic-window', 'Classic_Window_06_Closed.obj', '/assets/products/thumbnails/obj-classic-window.png', 90, 10, 150, 3, 'wall', 0, 'Classic_Window_06_Closed.mtl'),
      imported('obj-iron-door', 'Arched Wrought Iron Door', 'obj-iron-door', 'Door.obj', '/assets/products/thumbnails/obj-iron-door.png', 100, 10, 250, 3, 'wall', 0, 'Door.mtl'),
      imported('obj-ornate-iron-door', 'Ornate European Iron Door', 'obj-ornate-iron-door', 'relebook.com_ggach304960.obj', '/assets/products/thumbnails/obj-ornate-iron-door.png', 120, 10, 250, 3, 'wall', 0, 'relebook.com_ggach304960.mtl'),
      imported('obj-wood-glass-door', 'Wood Door with Glass Panel', 'obj-wood-glass-door', 'Wood_Door_V3.obj', '/assets/products/thumbnails/obj-wood-glass-door.png', 95, 10, 210, 3, 'wall', 0, 'Wood_Door_V3.mtl'),
      imported('obj-contemporary-curtains', 'Contemporary Curtains', 'obj-contemporary-curtains', 'Contemporary_Curtains_Open.obj', '/assets/products/thumbnails/obj-contemporary-curtains.png', 200, 2, 250, 1, 'floor', 0, 'Contemporary_Curtains_Open.mtl'),
      imported('obj-antares', 'Antares', 'obj-antares', 'Antares.obj', '/assets/products/thumbnails/obj-antares.png', 80, 80, 100, 1, 'floor', 0, 'Antares.mtl'),
      imported('obj-dm11', 'DM11', 'obj-dm11', 'DM11.obj', '/assets/products/thumbnails/obj-dm11.png', 60, 60, 80, 1, 'floor', 0, 'DM11.mtl'),
      imported('obj-dm12', 'DM12', 'obj-dm12', 'DM12.obj', '/assets/products/thumbnails/obj-dm12.png', 60, 60, 80, 1, 'floor', 0, 'DM12.mtl'),
      imported('obj-dm13', 'DM13', 'obj-dm13', 'DM13.obj', '/assets/products/thumbnails/obj-dm13.png', 60, 60, 80, 1, 'floor', 0, 'DM13.mtl'),
      imported('obj-venus', 'VENUS', 'obj-venus', 'VENUS.obj', '/assets/products/thumbnails/obj-venus.png', 80, 80, 100, 1, 'floor', 0, 'VENUS.mtl'),
    ],
  },
  {
    id: 'imported-plants',
    name: 'Plants & Greenery',
    thumbnail: '/assets/products/thumbnails/potted-plant.png',
    itemCount: 1,
    items: [
      imported('imported-potted-plant', 'Potted Plant', 'potted-plant', 'potted_plant_02_1k.gltf', '/assets/products/thumbnails/potted-plant.png', 40, 40, 80),
    ],
  },
];

const PLACEHOLDER = (text) =>
  `https://placehold.co/160x120/252525/666666?text=${encodeURIComponent(text)}`;

const LEGACY_CATEGORY_DEFS = [
  { id: 'legacy-sofas', name: 'Classic Sofas', keywords: ['sofa', 'sectional'] },
  { id: 'legacy-chairs', name: 'Classic Chairs', keywords: ['chair'] },
  { id: 'legacy-tables', name: 'Classic Tables', keywords: ['table', 'console'] },
  { id: 'legacy-bedroom', name: 'Classic Bedroom', keywords: ['bed'] },
  { id: 'legacy-storage', name: 'Classic Storage', keywords: ['dresser', 'wardrobe', 'bookshelf', 'trunk', 'media console'] },
  { id: 'legacy-lighting', name: 'Classic Lighting', keywords: ['lamp'] },
  { id: 'legacy-rugs', name: 'Classic Rugs', keywords: ['rug'] },
  { id: 'legacy-openings', name: 'Doors & Windows', keywords: ['door', 'window'] },
  { id: 'legacy-decor', name: 'Classic Decor', keywords: ['poster'] },
];

/**
 * Map a blueprint items.json entry to a catalog furniture item.
 * @param {object} entry
 * @param {number} index
 * @returns {FurnitureItem}
 */
export function mapBlueprintItemToFurniture(entry, index) {
  const modelUrl = entry.model?.startsWith('/') ? entry.model : `/${entry.model ?? ''}`;
  return {
    id: `legacy-${index}-${entry.name?.replace(/\s+/g, '-').toLowerCase() ?? index}`,
    name: entry.name ?? 'Item',
    thumbnail: entry.thumbnail ?? PLACEHOLDER(entry.name ?? 'Item'),
    modelUrl,
    type: Number(entry.type ?? 1),
    widthCm: 80,
    depthCm: 80,
    heightCm: 80,
    source: 'legacy',
  };
}

/**
 * Build category cards from legacy Blueprint3D items.json entries.
 * @param {object[]} blueprintItems
 * @returns {CategoryCard[]}
 */
export function buildLegacyCatalogCategories(blueprintItems = []) {
  /** @type {CategoryCard[]} */
  const categories = LEGACY_CATEGORY_DEFS.map((def) => ({
    id: def.id,
    name: def.name,
    thumbnail: PLACEHOLDER(def.name),
    itemCount: 0,
    items: [],
  }));

  blueprintItems.forEach((entry, index) => {
    const furniture = mapBlueprintItemToFurniture(entry, index);
    const lower = (entry.name ?? '').toLowerCase();
    const def = LEGACY_CATEGORY_DEFS.find((c) => c.keywords.some((kw) => lower.includes(kw)));
    const catId = def?.id ?? 'legacy-decor';
    const cat = categories.find((c) => c.id === catId);
    if (cat) {
      cat.items.push(furniture);
      cat.itemCount = cat.items.length;
      if (cat.items.length === 1 && entry.thumbnail) {
        cat.thumbnail = entry.thumbnail;
      }
    }
  });

  return categories.filter((cat) => cat.items.length > 0);
}

/** @param {CategoryCard[]} categories */
export function buildCatalogFlat(categories) {
  return categories.flatMap((cat) =>
    cat.items.map((item) => ({
      name: item.name,
      model: item.modelUrl,
      thumbnail: item.thumbnail,
      type: item.type,
    })),
  );
}

/** Default catalog flat list (GLTF/GLB imported products). */
export const DEFAULT_CATALOG_FLAT = buildCatalogFlat(CATALOG_CATEGORIES);

/** @type {InspirationCategory[]} */
export const INSPIRATION_CATEGORIES = [
  {
    id: 'living-room',
    label: 'Living Room',
    rooms: [
      {
        id: 'cozy-living-showroom',
        name: 'Cozy Living Showroom',
        thumbnail: '/models/inspiration/cozy-living-room/textures/photo-1550850587-cd99d1b19677.jpg',
        style: 'Curated 3D Look',
        description: 'Preview the complete styled room, then open an editable layout built from matching catalog pieces.',
        sceneModelUrl: '/models/inspiration/cozy-living-room/cozy-living-room.glb',
        editablePresetId: 'scandinavian-living',
        roomWidthCm: 600,
        roomDepthCm: 500,
      },
      {
        id: 'scandinavian-living',
        name: 'Scandinavian Living Room',
        thumbnail: '/models/imported-products/sofa-01/textures/Sofa_01_diff_1k.jpg',
        style: 'Scandinavian',
        presetId: 'scandinavian-living',
      },
      {
        id: 'coastal-lounge',
        name: 'Coastal Lounge',
        thumbnail: '/models/imported-products/sofa-01/textures/Sofa_01_diff_1k.jpg',
        style: 'Coastal',
        presetId: 'coastal-lounge',
      },
      {
        id: 'luxury-loft',
        name: 'Luxury Loft Living',
        thumbnail: '/models/imported-products/sofa-03/textures/sofa_03_diff_1k.jpg',
        style: 'Luxury',
        presetId: 'luxury-loft',
      },
      {
        id: 'patio-social',
        name: 'Patio Social Lounge',
        thumbnail: '/assets/products/thumbnails/potted-plant.png',
        style: 'Indoor-Outdoor',
        presetId: 'patio-social',
      },
      {
        id: 'foyr-open-plan-suite',
        name: 'Foyr Open Plan Suite',
        thumbnail: '/thumbnails/models/models_imported-products_sofa-03_sofa_03_1k.png',
        style: 'Contemporary',
        description: 'Open-plan lounge, dining, and kitchen with doors, picture windows, and layered ceiling lights.',
        presetId: 'foyr-open-plan-suite',
      },
      {
        id: 'bohemian-living',
        name: 'Bohemian Living Room',
        thumbnail: '/models/imported-products/sofa-02/textures/sofa_02_diff_1k.jpg',
        style: 'Bohemian',
        presetId: 'bohemian-living',
      },
    ],
  },
  {
    id: 'bedroom',
    label: 'Bedroom',
    rooms: [
      {
        id: 'gothic-suite',
        name: 'Gothic Master Suite',
        thumbnail: '/models/imported-products/gothic-bed-01/textures/GothicBed_01_diff_1k.jpg',
        style: 'Gothic',
        presetId: 'gothic-suite',
      },
      {
        id: 'modern-bedroom',
        name: 'Modern Dark Bedroom',
        thumbnail: '/models/imported-products/gothic-bed-01/textures/GothicBed_01_diff_1k.jpg',
        style: 'Modern',
        presetId: 'modern-bedroom',
      },
      {
        id: 'japandi-bedroom',
        name: 'Japandi Minimal Bedroom',
        thumbnail: '/models/imported-products/coffee-table-round-01/textures/coffee_table_round_01_diff_1k.jpg',
        style: 'Japandi',
        presetId: 'japandi-bedroom',
      },
      {
        id: 'boutique-master-suite',
        name: 'Boutique Master Suite',
        thumbnail: '/thumbnails/models/models_imported-products_gothic-bed-01_GothicBed_01_1k.png',
        style: 'Boutique',
        description: 'A master bedroom, dressing zone, and ensuite with doors, windows, ceiling fan, pendants, and bath lighting.',
        presetId: 'boutique-master-suite',
      },
    ],
  },
  {
    id: 'dining',
    label: 'Dining & Kitchen',
    rooms: [
      {
        id: 'dining-kitchen-showroom',
        name: 'Styled Dining Kitchen',
        thumbnail: '/models/inspiration/dining-room-kitchen/textures/TABLE.png',
        style: 'Curated 3D Look',
        description: 'A composed dining-kitchen reference with an editable arrangement and matched product picks.',
        sceneModelUrl: '/models/inspiration/dining-room-kitchen/dining-room-kitchen.glb',
        editablePresetId: 'modern-kitchen',
        roomWidthCm: 540,
        roomDepthCm: 480,
      },
      {
        id: 'imported-kitchen-assets',
        name: 'Modern Breakfast Nook',
        thumbnail: '/models/imported-products/round-wooden-table-01/textures/round_wooden_table_01_diff_1k.jpg',
        style: 'Modern',
        presetId: 'modern-kitchen',
      },
      {
        id: 'family-gathering',
        name: 'Family Gathering Dining',
        thumbnail: '/models/imported-products/round-wooden-table-01/textures/round_wooden_table_01_diff_1k.jpg',
        style: 'Contemporary',
        presetId: 'family-gathering',
      },
      {
        id: 'midcentury-dining',
        name: 'Mid-Century Dining Room',
        thumbnail: '/models/imported-products/chinese-cabinet/textures/chinese_cabinet_diff_1k.jpg',
        style: 'Mid-Century',
        presetId: 'midcentury-dining',
      },
    ],
  },
  {
    id: 'office',
    label: 'Office',
    rooms: [
      {
        id: 'executive-studio',
        name: 'Executive Studio',
        thumbnail: '/thumbnails/models/models_imported-products_marble-bust_marble_bust_01_1k.png',
        style: 'Executive',
        presetId: 'executive-studio',
      },
      {
        id: 'minimal-office',
        name: 'Minimal Home Office',
        thumbnail: '/models/imported-products/round-wooden-table-01/textures/round_wooden_table_01_diff_1k.jpg',
        style: 'Minimal',
        presetId: 'minimal-office',
      },
    ],
  },
  {
    id: 'whole-home',
    label: 'Whole Home',
    rooms: [
      {
        id: 'whole-house-layout',
        name: 'Whole House Layout',
        thumbnail: '/assets/products/thumbnails/arched-glass-door.png',
        style: 'Residential',
        description: 'A complete multi-room house plan with living, kitchen, dining, bedroom, bathroom, hall storage, windows, doors, and ceiling fixtures.',
        presetId: 'whole-house-layout',
      },
    ],
  },
];

export function findInspirationRoom(roomId) {
  return INSPIRATION_CATEGORIES
    .flatMap((category) => category.rooms)
    .find((room) => room.id === roomId) ?? null;
}

/** Curated templates for the new-project flow (preset or scene shells). */
export const PROJECT_START_TEMPLATES = INSPIRATION_CATEGORIES.flatMap((category) =>
  category.rooms
    .filter((room) => room.presetId || room.sceneModelUrl)
    .map((room) => ({
      id: room.id,
      name: room.name,
      style: room.style,
      category: category.label,
      thumbnail: room.thumbnail,
      presetId: room.presetId,
      sceneModelUrl: room.sceneModelUrl,
      roomWidthCm: room.roomWidthCm,
      roomDepthCm: room.roomDepthCm,
    })),
);
