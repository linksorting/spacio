const productCatalog = {
  armchair_blue: {
    id: 'armchair_blue',
    name: 'Blue Accent Armchair',
    type: 'Seating',
    img: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=320&h=320&fit=crop'
  },
  armchair_boucle: {
    id: 'armchair_boucle',
    name: 'Boucle Lounge Chair',
    type: 'Seating',
    img: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=320&h=320&fit=crop'
  },
  sofa_modular: {
    id: 'sofa_modular',
    name: 'Modular Sofa',
    type: 'Seating',
    img: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=320&h=320&fit=crop'
  },
  chair_ergonomic: {
    id: 'chair_ergonomic',
    name: 'Ergonomic Task Chair',
    type: 'Seating',
    img: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=320&h=320&fit=crop'
  },
  chair_dining: {
    id: 'chair_dining',
    name: 'Walnut Dining Chair',
    type: 'Seating',
    img: 'https://images.unsplash.com/photo-1503602642458-232111445657?w=320&h=320&fit=crop'
  },
  desk_executive: {
    id: 'desk_executive',
    name: 'Executive Desk',
    type: 'Tables',
    img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=320&h=320&fit=crop'
  },
  table_coffee: {
    id: 'table_coffee',
    name: 'Oval Coffee Table',
    type: 'Tables',
    img: 'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=320&h=320&fit=crop'
  },
  nightstand_oak: {
    id: 'nightstand_oak',
    name: 'Oak Nightstand',
    type: 'Tables',
    img: 'https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=320&h=320&fit=crop'
  },
  lamp_globe: {
    id: 'lamp_globe',
    name: 'Globe Pendant Light',
    type: 'Lighting',
    img: 'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=320&h=320&fit=crop'
  },
  lamp_floor: {
    id: 'lamp_floor',
    name: 'Arc Floor Lamp',
    type: 'Lighting',
    img: 'https://images.unsplash.com/photo-1534189900-63b9a5415ee7?w=320&h=320&fit=crop'
  },
  chandelier_rattan: {
    id: 'chandelier_rattan',
    name: 'Rattan Chandelier',
    type: 'Lighting',
    img: 'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=320&h=320&fit=crop'
  },
  wall_art: {
    id: 'wall_art',
    name: 'Abstract Wall Art',
    type: 'Decor',
    img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=320&h=320&fit=crop'
  },
  plant_terrarium: {
    id: 'plant_terrarium',
    name: 'Terrarium Plant Set',
    type: 'Decor',
    img: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=320&h=320&fit=crop'
  },
  rug_woven: {
    id: 'rug_woven',
    name: 'Woven Area Rug',
    type: 'Textiles',
    img: 'https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?w=320&h=320&fit=crop'
  },
  bed_platform: {
    id: 'bed_platform',
    name: 'Platform Bed',
    type: 'Bedroom',
    img: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=320&h=320&fit=crop'
  },
  wardrobe_nordic: {
    id: 'wardrobe_nordic',
    name: 'Nordic Wardrobe',
    type: 'Storage',
    img: 'https://images.unsplash.com/photo-1556020685-ae41abfc9365?w=320&h=320&fit=crop'
  },
  headboard_velvet: {
    id: 'headboard_velvet',
    name: 'Velvet Headboard',
    type: 'Bedroom',
    img: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=320&h=320&fit=crop'
  },
  vanity_floating: {
    id: 'vanity_floating',
    name: 'Floating Vanity',
    type: 'Bathroom',
    img: 'https://images.unsplash.com/photo-1620626011761-996317702782?w=320&h=320&fit=crop'
  },
  bathtub_free: {
    id: 'bathtub_free',
    name: 'Freestanding Bathtub',
    type: 'Bathroom',
    img: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=320&h=320&fit=crop'
  },
  shower_rain: {
    id: 'shower_rain',
    name: 'Rain Shower System',
    type: 'Bathroom',
    img: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=320&h=320&fit=crop'
  },
  toilet_wall: {
    id: 'toilet_wall',
    name: 'Wall-Hung Toilet',
    type: 'Bathroom',
    img: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=320&h=320&fit=crop'
  },
  cabinet_shaker: {
    id: 'cabinet_shaker',
    name: 'Shaker Cabinet Set',
    type: 'Cabinetry',
    img: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=320&h=320&fit=crop'
  },
  countertop_island: {
    id: 'countertop_island',
    name: 'Island Countertop',
    type: 'Surfaces',
    img: 'https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=320&h=320&fit=crop'
  },
  range_hood: {
    id: 'range_hood',
    name: 'Stainless Steel Range Hood',
    type: 'Appliances',
    img: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=320&h=320&fit=crop'
  },
  sink_undermount: {
    id: 'sink_undermount',
    name: 'Undermount Sink',
    type: 'Appliances',
    img: 'https://images.unsplash.com/photo-1556910638-6cdac31d44dc?w=320&h=320&fit=crop'
  },
  dining_table_marble: {
    id: 'dining_table_marble',
    name: 'Marble Dining Table',
    type: 'Tables',
    img: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=320&h=320&fit=crop'
  },
  sideboard_cabinet: {
    id: 'sideboard_cabinet',
    name: 'Sideboard Cabinet',
    type: 'Storage',
    img: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=320&h=320&fit=crop'
  },
  bookshelf_unit: {
    id: 'bookshelf_unit',
    name: 'Bookshelf Unit',
    type: 'Storage',
    img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=320&h=320&fit=crop'
  },
  flooring_herringbone: {
    id: 'flooring_herringbone',
    name: 'Herringbone Flooring',
    type: 'Surfaces',
    img: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=320&h=320&fit=crop'
  },
  window_casement: {
    id: 'window_casement',
    name: 'Casement Window',
    type: 'Architectural',
    img: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=320&h=320&fit=crop'
  }
};

