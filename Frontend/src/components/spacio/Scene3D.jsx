/* eslint-disable react/no-unknown-property */
import React, { memo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Box, Environment, OrbitControls, PerspectiveCamera, PointerLockControls, Text } from '@react-three/drei';
import * as THREE from 'three';
import { useSceneStore } from '@/store/useSceneStore';
import { CM_TO_WORLD, distance2D, wallTransform } from '@/utils/spacioGeometry';
import { getSpacioProduct } from '@/data/spacioCatalog';
import { DetailedFurnitureModel } from '@/components/spacio/furnitureModels';

const materialProps = (definition) => ({
  color: definition?.color || '#e7e0d6',
  roughness: definition?.roughness ?? 0.7,
  metalness: definition?.metalness ?? 0,
  transparent: definition?.transparent || false,
  opacity: definition?.opacity ?? 1,
});

function RoomSurfaces({ scene }) {
  return Object.values(scene.rooms).filter((room) => room.visible).map((room) => {
    const shape = new THREE.Shape();
    room.polygon.forEach((point, index) => {
      const x = point.x * CM_TO_WORLD;
      const y = point.y * CM_TO_WORLD;
      if (index === 0) shape.moveTo(x, y); else shape.lineTo(x, y);
    });
    shape.closePath();
    return (
      <group key={room.id}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <shapeGeometry args={[shape]} />
          <meshStandardMaterial {...materialProps(scene.materials[room.floorMaterialId])} />
        </mesh>
        {scene.settings.showCeiling ? (
          <mesh position={[0, room.heightCm * CM_TO_WORLD, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <shapeGeometry args={[shape]} />
            <meshStandardMaterial {...materialProps(scene.materials[room.ceilingMaterialId])} side={THREE.DoubleSide} />
          </mesh>
        ) : null}
      </group>
    );
  });
}

function WallSegmentBox({ wall, from, to, bottomCm, topCm, scene, onSelect }) {
  const segmentHeight = (topCm - bottomCm) * CM_TO_WORLD;
  if (segmentHeight <= 0.01) return null;
  const length = distance2D(from, to) * CM_TO_WORLD;
  if (length <= 0) return null;
  const angle = Math.atan2(to.y - from.y, to.x - from.x);
  const center = { x: ((from.x + to.x) / 2) * CM_TO_WORLD, z: ((from.y + to.y) / 2) * CM_TO_WORLD };
  const y = (bottomCm * CM_TO_WORLD) + segmentHeight / 2;
  return (
    <group onClick={(event) => { event.stopPropagation(); onSelect(wall.id); }}>
      <mesh position={[center.x, y, center.z]} rotation={[0, -angle, 0]}>
        <boxGeometry args={[length, segmentHeight, wall.thicknessCm * CM_TO_WORLD]} />
        <meshStandardMaterial {...materialProps(scene.materials[wall.materialId])} />
      </mesh>
    </group>
  );
}

function OpeningAssembly({ wall, opening, scene, onSelect }) {
  const transform = wallTransform(wall);
  const direction = { x: (wall.end.x - wall.start.x) / transform.length, y: (wall.end.y - wall.start.y) / transform.length };
  const center = { x: wall.start.x + direction.x * opening.offsetCm, y: wall.start.y + direction.y * opening.offsetCm };
  const angle = Math.atan2(direction.y, direction.x);
  const sill = opening.sillHeightCm || 0;
  const top = sill + opening.heightCm;
  const lintels = [];
  const left = { x: center.x - direction.x * opening.widthCm / 2, y: center.y - direction.y * opening.widthCm / 2 };
  const right = { x: center.x + direction.x * opening.widthCm / 2, y: center.y + direction.y * opening.widthCm / 2 };
  if (wall.heightCm > top) {
    lintels.push(<WallSegmentBox key={`${opening.id}-lintel`} wall={wall} from={left} to={right} bottomCm={top} topCm={wall.heightCm} scene={scene} onSelect={onSelect} />);
  }
  if (opening.type === 'window' && sill > 0) {
    lintels.push(<WallSegmentBox key={`${opening.id}-sill`} wall={wall} from={left} to={right} bottomCm={0} topCm={sill} scene={scene} onSelect={onSelect} />);
  }
  const frameColor = '#e8dfd2';
  const glassColor = '#d8eef2';
  const openAngle = ((opening.openAngleDeg ?? 0) * Math.PI) / 180;
  return (
    <>
      {lintels}
      <group key={opening.id} position={[center.x * CM_TO_WORLD, 0, center.y * CM_TO_WORLD]} rotation={[0, -angle, 0]} onClick={(event) => { event.stopPropagation(); onSelect(opening.id); }}>
        <Box args={[opening.widthCm * CM_TO_WORLD + 0.06, 0.055, 0.07]} position={[0, top * CM_TO_WORLD, 0]}><meshStandardMaterial color={frameColor} roughness={0.55} /></Box>
        {opening.type === 'window' && sill > 0 ? <Box args={[opening.widthCm * CM_TO_WORLD + 0.08, 0.05, 0.08]} position={[0, sill * CM_TO_WORLD, 0]}><meshStandardMaterial color={frameColor} roughness={0.55} /></Box> : null}
        <Box args={[0.055, opening.heightCm * CM_TO_WORLD, 0.07]} position={[-opening.widthCm * CM_TO_WORLD / 2, (sill + opening.heightCm / 2) * CM_TO_WORLD, 0]}><meshStandardMaterial color={frameColor} roughness={0.55} /></Box>
        <Box args={[0.055, opening.heightCm * CM_TO_WORLD, 0.07]} position={[opening.widthCm * CM_TO_WORLD / 2, (sill + opening.heightCm / 2) * CM_TO_WORLD, 0]}><meshStandardMaterial color={frameColor} roughness={0.55} /></Box>
        {opening.type === 'window' ? (
          <>
            <Box args={[0.025, opening.heightCm * CM_TO_WORLD - 0.04, 0.025]} position={[0, (sill + opening.heightCm / 2) * CM_TO_WORLD, 0]}><meshStandardMaterial color={frameColor} roughness={0.5} /></Box>
            <Box args={[opening.widthCm * CM_TO_WORLD - 0.08, opening.heightCm * CM_TO_WORLD - 0.08, 0.018]} position={[0, (sill + opening.heightCm / 2) * CM_TO_WORLD, 0]}>
              <meshPhysicalMaterial color={glassColor} transparent opacity={0.28} roughness={0.06} metalness={0.05} transmission={0.82} thickness={0.02} />
            </Box>
          </>
        ) : (
          <group position={[-opening.widthCm * CM_TO_WORLD / 2, sill * CM_TO_WORLD, 0]} rotation={[0, opening.swingDirection === 'right' ? -openAngle : openAngle, 0]}>
            <Box args={[opening.widthCm * CM_TO_WORLD - 0.06, opening.heightCm * CM_TO_WORLD - 0.04, 0.035]} position={[opening.widthCm * CM_TO_WORLD / 2, opening.heightCm * CM_TO_WORLD / 2, 0]}>
              <meshStandardMaterial color="#9a6748" roughness={0.62} />
            </Box>
          </group>
        )}
      </group>
    </>
  );
}

function GeneratedWalls({ scene, onSelect }) {
  return Object.values(scene.walls).filter((wall) => wall.visible).flatMap((wall) => {
    const openings = Object.values(scene.openings).filter((opening) => opening.wallId === wall.id && opening.visible).sort((a, b) => a.offsetCm - b.offsetCm);
    const transform = wallTransform(wall);
    const direction = { x: (wall.end.x - wall.start.x) / transform.length, y: (wall.end.y - wall.start.y) / transform.length };
    const points = [wall.start];
    openings.forEach((opening) => {
      points.push({ x: wall.start.x + direction.x * (opening.offsetCm - opening.widthCm / 2), y: wall.start.y + direction.y * (opening.offsetCm - opening.widthCm / 2) });
      points.push({ x: wall.start.x + direction.x * (opening.offsetCm + opening.widthCm / 2), y: wall.start.y + direction.y * (opening.offsetCm + opening.widthCm / 2) });
    });
    points.push(wall.end);
    const segments = [];
    for (let index = 0; index < points.length; index += 2) {
      segments.push(<WallSegmentBox key={`${wall.id}-${index}`} wall={wall} from={points[index]} to={points[index + 1]} bottomCm={0} topCm={wall.heightCm} scene={scene} onSelect={onSelect} />);
    }
    const apertureMeshes = openings.map((opening) => (
      <OpeningAssembly key={opening.id} wall={wall} opening={opening} scene={scene} onSelect={onSelect} />
    ));
    return [...segments, ...apertureMeshes];
  });
}

function FurnitureModel({ item, selected, onSelect }) {
  const width = item.dimensionsCm.w * CM_TO_WORLD;
  const depth = item.dimensionsCm.d * CM_TO_WORLD;
  const height = item.dimensionsCm.h * CM_TO_WORLD;
  const product = getSpacioProduct(item.productId);
  return (
    <group
      position={[(item.position.x + item.dimensionsCm.w / 2) * CM_TO_WORLD, item.position.z * CM_TO_WORLD, (item.position.y + item.dimensionsCm.d / 2) * CM_TO_WORLD]}
      rotation={[0, -item.rotationY * Math.PI / 180, 0]}
      onClick={(event) => { event.stopPropagation(); onSelect(item.id); }}
    >
      <DetailedFurnitureModel product={product} width={width} depth={depth} height={height} />
      {selected ? <Box args={[width + .04, Math.max(height, .15) + .04, depth + .04]} position={[0, Math.max(height, .15) / 2, 0]}><meshBasicMaterial wireframe color="#8b7a6a" transparent opacity={0.55} /></Box> : null}
    </group>
  );
}

const Furniture = memo(function Furniture({ scene, select }) {
  return Object.values(scene.furniture).filter((item) => item.visible).map((item) => (
    <FurnitureModel key={item.id} item={item} selected={scene.selectedIds.includes(item.id)} onSelect={select} />
  ));
});

function StudioLighting() {
  return (
    <>
      <ambientLight intensity={0.65} color="#ffffff" />
      <directionalLight intensity={0.85} color="#fff8ef" position={[8, 12, 6]} />
      <directionalLight intensity={0.35} color="#dce8ff" position={[-6, 8, -4]} />
    </>
  );
}

function SceneContent({ walkthrough = false }) {
  const scene = useSceneStore((state) => state.scene);
  const select = useSceneStore((state) => state.select);
  return (
    <>
      <color attach="background" args={['#ebe6de']} />
      <StudioLighting />
      <RoomSurfaces scene={scene} />
      <GeneratedWalls scene={scene} onSelect={select} />
      <Furniture scene={scene} select={select} />
      <Environment preset="apartment" />
      {walkthrough ? <Text position={[0, 1.4, 0]} fontSize={.12} color="#4f4439">WASD movement | Escape unlocks pointer</Text> : null}
      {walkthrough ? <WalkthroughControls scene={scene} /> : null}
    </>
  );
}
function WalkthroughControls({ scene }) {
  const { camera } = useThree();
  const keys = React.useRef(new Set());
  const forward = React.useMemo(() => new THREE.Vector3(), []);
  const right = React.useMemo(() => new THREE.Vector3(), []);
  const movement = React.useMemo(() => new THREE.Vector3(), []);
  React.useEffect(() => {
    camera.position.set(scene.camera.walkthrough.position[0], scene.camera.walkthrough.position[1], scene.camera.walkthrough.position[2]);
    camera.lookAt(scene.camera.editor3d.target[0], 1.05, scene.camera.editor3d.target[2]);
    const down = (event) => keys.current.add(event.key.toLowerCase());
    const up = (event) => keys.current.delete(event.key.toLowerCase());
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => { window.removeEventListener('keydown', down); window.removeEventListener('keyup', up); };
  }, [camera, scene.camera.walkthrough.position]);
  useFrame((_, delta) => {
    movement.set(0, 0, 0);
    camera.getWorldDirection(forward);
    forward.y = 0;
    forward.normalize();
    right.crossVectors(forward, camera.up).normalize();
    if (keys.current.has('w')) movement.add(forward);
    if (keys.current.has('s')) movement.sub(forward);
    if (keys.current.has('a')) movement.sub(right);
    if (keys.current.has('d')) movement.add(right);
    if (!movement.lengthSq()) return;
    movement.normalize().multiplyScalar(delta * 2.2);
    const candidate = camera.position.clone().add(movement);
    const room = Object.values(scene.rooms)[0];
    if (!room) return;
    const xs = room.polygon.map((point) => point.x * CM_TO_WORLD);
    const zs = room.polygon.map((point) => point.y * CM_TO_WORLD);
    candidate.x = Math.max(Math.min(...xs) + .24, Math.min(Math.max(...xs) - .24, candidate.x));
    candidate.z = Math.max(Math.min(...zs) + .24, Math.min(Math.max(...zs) - .24, candidate.z));
    const blocked = Object.values(scene.furniture).some((item) => {
      if (['woven-rug', 'gradient-art'].includes(item.productId)) return false;
      const left = item.position.x * CM_TO_WORLD - .18;
      const rightEdge = (item.position.x + item.dimensionsCm.w) * CM_TO_WORLD + .18;
      const top = item.position.y * CM_TO_WORLD - .18;
      const bottom = (item.position.y + item.dimensionsCm.d) * CM_TO_WORLD + .18;
      return candidate.x > left && candidate.x < rightEdge && candidate.z > top && candidate.z < bottom;
    });
    if (!blocked) {
      candidate.y = 1.6;
      camera.position.copy(candidate);
    }
  });
  return <PointerLockControls />;
}

export default function Scene3D({ walkthrough = false }) {
  const scene = useSceneStore((state) => state.scene);
  const dpr = scene.settings.renderQuality === 'photorealistic' ? [1, 1.5] : 1;
  return (
    <div className="h-full w-full">
      <Canvas dpr={dpr} gl={{ toneMapping: THREE.ACESFilmicToneMapping, antialias: scene.settings.renderQuality !== 'draft' }} onPointerMissed={() => useSceneStore.getState().select(null)}>
        <PerspectiveCamera makeDefault fov={scene.camera.editor3d.fov} position={scene.camera.editor3d.position} />
        <SceneContent walkthrough={walkthrough} />
        {!walkthrough ? <OrbitControls makeDefault target={scene.camera.editor3d.target} maxPolarAngle={Math.PI / 2.05} /> : null}
      </Canvas>
      {walkthrough ? (
        <>
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 before:absolute before:left-1/2 before:h-full before:w-px before:bg-white/80 after:absolute after:top-1/2 after:h-px after:w-full after:bg-white/80" />
          <div className="pointer-events-none absolute left-1/2 top-5 -translate-x-1/2 rounded-full bg-black/55 px-4 py-2 text-xs text-white">Click scene to look around | WASD to move | Escape to exit</div>
        </>
      ) : null}
    </div>
  );
}
