import { wallIdsMatch } from './wallOpenings';

// Draw wall openings on the 2D floorplan overlay.
export function drawWallOpenings(ctx, floorplanner, toX, toY, openings, floorplan, selectedOpeningId = null) {
  const walls = floorplan?.getWalls?.() ?? [];
  const scale = (floorplanner.pixelsPerCm
    ?? floorplanner.viewmodel?.pixelsPerCm
    ?? Math.abs(toX(1) - toX(0))) || 0.5;

  openings.forEach((opening) => {
    const wall = walls.find((entry) => wallIdsMatch(`${entry.getStart?.().id}${entry.getEnd?.().id}`, opening.wallId));
    if (!wall) return;

    const startX = wall.getStartX?.() ?? 0;
    const startY = wall.getStartY?.() ?? 0;
    const endX = wall.getEndX?.() ?? 0;
    const endY = wall.getEndY?.() ?? 0;
    const dx = endX - startX;
    const dy = endY - startY;
    const len = Math.hypot(dx, dy);
    if (!len) return;

    const cx = startX + (dx * opening.offsetAlongWall);
    const cy = startY + (dy * opening.offsetAlongWall);
    const angle = Math.atan2(dy, dx);
    const pw = opening.widthCm * scale;
    const pd = Math.max(8, scale * 12);
    const isSelected = opening.id === selectedOpeningId;

    ctx.save();
    ctx.translate(toX(cx), toY(cy));
    ctx.rotate(angle);

    const isDoorway = opening.type === 'doorway';
    const isWindow = opening.type === 'window';
    const isDoor = opening.type === 'door';

    if (isSelected) {
      ctx.fillStyle = 'rgba(99, 102, 241, 0.18)';
      ctx.fillRect(-pw / 2, -pd / 2 - 3, pw, pd + 6);
    }

    if (isDoorway) {
      ctx.clearRect(-pw / 2, -pd / 2 - 3, pw, pd + 6);
      ctx.strokeStyle = isSelected ? '#6366f1' : '#4a4a8a';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-pw / 2, pd / 2 + 4);
      ctx.lineTo(-pw / 2, -pd / 2 - 4);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(pw / 2, pd / 2 + 4);
      ctx.lineTo(pw / 2, -pd / 2 - 4);
      ctx.stroke();
      ctx.beginPath();
      ctx.setLineDash([4, 4]);
      ctx.moveTo(-pw / 2, 0);
      ctx.lineTo(pw / 2, 0);
      ctx.strokeStyle = 'rgba(16,185,129,0.65)';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.setLineDash([]);
    } else if (isWindow) {
      ctx.strokeStyle = isSelected ? '#6366f1' : '#3b82f6';
      ctx.lineWidth = 2;
      ctx.strokeRect(-pw / 2, -pd / 2, pw, pd);
      ctx.beginPath();
      ctx.moveTo(-pw / 2, 0);
      ctx.lineTo(pw / 2, 0);
      ctx.stroke();
    } else if (isDoor) {
      ctx.clearRect(-pw / 2, -pd / 2 - 2, pw, pd + 4);
      ctx.strokeStyle = isSelected ? '#6366f1' : '#b06e49';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-pw / 2, pd / 2);
      ctx.lineTo(-pw / 2, -pd / 2);
      ctx.lineTo(pw / 2, -pd / 2);
      ctx.stroke();

      const hingeX = opening.swingDir === 'right' ? pw / 2 : -pw / 2;
      const closedAngle = opening.swingDir === 'right' ? Math.PI : 0;
      const openAngle = opening.swingDir === 'right' ? Math.PI * 0.5 : -Math.PI * 0.5;
      ctx.beginPath();
      ctx.arc(hingeX, -pd / 2, pw, closedAngle, openAngle);
      ctx.strokeStyle = 'rgba(176, 110, 73, 0.55)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    ctx.restore();
  });
}
