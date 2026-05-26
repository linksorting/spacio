import { distance2D, furnitureRotationHandle, midpoint, openingGeometry } from '@/utils/spacioGeometry';

const RULER_SIZE = 32;
const MINIMAP = { width: 174, height: 126, margin: 18 };
const GRID_MAJOR_CM = 100;
const SELECTION_COLOR = '#d946ef';
const CANVAS_BACKGROUND = '#f5f1ea';
const FONT_STACK = '"DM Sans", "Inter", sans-serif';

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const formatLength = (cm) => cm >= 100 ? `${(cm / 100).toFixed(2)} m` : `${Math.round(cm)} cm`;
const objectValues = (collection) => Object.values(collection || {});

const tracePolygon = (ctx, polygon) => {
  if (!polygon?.length) return;
  ctx.beginPath();
  polygon.forEach((point, index) => {
    if (index === 0) ctx.moveTo(point.x, point.y);
    else ctx.lineTo(point.x, point.y);
  });
  ctx.closePath();
};

const getSceneBounds = (scene) => {
  const points = [];
  objectValues(scene.rooms).forEach((room) => points.push(...(room.polygon || [])));
  objectValues(scene.walls).forEach((wall) => points.push(wall.start, wall.end));
  objectValues(scene.furniture).forEach((item) => {
    points.push(item.position, {
      x: item.position.x + item.dimensionsCm.w,
      y: item.position.y + item.dimensionsCm.d,
    });
  });
  if (!points.length) return { minX: -100, minY: -100, maxX: 500, maxY: 400 };
  const margin = 80;
  return points.reduce((bounds, point) => ({
    minX: Math.min(bounds.minX, point.x - margin),
    minY: Math.min(bounds.minY, point.y - margin),
    maxX: Math.max(bounds.maxX, point.x + margin),
    maxY: Math.max(bounds.maxY, point.y + margin),
  }), {
    minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity,
  });
};

export const clampFloorplanZoom = (zoom) => clamp(zoom, 0.1, 4);

export default class FloorplanRenderer {
  constructor(ctx) {
    this.ctx = ctx;
  }

  render(scene, viewport, width, height, transient = {}) {
    const { ctx } = this;
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = CANVAS_BACKGROUND;
    ctx.fillRect(0, 0, width, height);

    ctx.save();
    ctx.beginPath();
    ctx.rect(RULER_SIZE, RULER_SIZE, width - RULER_SIZE, height - RULER_SIZE);
    ctx.clip();
    ctx.translate(viewport.pan.x, viewport.pan.y);
    ctx.scale(viewport.zoom, viewport.zoom);
    this.drawGrid(scene, viewport, width, height);
    this.drawRooms(scene, viewport);
    this.drawWalls(scene, viewport);
    this.drawOpenings(scene, viewport);
    this.drawFurniture(scene, viewport);
    this.drawMeasurements(scene, viewport);
    this.drawInteractionPreview(scene, transient, viewport);
    ctx.restore();

    this.drawRulers(viewport, width, height);
    this.drawMinimap(scene, viewport, width, height);
  }

  visibleWorldBounds(viewport, width, height) {
    return {
      left: (RULER_SIZE - viewport.pan.x) / viewport.zoom,
      top: (RULER_SIZE - viewport.pan.y) / viewport.zoom,
      right: (width - viewport.pan.x) / viewport.zoom,
      bottom: (height - viewport.pan.y) / viewport.zoom,
    };
  }

