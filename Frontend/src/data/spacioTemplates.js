import { createEmptyScene } from '@/store/initialScene';
import { buildPremadeScene, premadeRoomTemplates } from '@/data/premadeRooms';

export const templates = [
  ...premadeRoomTemplates,
  { id: 'empty-studio', name: 'Empty Studio', summary: 'Open canvas for a new concept', roomType: 'generic', style: 'Minimal', furnitureCount: 0, areaM2: 0 },
];

export const loadTemplateScene = (templateId) => {
  const premade = buildPremadeScene(templateId);
  if (premade) return premade;

  const scene = createEmptyScene(templates.find((item) => item.id === templateId)?.name || 'New Design', templateId);
  if (templateId === 'empty-studio') {
    return scene;
  }
  return scene;
};
