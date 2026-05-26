/* eslint-disable react/no-unknown-property */
import {
  Component,
  Suspense,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Bounds, Center, Html, useProgress } from '@react-three/drei';
import { Canvas, useThree } from '@react-three/fiber';
import {
  ACESFilmicToneMapping,
  Plane,
  Raycaster,
  SRGBColorSpace,
  Vector3,
} from 'three';
import LoadedModel from './LoadedModel';
import BlueprintRoomShell from './BlueprintRoomShell';
import BlueprintCameraControls from './BlueprintCameraControls.jsx';
import { getBlueprintCameraSetup } from '@/lib/blueprintHelpers';
import { getModelSceneScale } from '@/lib/resolveCatalogModelUrl';
import { SUPPORTED_MODEL_LABEL } from '@/lib/modelFormats';
import styles from './ImportedSceneViewer.module.css';

const floorPlane = new Plane(new Vector3(0, 1, 0), 0);
const raycaster = new Raycaster();
const hitPoint = new Vector3();

function DropProjectionBridge({ onMount }) {
  const { camera } = useThree();

  useEffect(() => {
    onMount((clientX, clientY, rect) => {
      if (!rect?.width || !rect?.height) return null;
      const ndcX = ((clientX - rect.left) / rect.width) * 2 - 1;
      const ndcY = -((clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera({ x: ndcX, y: ndcY }, camera);
      if (!raycaster.ray.intersectPlane(floorPlane, hitPoint)) return null;
      return { x: hitPoint.x, z: hitPoint.z };
    });
    return () => onMount(null);
  }, [camera, onMount]);

  return null;
}

function SceneLoader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className={styles.loading}>Loading 3D scene {Math.round(progress)}%</div>
    </Html>
  );
}

function OptionalSceneRoom({ room }) {
  if (!room?.sceneModelUrl) return null;
  return (
    <LoadedModel
      url={room.sceneModelUrl}
      materialPalette={room.materialPalette}
    />
  );
}

function PlacedGltfItem({ item, selected, onSelect, onMove, onDragChange }) {
  const groupRef = useRef(null);
  const draggingRef = useRef(false);
  const dragOffsetRef = useRef({ x: 0, z: 0 });
  const { camera, gl, controls } = useThree();
  const scale = getModelSceneScale(item.modelUrl);
  const widthM = (item.widthCm ?? 100) / 100;
  const depthM = (item.depthCm ?? 100) / 100;
  const heightM = Math.max(0.08, (item.heightCm ?? 100) / 100);

  useLayoutEffect(() => {
    if (!groupRef.current || draggingRef.current) return;
    groupRef.current.position.set(item.x, 0, item.z);
    groupRef.current.rotation.set(0, item.rotationY, 0);
  }, [item.rotationY, item.x, item.z]);

  const projectPointerToFloor = useCallback((clientX, clientY) => {
    const rect = gl.domElement.getBoundingClientRect();
    if (!rect.width || !rect.height) return null;
    const ndcX = ((clientX - rect.left) / rect.width) * 2 - 1;
    const ndcY = -((clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera({ x: ndcX, y: ndcY }, camera);
    const hit = new Vector3();
    if (!raycaster.ray.intersectPlane(floorPlane, hit)) return null;
    return hit;
  }, [camera, gl.domElement]);

  const finishDrag = useCallback((clientX, clientY, pointerId) => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    if (controls) controls.enabled = true;
    onDragChange?.(false);
    if (pointerId != null) {
      try {
        gl.domElement.releasePointerCapture(pointerId);
      } catch {
        // ignore if capture was already released
      }
    }
    if (groupRef.current) {
      groupRef.current.position.y = 0;
      onMove?.(item.id, groupRef.current.position.x, groupRef.current.position.z);
    }
  }, [controls, gl.domElement, item.id, onDragChange, onMove]);

  const handlePointerDown = (event) => {
    event.stopPropagation();
    onSelect?.(item);
    if (event.button !== 0) return;

    draggingRef.current = true;
    if (controls) controls.enabled = false;
    onDragChange?.(true);
    gl.domElement.setPointerCapture(event.pointerId);

    const hit = projectPointerToFloor(event.clientX, event.clientY);
    if (hit && groupRef.current) {
      dragOffsetRef.current = {
        x: groupRef.current.position.x - hit.x,
        z: groupRef.current.position.z - hit.z,
      };
    }
  };

  const handlePointerMove = (event) => {
    if (!draggingRef.current || !groupRef.current) return;
    event.stopPropagation();
    const hit = projectPointerToFloor(event.clientX, event.clientY);
    if (!hit) return;
    groupRef.current.position.set(
      hit.x + dragOffsetRef.current.x,
      0,
      hit.z + dragOffsetRef.current.z,
    );
  };

  const handlePointerUp = (event) => {
    event.stopPropagation();
    finishDrag(event.clientX, event.clientY, event.pointerId);
  };

  const handlePointerCancel = (event) => {
    finishDrag(event.clientX, event.clientY, event.pointerId);
  };

  return (
    <group ref={groupRef} rotation={[0, item.rotationY, 0]}>
      <mesh
        position={[0, heightM / 2, 0]}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
      >
        <boxGeometry args={[widthM, heightM, depthM]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
      {selected ? (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, 0]}>
          <ringGeometry args={[Math.max(widthM, depthM) * 0.35, Math.max(widthM, depthM) * 0.55, 32]} />
          <meshBasicMaterial color="#818cf8" transparent opacity={0.85} depthWrite={false} />
        </mesh>
      ) : null}
      <group scale={[scale, scale, scale]}>
        <LoadedModel url={item.modelUrl} />
      </group>
    </group>
  );
}

class SceneErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error) {
    console.error('Could not render GLTF scene:', error);
  }

  render() {
    if (this.state.failed) {
      return (
        <div className={styles.error}>
          {`Could not render this scene. Supported formats: ${SUPPORTED_MODEL_LABEL}.`}
        </div>
      );
    }
    return this.props.children;
  }
}

/**
 * Modern GLTF/GLB design viewer (replaces Blueprint3D .js JSON renderer in 3D mode).
 * @param {{
 *   room?: import('@/lib/catalogData').InspirationRoom | null,
 *   floorSpec?: { width: number, depth: number, centerX: number, centerZ: number } | null,
 *   roomShell?: import('@/lib/blueprintHelpers').BlueprintRoomShell | null,
 *   shellRevision?: number,
 *   selectedFloorRoom?: object | null,
 *   selectedWallEdge?: object | null,
 *   onFloorClick?: (room: object) => void,
 *   onWallClick?: (edge: object) => void,
 *   placedItems?: Array<{ id: string, modelUrl: string, name?: string, x: number, z: number, rotationY: number }>,
 *   selectedItemId?: string | null,
 *   onSelectItem?: (item: object) => void,
 *   onMoveItem?: (id: string, x: number, z: number) => void,
 *   onClose?: () => void,
 *   showCaption?: boolean,
 * }} props
 */
const GltfDesignViewer = forwardRef(function GltfDesignViewer({
  room = null,
  floorSpec = null,
  roomShell = null,
  shellRevision = 0,
  selectedFloorRoom = null,
  selectedWallEdge = null,
  onFloorClick,
  onWallClick,
  placedItems = [],
  selectedItemId = null,
  onSelectItem,
  onMoveItem,
  onClose,
  showCaption = true,
}, ref) {
  const title = room?.name ?? '3D design view';
  const [orbitEnabled, setOrbitEnabled] = useState(true);
  const projectDropRef = useRef(null);

  const initialCamera = useMemo(() => {
    const { position } = getBlueprintCameraSetup(floorSpec, roomShell);
    return {
      position,
      fov: 45,
      near: 0.01,
      far: 100,
    };
  }, [shellRevision]);

  const setProjectDrop = useCallback((projector) => {
    projectDropRef.current = projector;
  }, []);

  useImperativeHandle(ref, () => ({
    projectDrop(clientX, clientY, rect) {
      return projectDropRef.current?.(clientX, clientY, rect) ?? null;
    },
  }), []);

  return (
    <section className={styles.root} aria-label={`${title} GLTF view`}>
      <SceneErrorBoundary>
        <Canvas
          camera={initialCamera}
          dpr={[1, 1.5]}
          onPointerMissed={() => onSelectItem?.(null)}
          gl={{
            antialias: true,
            powerPreference: 'high-performance',
            outputColorSpace: SRGBColorSpace,
            toneMapping: ACESFilmicToneMapping,
            toneMappingExposure: 1.05,
          }}
          shadows
        >
          <DropProjectionBridge onMount={setProjectDrop} />
          <color attach="background" args={['#201c19']} />
          <ambientLight intensity={0.7} />
          <hemisphereLight args={['#fff3df', '#2d2926', 1.15]} />
          <directionalLight position={[8, 12, 6]} intensity={2.25} color="#ffe7ca" castShadow />
          <directionalLight position={[-8, 5, -4]} intensity={0.65} color="#dce9ff" />
          <Suspense fallback={<SceneLoader />}>
            {!room?.sceneModelUrl && roomShell ? (
              <BlueprintRoomShell
                shell={roomShell}
                selectedFloorRoom={selectedFloorRoom}
                selectedWallEdge={selectedWallEdge}
                onFloorClick={onFloorClick}
                onWallClick={onWallClick}
              />
            ) : null}
            {room?.sceneModelUrl ? (
              <Bounds fit clip observe margin={1.08}>
                <Center>
                  <OptionalSceneRoom room={room} />
                </Center>
              </Bounds>
            ) : null}
            {placedItems.map((item) => (
              <PlacedGltfItem
                key={item.id}
                item={item}
                selected={selectedItemId === item.id}
                onSelect={onSelectItem}
                onMove={onMoveItem}
                onDragChange={(dragging) => setOrbitEnabled(!dragging)}
              />
            ))}
          </Suspense>
          <BlueprintCameraControls
            floorSpec={floorSpec}
            roomShell={roomShell}
            shellRevision={shellRevision}
            enabled={orbitEnabled}
          />
        </Canvas>
      </SceneErrorBoundary>
      {showCaption ? (
        <div className={styles.caption}>
          <div>
            <span className={styles.eyebrow}>GLTF renderer</span>
            <strong>{title}</strong>
            <span className={styles.hint}>
              Click furniture to select, then drag to move. Drag empty space to orbit.
            </span>
          </div>
          {onClose ? (
            <button type="button" className={styles.returnBtn} onClick={onClose}>
              Edit floor plan
            </button>
          ) : null}
        </div>
      ) : null}
    </section>
  );
});

export default GltfDesignViewer;
