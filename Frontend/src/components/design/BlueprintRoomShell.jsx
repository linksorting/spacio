/* eslint-disable react/no-unknown-property */
import { useMemo, useState, Suspense } from 'react';
import { useTexture } from '@react-three/drei';
import { getWallHitFromEdge, getOpeningSpan, getOpeningsForWall, getWallId, wallIdsMatch } from '@/lib/wallOpenings';
import {
  BufferAttribute,
  BufferGeometry,
  DoubleSide,
  RepeatWrapping,
  Shape,
  ShapeGeometry,
} from 'three';

function isValidPoint(point) {
  return point && Number.isFinite(point.x) && Number.isFinite(point.z);
}

function buildRoomShapeGeometry(corners = []) {
  const valid = corners.filter(isValidPoint);
  if (valid.length < 3) return null;

  const shape = new Shape();
  valid.forEach((corner, index) => {
    if (index === 0) shape.moveTo(corner.x, corner.z);
    else shape.lineTo(corner.x, corner.z);
  });
  shape.closePath();
  return new ShapeGeometry(shape);
}

function floorShapeScale(textureScale, stretch) {
  if (stretch || !textureScale) return 1;
  return Math.max(textureScale / 100, 0.01);
}

function cornerKey(corners = []) {
  return corners.filter(isValidPoint).map((corner) => `${corner.x.toFixed(4)},${corner.z.toFixed(4)}`).join('|');
}

function sliceFootprint(footprint, t0, t1) {
  if (!footprint || footprint.length < 4) return footprint;
  const lerp = (from, to, t) => ({
    x: from.x + ((to.x - from.x) * t),
    z: from.z + ((to.z - from.z) * t),
  });
  return [
    lerp(footprint[0], footprint[3], t0),
    lerp(footprint[1], footprint[2], t0),
    lerp(footprint[1], footprint[2], t1),
    lerp(footprint[0], footprint[3], t1),
  ];
}

function interiorEdgeLengthCm(footprint) {
  if (!footprint?.[0] || !footprint?.[1]) return 300;
  return Math.hypot(
    (footprint[1].x - footprint[0].x) * 100,
    (footprint[1].z - footprint[0].z) * 100,
  );
}

function resolveWallOpenings(wall, wallOpenings = []) {
  if (!wallOpenings.length) return wall.openings ?? [];
  if (wall.sourceEdge?.wall) return getOpeningsForWall(wall.sourceEdge.wall, wallOpenings);
  if (wall.wallId) {
    return wallOpenings.filter((opening) => wallIdsMatch(opening.wallId, wall.wallId));
  }
  return [];
}

function resolvePhysicalOpenings(physicalWall, wallOpenings = [], floorplanWalls = []) {
  if (!wallOpenings.length) return physicalWall.openings ?? [];

  const matchedWall = floorplanWalls.find((wall) => wallIdsMatch(getWallId(wall), physicalWall.wallId));
  if (matchedWall) return getOpeningsForWall(matchedWall, wallOpenings);

  if (physicalWall.wallStartCm && physicalWall.wallEndCm) {
    const endpointWall = floorplanWalls.find((wall) => {
      const startX = wall.getStartX?.() ?? 0;
      const startZ = wall.getStartY?.() ?? 0;
      const endX = wall.getEndX?.() ?? 0;
      const endZ = wall.getEndY?.() ?? 0;
      const tol = 2;
      const matchForward = Math.hypot(startX - physicalWall.wallStartCm.x, startZ - physicalWall.wallStartCm.z) < tol
        && Math.hypot(endX - physicalWall.wallEndCm.x, endZ - physicalWall.wallEndCm.z) < tol;
      const matchReverse = Math.hypot(startX - physicalWall.wallEndCm.x, startZ - physicalWall.wallEndCm.z) < tol
        && Math.hypot(endX - physicalWall.wallStartCm.x, endZ - physicalWall.wallStartCm.z) < tol;
      return matchForward || matchReverse;
    });
    if (endpointWall) return getOpeningsForWall(endpointWall, wallOpenings);
  }

  if (physicalWall.wallId) {
    return wallOpenings.filter((opening) => wallIdsMatch(opening.wallId, physicalWall.wallId));
  }
  return [];
}

