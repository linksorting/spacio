import JSZip from 'jszip';
import { distance2D } from './spacioGeometry';

const safeName = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
const saveAs = (blob, filename) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};

export const exportProjectJson = (scene) => {
  const blob = new Blob([JSON.stringify(scene, null, 2)], { type: 'application/json;charset=utf-8' });
  saveAs(blob, `${safeName(scene.name)}.spacio`);
};

export const buildFloorplanSvg = (scene) => {
  const rooms = Object.values(scene.rooms);
  const walls = Object.values(scene.walls);
  const furniture = Object.values(scene.furniture);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1100" height="850" viewBox="-70 -70 900 680">
  <rect x="-70" y="-70" width="900" height="680" fill="#faf8f5"/>
  <text x="0" y="-32" font-family="Arial" font-size="20" fill="#18171b">${scene.name}</text>
  ${rooms.map((room) => `<polygon points="${room.polygon.map((point) => `${point.x},${point.y}`).join(' ')}" fill="#eadfce" stroke="none"/><text x="${room.polygon[0].x + 250}" y="${room.polygon[0].y + 260}" font-family="Arial" text-anchor="middle" fill="#766b5f">${room.name} | ${room.areaM2.toFixed(1)} m2</text>`).join('')}
  ${walls.map((wall) => `<line x1="${wall.start.x}" y1="${wall.start.y}" x2="${wall.end.x}" y2="${wall.end.y}" stroke="#29252a" stroke-width="${wall.thicknessCm}" stroke-linecap="square"/><text x="${(wall.start.x + wall.end.x) / 2}" y="${(wall.start.y + wall.end.y) / 2 - 14}" font-family="Arial" text-anchor="middle" font-size="11" fill="#564c44">${Math.round(distance2D(wall.start, wall.end))} cm</text>`).join('')}
  ${furniture.map((item) => `<rect x="${item.position.x}" y="${item.position.y}" width="${item.dimensionsCm.w}" height="${item.dimensionsCm.d}" transform="rotate(${item.rotationY} ${item.position.x + item.dimensionsCm.w / 2} ${item.position.y + item.dimensionsCm.d / 2})" rx="8" fill="#cdbb9e" stroke="#655847"/><text x="${item.position.x + item.dimensionsCm.w / 2}" y="${item.position.y + item.dimensionsCm.d / 2}" font-family="Arial" text-anchor="middle" font-size="10" fill="#332c27">${item.name}</text>`).join('')}
</svg>`;
};

export const exportFloorplanSvg = (scene) => saveAs(
  new Blob([buildFloorplanSvg(scene)], { type: 'image/svg+xml;charset=utf-8' }),
  `${safeName(scene.name)}-floorplan.svg`,
);

export const exportCanvasPng = (canvas, filename) => {
  canvas.toBlob((blob) => {
    if (blob) saveAs(blob, filename);
  }, 'image/png');
};

export const exportProjectZip = async (scene, canvas) => {
  const zip = new JSZip();
  zip.file('project.spacio', JSON.stringify(scene, null, 2));
  zip.file('metadata.json', JSON.stringify({ name: scene.name, exportedAt: new Date().toISOString(), units: scene.units }, null, 2));
  if (canvas) {
    const image = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
    if (image) zip.file('preview.png', image);
  }
  saveAs(await zip.generateAsync({ type: 'blob' }), `${safeName(scene.name)}-archive.zip`);
};

export const validateImportedScene = (data) => {
  if (!data || typeof data !== 'object' || !data.id || !data.name) throw new Error('This file does not contain a SPACIO project.');
  ['walls', 'openings', 'rooms', 'furniture', 'lights', 'materials'].forEach((key) => {
    if (!data[key] || typeof data[key] !== 'object') throw new Error(`The project is missing ${key} data.`);
  });
  return data;
};
