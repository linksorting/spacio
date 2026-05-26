/* eslint-disable react/no-unknown-property */
import { useMemo } from 'react';
import { useTexture } from '@react-three/drei';
import {
  BufferAttribute,
  BufferGeometry,
  DoubleSide,
  RepeatWrapping,
  Shape,
  ShapeGeometry,
} from 'three';

function cornerKey(corners = []) {
  return corners.map((corner) => `${corner.x.toFixed(4)},${corner.z.toFixed(4)}`).join('|');
}

function addFootprintPrism(positions, indices, footprint, height) {
  const base = positions.length / 3;
  footprint.forEach((point) => positions.push(point.x, 0, point.z));
  footprint.forEach((point) => positions.push(point.x, height, point.z));

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
}

/**
 * Solid wall bodies from Blueprint3D half-edge footprints — miters meet at corners.
 * @param {{ physicalWalls: Array<{ footprint: Array<{ x: number, z: number }>, height: number }> }} props
 */
function MergedPhysicalWalls({ physicalWalls = [] }) {
  const geometry = useMemo(() => {
    const positions = [];
    const indices = [];

    physicalWalls.forEach((wall) => {
      if ((wall.footprint?.length ?? 0) < 4 || wall.height <= 0) return;
      addFootprintPrism(positions, indices, wall.footprint, wall.height);
    });

    const geo = new BufferGeometry();
    geo.setAttribute('position', new BufferAttribute(new Float32Array(positions), 3));
    geo.setIndex(indices);
    geo.computeVertexNormals();
    return geo;
  }, [physicalWalls]);

  if (!physicalWalls.length) return null;

  return (
    <mesh geometry={geometry} castShadow receiveShadow>
      <meshStandardMaterial color="#dddddd" roughness={0.95} metalness={0.02} />
    </mesh>
  );
}

function TexturedRoomFloor({ room, selected = false, onFloorClick }) {
  const texture = useTexture(room.textureUrl);
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;
  texture.repeat.set(1, 1);

  const scaleM = (room.textureScale ?? 400) / 100;

  const geometry = useMemo(() => {
    const shape = new Shape();
    room.corners.forEach((corner, index) => {
      const sx = corner.x / scaleM;
      const sy = corner.z / scaleM;
      if (index === 0) shape.moveTo(sx, sy);
      else shape.lineTo(sx, sy);
    });
    shape.closePath();
    return new ShapeGeometry(shape);
  }, [room.corners, scaleM]);

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

function RoomWallInteriorFace({ wall, selected = false, onWallClick }) {
  const texture = useTexture(wall.textureUrl);
  const [i0, i1] = wall.footprint;
  const height = wall.height;
  const length = Math.hypot(i1.x - i0.x, i1.z - i0.z);

  const geometry = useMemo(() => {
    const interior = new BufferGeometry();
    interior.setAttribute(
      'position',
      new BufferAttribute(new Float32Array([
        i0.x, 0, i0.z,
        i1.x, 0, i1.z,
        i1.x, height, i1.z,
        i0.x, height, i0.z,
      ]), 3),
    );
    interior.setIndex([0, 1, 2, 0, 2, 3]);
    interior.computeVertexNormals();
    return interior;
  }, [i0.x, i0.z, i1.x, i1.z, height]);

  if (!wall.textureStretch && wall.textureScale > 0) {
    texture.wrapS = RepeatWrapping;
    texture.wrapT = RepeatWrapping;
    texture.repeat.set(
      length / (wall.textureScale / 100),
      height / (wall.textureScale / 100),
    );
  }

  return (
    <mesh
      geometry={geometry}
      castShadow
      receiveShadow
      onClick={(event) => {
        if (!wall.sourceEdge || !onWallClick) return;
        event.stopPropagation();
        onWallClick(wall.sourceEdge);
      }}
    >
      <meshStandardMaterial
        map={texture}
        roughness={0.9}
        metalness={0.02}
        side={DoubleSide}
        polygonOffset
        polygonOffsetFactor={-1}
        polygonOffsetUnits={-1}
        emissive={selected ? '#4f46e5' : '#000000'}
        emissiveIntensity={selected ? 0.12 : 0}
      />
    </mesh>
  );
}

export default function BlueprintRoomShell({
  shell,
  selectedFloorRoom = null,
  selectedWallEdge = null,
  onFloorClick,
  onWallClick,
}) {
  if (!shell) return null;

  return (
    <group>
      <MergedPhysicalWalls physicalWalls={shell.physicalWalls} />
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
          key={`wall-${index}-${cornerKey(wall.footprint)}-${wall.textureUrl}`}
          wall={wall}
          selected={selectedWallEdge === wall.sourceEdge}
          onWallClick={onWallClick}
        />
      ))}
    </group>
  );
}