  drawGrid(scene, viewport, width, height) {
    const { ctx } = this;
    const bounds = this.visibleWorldBounds(viewport, width, height);
    const minorCm = scene.settings.gridSizeCm || 25;
    const fade = clamp((viewport.zoom - 0.12) / 0.35, 0, 1);
    if (fade <= 0) return;

    const startX = Math.floor(bounds.left / minorCm) * minorCm;
    const startY = Math.floor(bounds.top / minorCm) * minorCm;
    for (let x = startX; x <= bounds.right; x += minorCm) {
      const major = Math.round(x) % GRID_MAJOR_CM === 0;
      ctx.strokeStyle = major ? `rgba(86, 75, 67, ${0.2 * fade})` : `rgba(108, 95, 86, ${0.075 * fade})`;
      ctx.lineWidth = (major ? 1.1 : 0.7) / viewport.zoom;
      ctx.beginPath();
      ctx.moveTo(x, bounds.top);
      ctx.lineTo(x, bounds.bottom);
      ctx.stroke();
    }
    for (let y = startY; y <= bounds.bottom; y += minorCm) {
      const major = Math.round(y) % GRID_MAJOR_CM === 0;
      ctx.strokeStyle = major ? `rgba(86, 75, 67, ${0.2 * fade})` : `rgba(108, 95, 86, ${0.075 * fade})`;
      ctx.lineWidth = (major ? 1.1 : 0.7) / viewport.zoom;
      ctx.beginPath();
      ctx.moveTo(bounds.left, y);
      ctx.lineTo(bounds.right, y);
      ctx.stroke();
    }
  }

  drawRooms(scene, viewport) {
    const { ctx } = this;
    objectValues(scene.rooms).forEach((room) => {
      if (!room.visible || !room.polygon?.length) return;
      tracePolygon(ctx, room.polygon);
      ctx.fillStyle = scene.selectedIds.includes(room.id) ? 'rgba(217, 70, 239, 0.12)' : 'rgba(206, 186, 153, 0.24)';
      ctx.fill();
      if (scene.selectedIds.includes(room.id)) {
        ctx.strokeStyle = SELECTION_COLOR;
        ctx.lineWidth = 2 / viewport.zoom;
        ctx.stroke();
      }
      const center = room.polygon.reduce((sum, point) => ({
        x: sum.x + point.x / room.polygon.length,
        y: sum.y + point.y / room.polygon.length,
      }), { x: 0, y: 0 });
      this.drawText(room.name, center.x, center.y - 9 / viewport.zoom, 13, '#594c43', viewport, 600);
      this.drawText(`${room.areaM2.toFixed(1)} m2`, center.x, center.y + 12 / viewport.zoom, 11, '#86786b', viewport, 500);
    });
  }

  drawWalls(scene, viewport) {
    const { ctx } = this;
    objectValues(scene.walls).forEach((wall) => {
      if (!wall.visible) return;
      const selected = scene.selectedIds.includes(wall.id);

      const dx = wall.end.x - wall.start.x;
      const dy = wall.end.y - wall.start.y;
      const len = distance2D(wall.start, wall.end);
      if (len < 0.01) return;

      const h = wall.thicknessCm / 2;
      const udx = dx / len;
      const udy = dy / len;
      const nx = -udy * h;
      const ny = udx * h;
      const ex = udx * h;
      const ey = udy * h;

      ctx.fillStyle = selected ? SELECTION_COLOR : '#302c2d';
      ctx.beginPath();
      ctx.moveTo(wall.start.x - ex + nx, wall.start.y - ey + ny);
      ctx.lineTo(wall.end.x + ex + nx, wall.end.y + ey + ny);
      ctx.lineTo(wall.end.x + ex - nx, wall.end.y + ey - ny);
      ctx.lineTo(wall.start.x - ex - nx, wall.start.y - ey - ny);
      ctx.closePath();
      ctx.fill();

      const center = midpoint(wall.start, wall.end);
      const angle = Math.atan2(dy, dx);
      const normal = { x: -Math.sin(angle), y: Math.cos(angle) };
      const offset = wall.thicknessCm / 2 + 19 / viewport.zoom;
      this.drawTag(
        formatLength(len),
        center.x - normal.x * offset,
        center.y - normal.y * offset,
        viewport,
      );
    });
  }

