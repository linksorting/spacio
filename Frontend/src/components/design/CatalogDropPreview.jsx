/* eslint-disable react/no-unknown-property */
import { Suspense, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RingGeometry } from 'three';
import LoadedModel from './LoadedModel';

function PulsingRing() {
  const meshRef = useRef(null);

  useFrame(({ clock }) => {
    if (!meshRef.current?.material) return;
    meshRef.current.material.opacity = 0.45 + 0.3 * Math.sin(clock.elapsedTime * 2.5);
  });

  const geometry = useMemo(() => {
    const geo = new RingGeometry(0.1, 0.16, 48);
    geo.rotateX(-Math.PI / 2);
    return geo;
  }, []);

  return (
    <mesh ref={meshRef} geometry={geometry} position={[0, 0.01, 0]} renderOrder={1001}>
      <meshBasicMaterial color="#6366f1" transparent opacity={0.7} depthTest={false} />
    </mesh>
  );
}

function GhostTint({ widthCm, depthCm, heightCm }) {
  const widthM = (widthCm ?? 100) / 100;
  const depthM = (depthCm ?? 100) / 100;
  const heightM = Math.max(0.08, (heightCm ?? 100) / 100);

  return (
    <mesh position={[0, heightM / 2, 0]} renderOrder={1000}>
      <boxGeometry args={[widthM, heightM, depthM]} />
      <meshStandardMaterial
        color="#6366f1"
        transparent
        opacity={0.3}
        depthTest={false}
        depthWrite={false}
      />
    </mesh>
  );
}

// Semi-transparent ghost + floor ring shown while dragging a catalog item over the 3D canvas.
export default function CatalogDropPreview({ item, position }) {
  if (!item || !position) return null;

  return (
    <group position={[position.x, 0, position.z]} rotation={[0, item.rotationOffsetY ?? 0, 0]}>
      <PulsingRing />
      <Suspense fallback={<GhostTint widthCm={item.widthCm} depthCm={item.depthCm} heightCm={item.heightCm} />}>
        <group>
          <LoadedModel
            url={item.modelUrl}
            materialUrl={item.materialUrl}
            widthCm={item.widthCm}
            depthCm={item.depthCm}
            heightCm={item.heightCm}
          />
          <GhostTint widthCm={item.widthCm} depthCm={item.depthCm} heightCm={item.heightCm} />
        </group>
      </Suspense>
    </group>
  );
}