function buildPhysicalWallParts(physicalWall, wallOpenings = [], floorplanWalls = []) {
  const { footprint, height } = physicalWall;
  if (!footprint?.length) return [];

  const openings = resolvePhysicalOpenings(physicalWall, wallOpenings, floorplanWalls);
  if (!openings.length) {
    return [{ footprint, height, y: 0 }];
  }

  const wallLenCm = interiorEdgeLengthCm(footprint);
  const sorted = [...openings].sort((a, b) => a.offsetAlongWall - b.offsetAlongWall);
  const parts = [];
  let cursor = 0;

  const pushSolid = (t0, t1) => {
    if (t1 - t0 < 0.01) return;
    parts.push({
      footprint: sliceFootprint(footprint, t0, t1),
      height,
      y: 0,
    });
  };

  sorted.forEach((opening) => {
    const { t0, t1 } = getOpeningSpan(opening, wallLenCm);
    pushSolid(cursor, t0);

    if (opening.type === 'window') {
      const seg = sliceFootprint(footprint, t0, t1);
      const sillH = Math.max(0, opening.elevationCm) / 100;
      const openingH = opening.heightCm / 100;
      if (sillH > 0.02) {
        parts.push({ footprint: seg, height: sillH, y: 0 });
      }
      const topH = height - sillH - openingH;
      if (topH > 0.02) {
        parts.push({ footprint: seg, height: topH, y: sillH + openingH });
      }
    }

    cursor = Math.max(cursor, t1);
  });

  pushSolid(cursor, 1);
  return parts.length ? parts : [{ footprint, height, y: 0 }];
}

function buildPartGeometry(part) {
  if ((part.footprint?.length ?? 0) < 4 || part.height <= 0) return null;
  if (!part.footprint.every(isValidPoint)) return null;

  const positions = [];
  const indices = [];
  const base = 0;
  part.footprint.forEach((point) => positions.push(point.x, part.y ?? 0, point.z));
  part.footprint.forEach((point) => positions.push(point.x, (part.y ?? 0) + part.height, point.z));

  const bottom = base;
  const top = base + 4;
  indices.push(bottom + 0, bottom + 2, bottom + 1, bottom + 0, bottom + 3, bottom + 2);
  indices.push(top + 0, top + 1, top + 2, top + 0, top + 2, top + 3);
  const sides = [
    [bottom + 0, bottom + 1, top + 1, top + 0],
    [bottom + 1, bottom + 2, top + 2, top + 1],
    [bottom + 2, bottom + 3, top + 3, top + 2],
    [bottom + 3, bottom + 0, top + 0, top + 3],
  ];
  sides.forEach(([a, b, c, d]) => {
    indices.push(a, b, c, a, c, d);
  });

  const geo = new BufferGeometry();
  geo.setAttribute('position', new BufferAttribute(new Float32Array(positions), 3));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  return geo;
}

function PhysicalWallPart({ part, index }) {
  const geometry = useMemo(() => buildPartGeometry(part), [part]);
  if (!geometry) return null;

  return (
    <mesh geometry={geometry} castShadow receiveShadow>
      <meshStandardMaterial color="#c8c8c8" roughness={0.95} metalness={0.02} />
    </mesh>
  );
}

function PhysicalWallSegments({ physicalWalls = [], wallOpenings = [], floorplanWalls = [] }) {
  const parts = useMemo(
    () => physicalWalls.flatMap((wall) => buildPhysicalWallParts(wall, wallOpenings, floorplanWalls)),
    [physicalWalls, wallOpenings, floorplanWalls],
  );

  if (!parts.length) return null;

  return (
    <group>
      {parts.map((part, index) => (
        <PhysicalWallPart key={`${index}-${part.y}-${part.height}-${part.footprint?.[0]?.x ?? 0}`} part={part} index={index} />
      ))}
    </group>
  );
}