  drawOpenings(scene, viewport) {
    const { ctx } = this;
    objectValues(scene.openings).forEach((opening) => {
      const wall = scene.walls[opening.wallId];
      const geometry = wall ? openingGeometry(opening, wall) : null;
      if (!opening.visible || !wall || !geometry) return;
      const { start, end, tangent, normal } = geometry;
      const selected = scene.selectedIds.includes(opening.id);
      ctx.lineCap = 'butt';
      ctx.strokeStyle = CANVAS_BACKGROUND;
      ctx.lineWidth = wall.thicknessCm + 4 / viewport.zoom;
      ctx.beginPath();
      ctx.moveTo(start.x, start.y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();
      ctx.strokeStyle = selected ? SELECTION_COLOR : opening.type === 'door' ? '#b06e49' : '#3f91aa';
      ctx.lineWidth = (selected ? 3 : 2.5) / viewport.zoom;
      if (opening.type === 'window') {
        [-3, 3].forEach((offset) => {
          ctx.beginPath();
          ctx.moveTo(start.x + normal.x * offset / viewport.zoom, start.y + normal.y * offset / viewport.zoom);
          ctx.lineTo(end.x + normal.x * offset / viewport.zoom, end.y + normal.y * offset / viewport.zoom);
          ctx.stroke();
        });
        return;
      }
      const hinge = start;
      const openEnd = {
        x: hinge.x + normal.x * opening.widthCm,
        y: hinge.y + normal.y * opening.widthCm,
      };
      ctx.beginPath();
      ctx.moveTo(hinge.x, hinge.y);
      ctx.lineTo(openEnd.x, openEnd.y);
      ctx.stroke();
      const closedAngle = Math.atan2(tangent.y, tangent.x);
      const openAngle = Math.atan2(normal.y, normal.x);
      ctx.beginPath();
      ctx.arc(hinge.x, hinge.y, opening.widthCm, closedAngle, openAngle);
      ctx.stroke();
    });
  }

  drawFurniture(scene, viewport) {
    const { ctx } = this;
    objectValues(scene.furniture).forEach((item) => {
      if (!item.visible) return;
      const selected = scene.selectedIds.includes(item.id);
      const { w, d } = item.dimensionsCm;
      ctx.save();
      ctx.translate(item.position.x + w / 2, item.position.y + d / 2);
      ctx.rotate((item.rotationY || 0) * Math.PI / 180);
      ctx.fillStyle = selected ? 'rgba(217, 70, 239, 0.16)' : 'rgba(174, 145, 111, 0.28)';
      ctx.strokeStyle = selected ? SELECTION_COLOR : '#8a7460';
      ctx.lineWidth = (selected ? 2.5 : 1.4) / viewport.zoom;
      ctx.fillRect(-w / 2, -d / 2, w, d);
      ctx.strokeRect(-w / 2, -d / 2, w, d);
      ctx.beginPath();
      ctx.rect(-w / 2, -d / 2, w, d);
      ctx.clip();
      ctx.strokeStyle = selected ? 'rgba(217, 70, 239, .34)' : 'rgba(115, 94, 76, .2)';
      ctx.lineWidth = 1 / viewport.zoom;
      const hatchGap = 13 / viewport.zoom;
      for (let line = -w - d; line <= w + d; line += hatchGap) {
        ctx.beginPath();
        ctx.moveTo(line, -d);
        ctx.lineTo(line + d * 2, d);
        ctx.stroke();
      }
      ctx.restore();
      this.drawText(item.name, item.position.x + w / 2, item.position.y + d / 2 + 4 / viewport.zoom, 10, selected ? '#a21caf' : '#554638', viewport, 600);
      if (selected && !item.locked) {
        const center = { x: item.position.x + w / 2, y: item.position.y + d / 2 };
        const handle = furnitureRotationHandle(item, viewport.zoom);
        ctx.strokeStyle = SELECTION_COLOR;
        ctx.lineWidth = 1.2 / viewport.zoom;
        ctx.beginPath();
        ctx.moveTo(center.x, center.y);
        ctx.lineTo(handle.x, handle.y);
        ctx.stroke();
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(handle.x, handle.y, 7 / viewport.zoom, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = SELECTION_COLOR;
        ctx.lineWidth = 2 / viewport.zoom;
        ctx.stroke();
      }
    });
  }

  drawMeasurements(scene, viewport) {
    const { ctx } = this;
    objectValues(scene.measurements).forEach((measurement) => {
      if (measurement.visible === false) return;
      const selected = scene.selectedIds.includes(measurement.id);
      ctx.strokeStyle = selected ? SELECTION_COLOR : '#c27845';
      ctx.lineWidth = (selected ? 2 : 1.4) / viewport.zoom;
      ctx.setLineDash([7 / viewport.zoom, 5 / viewport.zoom]);
      ctx.beginPath();
      ctx.moveTo(measurement.start.x, measurement.start.y);
      ctx.lineTo(measurement.end.x, measurement.end.y);
      ctx.stroke();
      ctx.setLineDash([]);
      [measurement.start, measurement.end].forEach((point) => {
        ctx.beginPath();
        ctx.arc(point.x, point.y, 3.5 / viewport.zoom, 0, Math.PI * 2);
        ctx.fillStyle = selected ? SELECTION_COLOR : '#c27845';
        ctx.fill();
      });
      const center = midpoint(measurement.start, measurement.end);
      this.drawTag(measurement.label || formatLength(distance2D(measurement.start, measurement.end)), center.x, center.y - 15 / viewport.zoom, viewport);
    });
  }

  drawInteractionPreview(scene, transient, viewport) {
    const { ctx } = this;
    const start = scene.activeTool === 'drawWall' ? transient.wallStart : transient.measureStart;
    if (start && transient.cursorPoint) {
      const isWall = scene.activeTool === 'drawWall';
      ctx.strokeStyle = isWall ? 'rgba(217, 70, 239, .7)' : 'rgba(194, 120, 69, .8)';
      ctx.lineWidth = (isWall ? scene.settings.wallThicknessCm : 1.6 / viewport.zoom);
      ctx.setLineDash(isWall ? [14 / viewport.zoom, 8 / viewport.zoom] : [7 / viewport.zoom, 5 / viewport.zoom]);
      ctx.beginPath();
      ctx.moveTo(start.x, start.y);
      ctx.lineTo(transient.cursorPoint.x, transient.cursorPoint.y);
      ctx.stroke();
      ctx.setLineDash([]);
      const center = midpoint(start, transient.cursorPoint);
      this.drawTag(formatLength(distance2D(start, transient.cursorPoint)), center.x, center.y - 18 / viewport.zoom, viewport);
    }
    if (!transient.snapIndicator?.point) return;
    const { point, label } = transient.snapIndicator;
    ctx.strokeStyle = SELECTION_COLOR;
    ctx.lineWidth = 2 / viewport.zoom;
    ctx.beginPath();
    ctx.arc(point.x, point.y, 8 / viewport.zoom, 0, Math.PI * 2);
    ctx.stroke();
    this.drawText(label, point.x, point.y - 18 / viewport.zoom, 10, SELECTION_COLOR, viewport, 600);
  }

  drawText(text, x, y, pixelSize, fill, viewport, weight) {
    const { ctx } = this;
    ctx.save();
    ctx.font = `${weight} ${pixelSize / viewport.zoom}px ${FONT_STACK}`;
    ctx.fillStyle = fill;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, x, y);
    ctx.restore();
  }

  drawTag(text, x, y, viewport) {
    const { ctx } = this;
    ctx.save();
    ctx.font = `600 ${10 / viewport.zoom}px ${FONT_STACK}`;
    const width = ctx.measureText(text).width + 12 / viewport.zoom;
    const height = 18 / viewport.zoom;
    ctx.fillStyle = 'rgba(255, 253, 250, .92)';
    ctx.fillRect(x - width / 2, y - height / 2, width, height);
    ctx.fillStyle = '#6b5e52';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, x, y);
    ctx.restore();
  }

