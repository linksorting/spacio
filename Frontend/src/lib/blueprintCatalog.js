export const floorTextures = [
  { name: 'Light wood', url: '/rooms/textures/light_fine_wood.jpg', scale: 300, stretch: false },
  { name: 'Marble tiles', url: '/rooms/textures/marbletiles.jpg', scale: 300, stretch: false },
  { name: 'Hardwood', url: '/rooms/textures/hardwood.png', scale: 400, stretch: false },
];

export const wallTextures = [
  { name: 'White paint', url: '/rooms/textures/wallmap.png', scale: 0, stretch: true },
  { name: 'Yellow paint', url: '/rooms/textures/wallmap_yellow.png', scale: 0, stretch: true },
  { name: 'Light brick', url: '/rooms/textures/light_brick.jpg', scale: 400, stretch: false },
];

export const loadBlueprintCatalog = async () => {
  const response = await fetch('/items.json');
  if (!response.ok) throw new Error('Could not load furniture catalog.');
  return response.json();
};