function TexturedRoomFloor({ room, selected = false, onFloorClick }) {
  const texture = useTexture(room.textureUrl);
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;
  texture.repeat.set(1, 1);

  const scaleM = floorShapeScale(room.textureScale, room.textureStretch);
  const geometry = useMemo(
    () => buildRoomShapeGeometry(
      room.corners.map((corner) => ({
        x: corner.x / scaleM,
        z: corner.z / scaleM,
      })),
    ),
    [room.corners, scaleM],
  );

  if (!geometry) return null;

  return (
    <mesh
      rotation={[Math.PI / 2, 0, 0]}
      scale={[scaleM, scaleM, scaleM]}
      position={[0, 0.001, 0]}
      geometry={geometry}
      receiveShadow
      onClick={(event) => {
        if (!room.sourceRoom || !onFloorClick) return;
        event.stopPropagation();
        onFloorClick(room.sourceRoom);
      }}
    >
      <meshStandardMaterial
        map={texture}
        roughness={0.92}
        metalness={0.02}
        side={DoubleSide}
        emissive={selected ? '#4f46e5' : '#000000'}
        emissiveIntensity={selected ? 0.12 : 0}
      />
    </mesh>
  );
}

function RoomCeiling({ room, textureUrl, textureScale = 200 }) {
  const geometry = useMemo(
    () => buildRoomShapeGeometry(room.corners),
    [room.corners],
  );

  const ceilingY = room.ceilingHeight ?? 2.7;
  if (!geometry) return null;

  return (
    <group>
      <mesh
        geometry={geometry}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, ceilingY - 0.001, 0]}
        scale={[1, -1, 1]}
        receiveShadow
      >
        <meshStandardMaterial
          color="#ececec"
          roughness={0.92}
          metalness={0}
          side={DoubleSide}
        />
      </mesh>
      <Suspense fallback={null}>
        <RoomCeilingTexture
          geometry={geometry}
          ceilingY={ceilingY}
          textureUrl={textureUrl}
          textureScale={textureScale}
          room={room}
        />
      </Suspense>
    </group>
  );
}

function RoomCeilingTexture({ geometry, ceilingY, textureUrl, textureScale, room }) {
  const texture = useTexture(textureUrl);
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;

  const bounds = useMemo(() => {
    const xs = room.corners.map((c) => c.x).filter(Number.isFinite);
    const zs = room.corners.map((c) => c.z).filter(Number.isFinite);
    if (!xs.length || !zs.length) return { width: 1, depth: 1 };
    return {
      width: Math.max(...xs) - Math.min(...xs),
      depth: Math.max(...zs) - Math.min(...zs),
    };
  }, [room.corners]);

  const repeatScale = Math.max(textureScale / 100, 0.01);
  texture.repeat.set(
    bounds.width / repeatScale,
    bounds.depth / repeatScale,
  );

  return (
    <mesh
      geometry={geometry}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, ceilingY - 0.0005, 0]}
      scale={[1, -1, 1]}
      receiveShadow
    >
      <meshStandardMaterial
        map={texture}
        color="#fafafa"
        roughness={0.92}
        metalness={0}
        side={DoubleSide}
        polygonOffset
        polygonOffsetFactor={-1}
        polygonOffsetUnits={-1}
      />
    </mesh>
  );
}

