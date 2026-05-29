export const floorTextures = [
  { name: 'White', url: '/rooms/textures/wallmap.png', scale: 0, stretch: true },
  { name: 'Light wood', url: '/rooms/textures/light_fine_wood.jpg', scale: 300, stretch: false },
  { name: 'Marble tiles', url: '/rooms/textures/marbletiles.jpg', scale: 300, stretch: false },
  { name: 'Hardwood', url: '/rooms/textures/hardwood.png', scale: 400, stretch: false },
];

export const wallTextures = [
  { name: 'White Paint', url: '/rooms/textures/wallmap.png', scale: 0, stretch: true },
  { name: 'Cream', url: '/rooms/textures/wallmap_yellow.png', scale: 0, stretch: true },
  { name: 'Light Brick', url: '/rooms/textures/light_brick.jpg', scale: 300, stretch: false },
  { name: 'Marble', url: '/rooms/textures/marbletiles.jpg', scale: 250, stretch: false },
  { name: 'Wood Panel', url: '/rooms/textures/light_fine_wood.jpg', scale: 200, stretch: false },
  { name: 'Concrete', url: '/rooms/textures/hardwood.png', scale: 350, stretch: false },
];

export const ceilingTextures = [
  { name: 'White', url: '/rooms/textures/wallmap.png', scale: 200 },
  { name: 'Wood', url: '/rooms/textures/light_fine_wood.jpg', scale: 150 },
  { name: 'Concrete', url: '/rooms/textures/light_brick.jpg', scale: 300 },
];

export const loadBlueprintCatalog = async () => {
  const response = await fetch('/items.json');
  if (!response.ok) throw new Error('Could not load furniture catalog.');
  return response.json();
};
