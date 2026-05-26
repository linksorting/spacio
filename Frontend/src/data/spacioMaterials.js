export const spacioMaterials = {
  plaster: { id: 'plaster', name: 'White Plaster', color: '#eee9df', roughness: 0.92, metalness: 0 },
  oak: { id: 'oak', name: 'Warm Oak', color: '#bb8853', roughness: 0.58, metalness: 0 },
  walnut: { id: 'walnut', name: 'Dark Walnut', color: '#563925', roughness: 0.5, metalness: 0 },
  concrete: { id: 'concrete', name: 'Polished Concrete', color: '#aca59f', roughness: 0.44, metalness: 0.08 },
  marble: { id: 'marble', name: 'Carrara Marble', color: '#e7e4df', roughness: 0.25, metalness: 0.03 },
  boucle: { id: 'boucle', name: 'Boucle Fabric', color: '#e5ddce', roughness: 0.98, metalness: 0 },
  linen: { id: 'linen', name: 'Linen Fabric', color: '#d9ccb8', roughness: 0.96, metalness: 0 },
  velvet: { id: 'velvet', name: 'Emerald Velvet', color: '#204c42', roughness: 0.82, metalness: 0 },
  brass: { id: 'brass', name: 'Brushed Brass', color: '#b68a43', roughness: 0.3, metalness: 1 },
  blackMetal: { id: 'blackMetal', name: 'Matte Black Metal', color: '#202020', roughness: 0.45, metalness: 0.75 },
  glass: { id: 'glass', name: 'Clear Glass', color: '#d7eef0', roughness: 0.08, metalness: 0, transparent: true, opacity: 0.36 },
  terracotta: { id: 'terracotta', name: 'Terracotta', color: '#ad6044', roughness: 0.88, metalness: 0 },
  ceramic: { id: 'ceramic', name: 'Ceramic Glaze', color: '#ece7dc', roughness: 0.22, metalness: 0.04 },
  leather: { id: 'leather', name: 'Tan Leather', color: '#a96943', roughness: 0.64, metalness: 0 },
  jute: { id: 'jute', name: 'Woven Jute', color: '#b69a70', roughness: 1, metalness: 0 },
  canvasArt: { id: 'canvasArt', name: 'Canvas Art', color: '#d7cfc2', roughness: 0.86, metalness: 0 },
  led: { id: 'led', name: 'Warm LED Emissive', color: '#ffe0a3', roughness: 0.3, metalness: 0, emissive: '#ffd383' },
};

export const materialOptions = Object.values(spacioMaterials);