function CeilingFixtures({ fixtures = [] }) {
  return (
    <group>
      {fixtures.map((fixture, index) => {
        const position = [(fixture.x ?? 0) / 100, (fixture.y ?? 258) / 100, (fixture.z ?? 0) / 100];
        const id = fixture.id ?? `${fixture.type ?? 'pendant'}-${index}`;
        const glow = fixture.color ?? '#f5e8d0';

        if (fixture.type === 'fan') {
          return (
            <group key={id} position={position}>
              <mesh>
                <cylinderGeometry args={[0.04, 0.04, 0.2, 16]} />
                <meshStandardMaterial color="#433d37" roughness={0.55} />
              </mesh>
              {[0, Math.PI / 2].map((rotation) => (
                <mesh key={rotation} rotation={[0, rotation, 0]} position={[0, -0.13, 0]}>
                  <boxGeometry args={[1.12, 0.025, 0.13]} />
                  <meshStandardMaterial color="#72563d" roughness={0.7} />
                </mesh>
              ))}
            </group>
          );
        }

        if (fixture.type === 'spot') {
          return (
            <group key={id} position={position}>
              <mesh rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.085, 0.085, 0.025, 24]} />
                <meshStandardMaterial color="#f4f4f4" roughness={0.36} />
              </mesh>
              <pointLight position={[0, -0.14, 0]} intensity={0.15} distance={2.4} color={glow} />
            </group>
          );
        }

        return (
          <group key={id} position={position}>
            <mesh position={[0, 0.08, 0]}>
              <cylinderGeometry args={[0.012, 0.012, 0.34, 10]} />
              <meshStandardMaterial color="#282522" roughness={0.44} />
            </mesh>
            <mesh position={[0, -0.14, 0]}>
              <sphereGeometry args={[0.16, 24, 18]} />
              <meshStandardMaterial color={glow} emissive={glow} emissiveIntensity={0.18} roughness={0.3} />
            </mesh>
            <pointLight position={[0, -0.22, 0]} intensity={0.3} distance={3.2} color={glow} />
          </group>
        );
      })}
    </group>
  );
}

function buildInteriorWallPanels(i0, i1, height, openings = [], wallLenCm = 300) {
  if (!openings.length) {
    return [{ i0, i1, y: 0, h: height }];
  }

  const panels = [];
  let cursor = 0;
  const sorted = [...openings].sort((a, b) => a.offsetAlongWall - b.offsetAlongWall);

  const lerp = (t) => ({
    x: i0.x + ((i1.x - i0.x) * t),
    z: i0.z + ((i1.z - i0.z) * t),
  });

  const pushPanel = (t0, t1, y, h) => {
    if (t1 - t0 < 0.005 || h < 0.02) return;
    panels.push({ i0: lerp(t0), i1: lerp(t1), y, h });
  };

  sorted.forEach((opening) => {
    const { t0, t1 } = getOpeningSpan(opening, wallLenCm);
    pushPanel(cursor, t0, 0, height);

    if (opening.type === 'window') {
      const sill = Math.max(0, opening.elevationCm) / 100;
      const openH = opening.heightCm / 100;
      if (sill > 0.02) pushPanel(t0, t1, 0, sill);
      const topH = height - sill - openH;
      if (topH > 0.02) pushPanel(t0, t1, sill + openH, topH);
    }

    cursor = Math.max(cursor, t1);
  });

  pushPanel(cursor, 1, 0, height);
  return panels.length ? panels : [{ i0, i1, y: 0, h: height }];
}

function WallPanelMesh({
  panel,
  texture,
  selected,
  onPointerDown,
  onPointerMove,
}) {
  const { i0, i1, y, h } = panel;
  const geometry = useMemo(() => {
    if (!isValidPoint(i0) || !isValidPoint(i1) || !Number.isFinite(y) || !Number.isFinite(h) || h <= 0) {
      return null;
    }
    const geo = new BufferGeometry();
    geo.setAttribute(
      'position',
      new BufferAttribute(new Float32Array([
        i0.x, y, i0.z,
        i1.x, y, i1.z,
        i1.x, y + h, i1.z,
        i0.x, y + h, i0.z,
      ]), 3),
    );
    geo.setIndex([0, 1, 2, 0, 2, 3]);
    geo.computeVertexNormals();
    return geo;
  }, [i0.x, i0.z, i1.x, i1.z, y, h]);

  if (!geometry) return null;

  return (
    <mesh
      geometry={geometry}
      castShadow
      receiveShadow
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
    >
      <meshStandardMaterial
        map={texture}
        roughness={0.9}
        metalness={0.02}
        side={DoubleSide}
        polygonOffset
        polygonOffsetFactor={-1}
        polygonOffsetUnits={-1}
        emissive={selected ? '#111133' : '#000000'}
        emissiveIntensity={selected ? 0.35 : 0}
      />
    </mesh>
  );
}

