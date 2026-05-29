/* eslint-disable react/no-unknown-property */
import { OrbitControls } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import { MOUSE, TOUCH } from 'three';
import { getBlueprintCameraSetup } from '@/lib/blueprintHelpers';

const ZOOM_BUTTON_FACTOR = 1.1;

function OrbitDampingLoop({ controlsRef }) {
  const { invalidate } = useThree();

  useFrame((_, delta) => {
    const controls = controlsRef.current;
    if (!controls?.enableDamping || !controls.enabled) return;
    if (controls.update(delta)) {
      invalidate();
    }
  });

  return null;
}

/**
 * Orbit controls configured like Blueprint3D's stock Three.js viewer.
 */
export default function BlueprintCameraControls({
  floorSpec = null,
  roomShell = null,
  shellRevision = 0,
  enabled = true,
  onReady = null,
}) {
  const { camera, gl, invalidate } = useThree();
  const controlsRef = useRef(null);
  const lastShellRevisionRef = useRef(-1);

  useEffect(() => {
    if (!controlsRef.current || !onReady) return undefined;
    onReady({
      zoomIn: () => {
        controlsRef.current?.dollyIn(ZOOM_BUTTON_FACTOR);
        controlsRef.current?.update();
        invalidate();
      },
      zoomOut: () => {
        controlsRef.current?.dollyOut(ZOOM_BUTTON_FACTOR);
        controlsRef.current?.update();
        invalidate();
      },
    });
    return () => onReady(null);
  }, [invalidate, onReady]);

  useEffect(() => {
    const canvas = gl.domElement;
    const preventContextMenu = (event) => event.preventDefault();
    canvas.addEventListener('contextmenu', preventContextMenu);
    return () => canvas.removeEventListener('contextmenu', preventContextMenu);
  }, [gl]);

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
    <>
      <OrbitControls
        ref={controlsRef}
        makeDefault
        enabled={enabled}
        onChange={() => invalidate()}
        enableDamping
        dampingFactor={0.12}
        enablePan
        enableRotate
        enableZoom
        screenSpacePanning
        minPolarAngle={0.01}
        maxPolarAngle={Math.PI / 2}
        minDistance={0.5}
        maxDistance={15}
        rotateSpeed={0.9}
        zoomSpeed={1.05}
        panSpeed={0.85}
        keyPanSpeed={7}
        mouseButtons={{
          LEFT: MOUSE.ROTATE,
          MIDDLE: MOUSE.DOLLY,
          RIGHT: MOUSE.PAN,
        }}
        touches={{
          ONE: TOUCH.ROTATE,
          TWO: TOUCH.DOLLY_PAN,
        }}
      />
      <OrbitDampingLoop controlsRef={controlsRef} />
    </>
  );
}
