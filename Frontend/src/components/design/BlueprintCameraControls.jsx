/* eslint-disable react/no-unknown-property */
import { OrbitControls } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import { getBlueprintCameraSetup } from '@/lib/blueprintHelpers';

/**
 * Orbit controls configured like Blueprint3D's stock Three.js viewer.
 * @param {{
 *   floorSpec?: { width?: number, depth?: number, centerX?: number, centerZ?: number } | null,
 *   roomShell?: import('@/lib/blueprintHelpers').BlueprintRoomShell | null,
 *   shellRevision?: number,
 *   enabled?: boolean,
 * }} props
 */
export default function BlueprintCameraControls({
  floorSpec = null,
  roomShell = null,
  shellRevision = 0,
  enabled = true,
}) {
  const { camera } = useThree();
  const controlsRef = useRef(null);

  const lastShellRevisionRef = useRef(-1);

  useEffect(() => {
    if (lastShellRevisionRef.current === shellRevision) return;
    lastShellRevisionRef.current = shellRevision;

    const { target, position } = getBlueprintCameraSetup(floorSpec, roomShell);
    camera.fov = 45;
    camera.near = 0.01;
    camera.far = 100;
    camera.position.set(position[0], position[1], position[2]);
    camera.updateProjectionMatrix();

    if (controlsRef.current) {
      controlsRef.current.target.set(target[0], target[1], target[2]);
      controlsRef.current.update();
    }
  }, [camera, floorSpec, roomShell, shellRevision]);

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      enabled={enabled}
      enableDamping={false}
      minPolarAngle={0.01}
      maxPolarAngle={Math.PI / 2}
      minDistance={0.5}
      maxDistance={15}
      rotateSpeed={1}
      zoomSpeed={1}
      panSpeed={1}
    />
  );
}