function OpeningPlacementGhost({ hit, config }) {
  if (!hit || !config) return null;
  const color = config.type === 'doorway'
    ? '#10b981'
    : config.type === 'window'
      ? '#3b82f6'
      : '#6366f1';

  return (
    <mesh
      position={[
        hit.worldPos.x,
        ((config.elevCm ?? 0) + config.heightCm / 2) / 100,
        hit.worldPos.z,
      ]}
      rotation={[0, hit.angle, 0]}
    >
      <boxGeometry args={[config.widthCm / 100, config.heightCm / 100, 0.08]} />
      <meshBasicMaterial color={color} transparent opacity={0.45} depthTest={false} />
    </mesh>
  );
}

function WallOpeningInsert({ wall, opening }) {
  const footprint = wall.footprint ?? [];
  const i0 = footprint[0];
  const i1 = footprint[1];
  if (!isValidPoint(i0) || !isValidPoint(i1) || !opening) return null;

  const offset = Math.max(0, Math.min(1, opening.offsetAlongWall ?? 0.5));
  const width = (opening.widthCm ?? 90) / 100;
  const height = (opening.heightCm ?? 210) / 100;
  const elevation = (opening.elevationCm ?? 0) / 100;
  const angle = Math.atan2(i1.z - i0.z, i1.x - i0.x);
  const position = [
    i0.x + ((i1.x - i0.x) * offset),
    elevation,
    i0.z + ((i1.z - i0.z) * offset),
  ];
  const frame = 0.055;
  const depth = 0.11;

  return (
    <group position={position} rotation={[0, -angle, 0]}>
      <mesh position={[-width / 2, height / 2, 0]}>
        <boxGeometry args={[frame, height + frame, depth]} />
        <meshStandardMaterial color="#f2ede5" roughness={0.58} />
      </mesh>
      <mesh position={[width / 2, height / 2, 0]}>
        <boxGeometry args={[frame, height + frame, depth]} />
        <meshStandardMaterial color="#f2ede5" roughness={0.58} />
      </mesh>
      <mesh position={[0, height, 0]}>
        <boxGeometry args={[width + frame, frame, depth]} />
        <meshStandardMaterial color="#f2ede5" roughness={0.58} />
      </mesh>

      {opening.type === 'door' ? (
        <>
          <mesh position={[0, height / 2, 0.012]} castShadow receiveShadow>
            <boxGeometry args={[Math.max(0.04, width - frame * 1.4), Math.max(0.04, height - frame), 0.045]} />
            <meshStandardMaterial color="#b7865a" roughness={0.58} />
          </mesh>
          <mesh position={[width * 0.31, height * 0.47, 0.045]}>
            <sphereGeometry args={[0.028, 12, 10]} />
            <meshStandardMaterial color="#c49a55" metalness={0.7} roughness={0.26} />
          </mesh>
        </>
      ) : null}

      {opening.type === 'window' ? (
        <>
          <mesh position={[0, height / 2, 0.012]}>
            <boxGeometry args={[Math.max(0.04, width - frame * 1.4), Math.max(0.04, height - frame * 1.4), 0.012]} />
            <meshPhysicalMaterial color="#c8ecfb" transmission={0.5} transparent opacity={0.48} roughness={0.18} />
          </mesh>
          <mesh position={[0, height / 2, 0.035]}>
            <boxGeometry args={[frame * 0.72, Math.max(0.04, height - frame), 0.03]} />
            <meshStandardMaterial color="#f2ede5" roughness={0.58} />
          </mesh>
          <mesh position={[0, height / 2, 0.035]}>
            <boxGeometry args={[Math.max(0.04, width - frame), frame * 0.72, 0.03]} />
            <meshStandardMaterial color="#f2ede5" roughness={0.58} />
          </mesh>
        </>
      ) : null}
    </group>
  );
}