const inspirationEntries = [
  {
    id: 'classic-home-office-cum-living-room-design',
    title: 'classic home office cum living room design',
    category: 'Living',
    segment: 'Residential',
    by: 'Foyr',
    description: 'A bright hybrid room that balances lounge comfort with a polished work zone, using layered seating, soft blues, and statement art to keep the space warm and client-ready.',
    image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1200&h=900&fit=crop',
    productCount: 18,
    searchTerms: ['home office', 'living room', 'classic', 'blue chairs', 'work from home'],
    productTypes: [
      { label: 'Seating', count: 4 },
      { label: 'Lighting', count: 3 },
      { label: 'Decor', count: 5 },
      { label: 'Tables', count: 3 },
      { label: 'Storage', count: 3 }
    ],
    productIds: ['armchair_blue', 'armchair_boucle', 'desk_executive', 'table_coffee', 'lamp_globe', 'lamp_floor', 'wall_art', 'plant_terrarium', 'bookshelf_unit']
  },
  {
    id: 'artistic-coastal-home-office-with-eclectic-charm',
    title: 'artistic coastal home office with eclectic charm',
    category: 'Home Office',
    segment: 'Residential',
    by: 'Foyr',
    description: 'Sun-washed materials, layered textures, and light-touch styling give this office a relaxed coastal tone while still feeling productive enough for long design reviews.',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&h=900&fit=crop',
    productCount: 14,
    searchTerms: ['coastal', 'office', 'eclectic', 'desk', 'studio'],
    productTypes: [
      { label: 'Seating', count: 3 },
      { label: 'Lighting', count: 2 },
      { label: 'Storage', count: 4 },
      { label: 'Decor', count: 3 },
      { label: 'Tables', count: 2 }
    ],
    productIds: ['desk_executive', 'chair_ergonomic', 'lamp_floor', 'bookshelf_unit', 'plant_terrarium', 'wall_art', 'armchair_boucle', 'window_casement']
  },
  {
    id: 'serene-sage-green-home-office-with-cozy-reading-nook',
    title: 'serene sage green home office with cozy reading nook',
    category: 'Home Office',
    segment: 'Residential',
    by: 'Foyr',
    description: 'Custom storage, a calm palette, and a dedicated reading corner make this workspace feel grounded, premium, and easy to live with every day.',
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200&h=900&fit=crop',
    productCount: 16,
    searchTerms: ['sage green', 'reading nook', 'home office', 'calm'],
    productTypes: [
      { label: 'Storage', count: 5 },
      { label: 'Seating', count: 3 },
      { label: 'Lighting', count: 2 },
      { label: 'Decor', count: 4 },
      { label: 'Tables', count: 2 }
    ],
    productIds: ['bookshelf_unit', 'chair_ergonomic', 'armchair_boucle', 'lamp_floor', 'plant_terrarium', 'desk_executive', 'rug_woven', 'window_casement']
  },
  {
    id: 'modern-kitchen-with-marble-waterfall-island',
    title: 'modern kitchen with marble waterfall island',
    category: 'Kitchen',
    segment: 'Residential',
    by: 'Foyr',
    description: 'This kitchen uses a bright shell, sleek cabinetry, and a centerpiece island to create a high-function prep zone with a crisp editorial finish.',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&h=900&fit=crop',
    productCount: 22,
    searchTerms: ['kitchen', 'waterfall island', 'modern', 'marble'],
    productTypes: [
      { label: 'Cabinetry', count: 6 },
      { label: 'Appliances', count: 5 },
      { label: 'Lighting', count: 3 },
      { label: 'Surfaces', count: 4 },
      { label: 'Seating', count: 4 }
    ],
    productIds: ['cabinet_shaker', 'countertop_island', 'range_hood', 'sink_undermount', 'chair_dining', 'lamp_globe', 'flooring_herringbone', 'sideboard_cabinet']
  },
  {
    id: 'maximize-underused-space-in-kitchen',
    title: 'maximize underused space in kitchen',
    category: 'Kitchen',
    segment: 'Residential',
    by: 'Foyr',
    description: 'A compact kitchen layout that stretches every inch with vertical storage, integrated appliances, and minimal finishes that help the room feel open.',
    image: 'https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=1200&h=900&fit=crop',
    productCount: 17,
    searchTerms: ['small kitchen', 'space saving', 'underused space', 'compact'],
    productTypes: [
      { label: 'Cabinetry', count: 5 },
      { label: 'Appliances', count: 4 },
      { label: 'Surfaces', count: 3 },
      { label: 'Lighting', count: 2 },
      { label: 'Decor', count: 3 }
    ],
    productIds: ['cabinet_shaker', 'range_hood', 'sink_undermount', 'countertop_island', 'lamp_globe', 'plant_terrarium', 'bookshelf_unit', 'chair_dining']
  },
  {
    id: 'graphic-contrast-bathroom-with-retro-vibes',
    title: 'graphic contrast bathroom with retro vibes',
    category: 'Bathroom',
    segment: 'Residential',
    by: 'Foyr',
    description: 'High-contrast finishes and sculpted sanitaryware give this bathroom a boutique feel while keeping the composition clean and easy to style.',
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1200&h=900&fit=crop',
    productCount: 12,
    searchTerms: ['bathroom', 'retro', 'contrast', 'graphic'],
    productTypes: [
      { label: 'Bathroom', count: 5 },
      { label: 'Lighting', count: 2 },
      { label: 'Surfaces', count: 2 },
      { label: 'Decor', count: 3 }
    ],
    productIds: ['shower_rain', 'vanity_floating', 'toilet_wall', 'lamp_globe', 'wall_art', 'plant_terrarium', 'flooring_herringbone', 'bathtub_free']
  },
  {
    id: 'rustic-stone-vanity-with-ambient-glow',
    title: 'rustic stone vanity with ambient glow',
    category: 'Bathroom',
    segment: 'Residential',
    by: 'Foyr',
    description: 'Warm lighting, tonal stone, and understated styling turn this bathroom into a spa-like retreat that still feels practical for everyday use.',
    image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=1200&h=900&fit=crop',
    productCount: 15,
    searchTerms: ['stone vanity', 'ambient glow', 'spa bathroom', 'rustic'],
    productTypes: [
      { label: 'Bathroom', count: 6 },
      { label: 'Lighting', count: 2 },
      { label: 'Decor', count: 4 },
      { label: 'Surfaces', count: 3 }
    ],
    productIds: ['bathtub_free', 'vanity_floating', 'shower_rain', 'toilet_wall', 'plant_terrarium', 'lamp_floor', 'rug_woven', 'wall_art']
  },
  {
    id: 'japandi-canopy-bedroom-with-charcoal-accents',
    title: 'japandi canopy bedroom with charcoal accents',
    category: 'Bedroom',
    segment: 'Residential',
    by: 'Foyr',
    description: 'A pared-back bedroom with warm woods, low contrast textures, and deep accent notes that make the room feel restful without losing visual punch.',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200&h=900&fit=crop',
    productCount: 13,
    searchTerms: ['japandi', 'bedroom', 'charcoal', 'canopy'],
    productTypes: [
      { label: 'Bedroom', count: 5 },
      { label: 'Lighting', count: 2 },
      { label: 'Textiles', count: 3 },
      { label: 'Decor', count: 3 }
    ],
    productIds: ['bed_platform', 'wardrobe_nordic', 'headboard_velvet', 'nightstand_oak', 'lamp_floor', 'rug_woven', 'wall_art', 'plant_terrarium']
  },
  {
    id: 'sunken-japandi-lounge-with-built-in-display-warmth',
    title: 'sunken japandi lounge with built-in display warmth',
    category: 'Living',
    segment: 'Residential',
    by: 'Foyr',
    description: 'Built-in storage, soft modern seating, and restrained materials make this lounge feel collected, calm, and intentionally composed.',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&h=900&fit=crop',
    productCount: 19,
    searchTerms: ['japandi', 'living room', 'sunken lounge', 'built in'],
    productTypes: [
      { label: 'Seating', count: 5 },
      { label: 'Storage', count: 4 },
      { label: 'Lighting', count: 3 },
      { label: 'Decor', count: 4 },
      { label: 'Tables', count: 3 }
    ],
    productIds: ['sofa_modular', 'armchair_boucle', 'table_coffee', 'lamp_globe', 'plant_terrarium', 'bookshelf_unit', 'rug_woven', 'sideboard_cabinet']
  },
  {
    id: 'eclectic-dining-corner-with-bold-art-and-stripes',
    title: 'eclectic dining corner with bold art and stripes',
    category: 'Dining',
    segment: 'Residential',
    by: 'Foyr',
    description: 'A compact dining composition with expressive art, layered seating, and strong surfaces that can easily anchor a mixed-use open-plan home.',
    image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=1200&h=900&fit=crop',
    productCount: 11,
    searchTerms: ['dining', 'eclectic', 'art', 'stripes'],
    productTypes: [
      { label: 'Tables', count: 2 },
      { label: 'Seating', count: 4 },
      { label: 'Lighting', count: 2 },
      { label: 'Decor', count: 3 }
    ],
    productIds: ['dining_table_marble', 'chair_dining', 'chandelier_rattan', 'sideboard_cabinet', 'wall_art', 'plant_terrarium', 'rug_woven']
  },
  {
    id: 'modern-living-room-with-sculptural-lighting-and-soft-blues',
    title: 'modern living room with sculptural lighting and soft blues',
    category: 'Living',
    segment: 'Residential',
    by: 'Foyr',
    description: 'Soft blue upholstery, crisp architectural lines, and sculptural lighting give this living room a refined but livable designer finish.',
    image: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=1200&h=900&fit=crop',
    productCount: 20,
    searchTerms: ['living room', 'soft blues', 'modern', 'sculptural lighting'],
    productTypes: [
      { label: 'Seating', count: 6 },
      { label: 'Lighting', count: 3 },
      { label: 'Decor', count: 5 },
      { label: 'Tables', count: 3 },
      { label: 'Textiles', count: 3 }
    ],
    productIds: ['sofa_modular', 'armchair_blue', 'table_coffee', 'lamp_globe', 'lamp_floor', 'rug_woven', 'wall_art', 'plant_terrarium']
  },
  {
    id: 'cozy-under-stair-reading-nook-with-built-in-bookshelves',
    title: 'cozy under-stair reading nook with built-in bookshelves',
    category: 'Living',
    segment: 'Residential',
    by: 'Foyr',
    description: 'This compact corner makes clever use of architecture, turning dead space into a warm retreat with storage, lighting, and tactile materials.',
    image: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=1200&h=900&fit=crop',
    productCount: 10,
    searchTerms: ['reading nook', 'under stair', 'bookshelves', 'cozy'],
    productTypes: [
      { label: 'Storage', count: 4 },
      { label: 'Seating', count: 2 },
      { label: 'Lighting', count: 2 },
      { label: 'Decor', count: 2 }
    ],
    productIds: ['bookshelf_unit', 'armchair_boucle', 'lamp_floor', 'plant_terrarium', 'rug_woven', 'wall_art']
  }
];

export const inspirationLibrary = inspirationEntries.map((entry) => ({
  ...entry,
  products: entry.productIds.map((productId) => productCatalog[productId]).filter(Boolean)
}));