  drawRulers(viewport, width, height) {
    const { ctx } = this;
    ctx.fillStyle = 'rgba(255, 253, 250, .94)';
    ctx.fillRect(0, 0, width, RULER_SIZE);
    ctx.fillRect(0, 0, RULER_SIZE, height);
    ctx.strokeStyle = '#ded4c6';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, RULER_SIZE);
    ctx.lineTo(width, RULER_SIZE);
    ctx.moveTo(RULER_SIZE, 0);
    ctx.lineTo(RULER_SIZE, height);
    ctx.stroke();
    ctx.fillStyle = '#837568';
    ctx.font = `10px ${FONT_STACK}`;
    ctx.textBaseline = 'middle';
    const step = viewport.zoom < 0.38 ? 200 : 100;
    const startX = Math.floor(((RULER_SIZE - viewport.pan.x) / viewport.zoom) / step) * step;
    const endX = (width - viewport.pan.x) / viewport.zoom;
    for (let worldX = startX; worldX <= endX; worldX += step) {
      const x = viewport.pan.x + worldX * viewport.zoom;
      if (x < RULER_SIZE) continue;
      ctx.beginPath();
      ctx.moveTo(x, RULER_SIZE);
      ctx.lineTo(x, RULER_SIZE - 8);
      ctx.stroke();
      ctx.textAlign = 'center';
      ctx.fillText(`${worldX}`, x, 12);
    }
    const startY = Math.floor(((RULER_SIZE - viewport.pan.y) / viewport.zoom) / step) * step;
    const endY = (height - viewport.pan.y) / viewport.zoom;
    for (let worldY = startY; worldY <= endY; worldY += step) {
      const y = viewport.pan.y + worldY * viewport.zoom;
      if (y < RULER_SIZE) continue;
      ctx.beginPath();
      ctx.moveTo(RULER_SIZE, y);
      ctx.lineTo(RULER_SIZE - 8, y);
      ctx.stroke();
      ctx.save();
      ctx.translate(12, y);
      ctx.rotate(-Math.PI / 2);
      ctx.textAlign = 'center';
      ctx.fillText(`${worldY}`, 0, 0);
      ctx.restore();
    }
    ctx.fillStyle = '#f4ede4';
    ctx.fillRect(0, 0, RULER_SIZE, RULER_SIZE);
  }

  drawMinimap(scene, viewport, width, height) {
    const { ctx } = this;
    const bounds = getSceneBounds(scene);
    const x = width - MINIMAP.width - MINIMAP.margin;
    const y = height - MINIMAP.height - MINIMAP.margin;
    const inner = { x: x + 12, y: y + 27, width: MINIMAP.width - 24, height: MINIMAP.height - 39 };
    const sceneWidth = Math.max(bounds.maxX - bounds.minX, 1);
    const sceneHeight = Math.max(bounds.maxY - bounds.minY, 1);
    const scale = Math.min(inner.width / sceneWidth, inner.height / sceneHeight);
    const mapPoint = (point) => ({
      x: inner.x + (point.x - bounds.minX) * scale,
      y: inner.y + (point.y - bounds.minY) * scale,
    });
    ctx.fillStyle = 'rgba(29, 26, 28, .9)';
    ctx.beginPath();
    ctx.roundRect(x, y, MINIMAP.width, MINIMAP.height, 13);
    ctx.fill();
    ctx.fillStyle = '#d4c6b6';
    ctx.font = `600 10px ${FONT_STACK}`;
    ctx.textAlign = 'left';
    ctx.fillText('MINIMAP', x + 12, y + 16);
    objectValues(scene.rooms).forEach((room) => {
      if (!room.visible || !room.polygon?.length) return;
      ctx.beginPath();
      room.polygon.map(mapPoint).forEach((point, index) => {
        if (index === 0) ctx.moveTo(point.x, point.y);
        else ctx.lineTo(point.x, point.y);
      });
      ctx.closePath();
      ctx.fillStyle = '#b5a181';
      ctx.fill();
    });
    objectValues(scene.walls).forEach((wall) => {
      const start = mapPoint(wall.start);
      const end = mapPoint(wall.end);
      ctx.strokeStyle = '#4b4140';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(start.x, start.y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();
    });
    const visible = this.visibleWorldBounds(viewport, width, height);
    const viewportStart = mapPoint({ x: visible.left, y: visible.top });
    const viewportEnd = mapPoint({ x: visible.right, y: visible.bottom });
    ctx.strokeStyle = SELECTION_COLOR;
    ctx.lineWidth = 1.5;
    ctx.strokeRect(
      viewportStart.x,
      viewportStart.y,
      viewportEnd.x - viewportStart.x,
      viewportEnd.y - viewportStart.y,
    );
  }
}