function RoomWallInteriorFace({
  wall,
  wallOpenings = [],
  selected = false,
  onWallClick,
  placementMode = null,
  onPlacementHover = null,
  onPlacementClick,
}) {
  const texture = useTexture(wall.textureUrl);
  const footprint = wall.footprint ?? [];
  const i0 = footprint[0];
  const i1 = footprint[1];
  const height = wall.height;
  const [hoverHit, setHoverHit] = useState(null);
  const openings = resolveWallOpenings(wall, wallOpenings);
  const validWall = isValidPoint(i0) && isValidPoint(i1) && Number.isFinite(height) && height > 0;
  const wallLenCm = validWall ? interiorEdgeLengthCm(footprint) : 0;

  const panels = useMemo(
    () => (validWall ? buildInteriorWallPanels(i0, i1, height, openings, wallLenCm) : []),
    [validWall, i0, i1, height, openings, wallLenCm],
  );

  if (!validWall) return null;

  if (!wall.textureStretch && wall.textureScale > 0) {
    texture.wrapS = RepeatWrapping;
    texture.wrapT = RepeatWrapping;
    texture.repeat.set(
      (wallLenCm / 100) / (wall.textureScale / 100),
      height / (wall.textureScale / 100),
    );
  }

  const handlePointer = (event, isDown) => {
    if (!wall.sourceEdge) return;
    event.stopPropagation();
    const hit = getWallHitFromEdge(wall.sourceEdge, event.point.x, event.point.z);
    if (!hit) return;

    if (placementMode) {
      const payload = { ...hit, config: placementMode };
      if (isDown) onPlacementClick?.(payload);
      else {
        setHoverHit(payload);
        onPlacementHover?.(payload);
      }
      return;
    }

    if (isDown && onWallClick) onWallClick(wall.sourceEdge);
  };

  return (
    <group
      onPointerOut={() => {
        setHoverHit(null);
        onPlacementHover?.(null);
      }}
    >
      {panels.map((panel, index) => (
        <WallPanelMesh
          key={`${index}-${panel.y}-${panel.h}-${panel.i0.x}`}
          panel={panel}
          texture={texture}
          selected={selected && !placementMode}
          onPointerDown={(event) => handlePointer(event, true)}
          onPointerMove={(event) => {
            if (placementMode) handlePointer(event, false);
          }}
        />
      ))}
      {openings.map((opening) => (
        <WallOpeningInsert key={opening.id} wall={wall} opening={opening} />
      ))}
      {placementMode ? <OpeningPlacementGhost hit={hoverHit} config={placementMode} /> : null}
    </group>
  );
}

export default function BlueprintRoomShell({
  shell,
  wallOpenings = [],
  floorplanWalls = [],
  selectedFloorRoom = null,
  selectedWallEdge = null,
  onFloorClick,
  onWallClick,
  showCeiling = true,
  ceilingTextureUrl = '/rooms/textures/wallmap.png',
  ceilingTextureScale = 200,
  ceilingFixtures = [],
  wallPlacementMode = null,
  onWallPlacementClick,
}) {
  if (!shell) return null;

  return (
    <group>
      {showCeiling ? shell.rooms.map((room, index) => (
        <RoomCeiling
          key={`ceiling-${index}-${cornerKey(room.corners)}-${ceilingTextureUrl}`}
          room={room}
          textureUrl={ceilingTextureUrl}
          textureScale={ceilingTextureScale}
        />
      )) : null}
      {showCeiling ? <CeilingFixtures fixtures={ceilingFixtures} /> : null}
      {shell.rooms.map((room, index) => (
        <TexturedRoomFloor
          key={`floor-${index}-${cornerKey(room.corners)}-${room.textureUrl}`}
          room={room}
          selected={selectedFloorRoom === room.sourceRoom}
          onFloorClick={onFloorClick}
        />
      ))}
      {shell.walls.map((wall, index) => (
        <RoomWallInteriorFace
          key={`wall-${index}-${cornerKey(wall.footprint)}-${wall.textureUrl}-${resolveWallOpenings(wall, wallOpenings).length}`}
          wall={wall}
          wallOpenings={wallOpenings}
          selected={selectedWallEdge === wall.sourceEdge}
          onWallClick={wallPlacementMode ? null : onWallClick}
          placementMode={wallPlacementMode}
          onPlacementClick={onWallPlacementClick}
        />
      ))}
    </group>
  );
}
