/* eslint-disable react/no-unknown-property */
import {
  Component,
  Suspense,
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import {
  ACESFilmicToneMapping,
  BoxGeometry,
  EdgesGeometry,
  Plane,
  Raycaster,
  SRGBColorSpace,
  Vector3,
} from 'three';
import CatalogDropPreview from './CatalogDropPreview';
import MoveHandlesOverlay from './MoveHandlesOverlay';
import { getWallHitFromWorldPoint } from '@/lib/wallOpenings';
import LoadedModel from './LoadedModel';
import BlueprintRoomShell from './BlueprintRoomShell';
import BlueprintCameraControls from './BlueprintCameraControls.jsx';
import { getBlueprintCameraSetup } from '@/lib/blueprintHelpers';
import { SUPPORTED_MODEL_LABEL } from '@/lib/modelFormats';
import styles from './ImportedSceneViewer.module.css';

function ScreenProjectionBridge({ onMount }) {
  const { camera, gl } = useThree();

  useEffect(() => {
    onMount((worldX, worldZ) => {
      const rect = gl.domElement.getBoundingClientRect();
      const projected = new Vector3(worldX, 0, worldZ).project(camera);
      if (projected.z > 1) return null;
      return {
        x: ((projected.x + 1) / 2) * rect.width + rect.left,
        y: ((-projected.y + 1) / 2) * rect.height + rect.top,
      };
    });
    return () => onMount(null);
  }, [camera, gl, onMount]);

  return null;
}

function WallPlacementLayer({
  active,
  config,
  floorplan,
  onPlace,
  onHoverChange = null,
}) {
  const { camera, gl, invalidate } = useThree();
  const [ghost, setGhost] = useState(null);
  const ghostRef = useRef(null);

  useEffect(() => {
    ghostRef.current = ghost;
  }, [ghost]);

  useEffect(() => {
    if (!active || !config) {
      setGhost(null);
      onHoverChange?.(false);
      gl.domElement.style.cursor = '';
      return undefined;
    }

    const onMove = (event) => {
      const rect = gl.domElement.getBoundingClientRect();
      const ndcX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const ndcY = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera({ x: ndcX, y: ndcY }, camera);
      const hit = new Vector3();
      if (!raycaster.ray.intersectPlane(floorPlane, hit)) {
        setGhost(null);
        onHoverChange?.(false);
        gl.domElement.style.cursor = 'not-allowed';
        invalidate();
        return;
      }

      const wallHit = getWallHitFromWorldPoint(floorplan, hit.x, hit.z);
      if (!wallHit) {
        setGhost(null);
        onHoverChange?.(false);
        gl.domElement.style.cursor = 'not-allowed';
        invalidate();
        return;
      }

      setGhost({ ...wallHit, config });
      onHoverChange?.(true);
      gl.domElement.style.cursor = 'crosshair';
      invalidate();
    };

    const onDown = (event) => {
      if (event.button !== 0 || !ghostRef.current) return;
      event.stopPropagation();
      onPlace?.(ghostRef.current);
      invalidate();
    };

    gl.domElement.addEventListener('pointermove', onMove);
    gl.domElement.addEventListener('pointerdown', onDown, true);
    return () => {
      gl.domElement.removeEventListener('pointermove', onMove);
      gl.domElement.removeEventListener('pointerdown', onDown, true);
      gl.domElement.style.cursor = '';
    };
  }, [active, camera, config, floorplan, gl, invalidate, onHoverChange, onPlace]);

  if (!ghost) return null;

  const color = ghost.config.type === 'doorway'
    ? '#10b981'
    : ghost.config.type === 'window'
      ? '#3b82f6'
      : '#6366f1';

  return (
    <mesh
      position={[
        ghost.worldPos.x,
        (ghost.config.elevCm + ghost.config.heightCm / 2) / 100,
        ghost.worldPos.z,
      ]}
      rotation={[0, ghost.angle, 0]}
    >
      <boxGeometry args={[ghost.config.widthCm / 100, ghost.config.heightCm / 100, 0.08]} />
      <meshBasicMaterial color={color} transparent opacity={0.35} depthTest={false} />
    </mesh>
  );
}

function ProductPlacementLayer({ item, snapCm = 10, onPlace }) {
  const { camera, gl, invalidate } = useThree();
  const [position, setPosition] = useState(null);
  const positionRef = useRef(null);

  useEffect(() => {
    positionRef.current = position;
  }, [position]);

  useEffect(() => {
    if (!item) {
      setPosition(null);
      gl.domElement.style.cursor = '';
      return undefined;
    }

    const projectPointer = (event) => {
      const rect = gl.domElement.getBoundingClientRect();
      const ndcX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const ndcY = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera({ x: ndcX, y: ndcY }, camera);
      if (!raycaster.ray.intersectPlane(floorPlane, hitPoint)) return null;
      const snapM = snapCm / 100;
      return {
        x: Math.round(hitPoint.x / snapM) * snapM,
        z: Math.round(hitPoint.z / snapM) * snapM,
      };
    };

    const onMove = (event) => {
      const next = projectPointer(event);
      positionRef.current = next;
      setPosition(next);
      gl.domElement.style.cursor = next ? 'crosshair' : 'not-allowed';
      invalidate();
    };

    const onDown = (event) => {
      if (event.button !== 0 || !positionRef.current) return;
      event.stopPropagation();
      onPlace?.(positionRef.current);
      invalidate();
    };

    gl.domElement.style.cursor = 'crosshair';
    gl.domElement.addEventListener('pointermove', onMove);
    gl.domElement.addEventListener('pointerdown', onDown, true);
    return () => {
      gl.domElement.removeEventListener('pointermove', onMove);
      gl.domElement.removeEventListener('pointerdown', onDown, true);
      gl.domElement.style.cursor = '';
    };
  }, [camera, gl, invalidate, item, onPlace, snapCm]);

  return item && position ? <CatalogDropPreview item={item} position={position} /> : null;
}

function SelectionOutline({ widthM, depthM, heightM, visible }) {
  const groupRef = useRef(null);
  const geometry = useMemo(
    () => new BoxGeometry(widthM * 1.03, heightM * 1.03, depthM * 1.03),
    [depthM, heightM, widthM],
  );
  const edges = useMemo(() => new EdgesGeometry(geometry), [geometry]);

  useLayoutEffect(() => {
    disableSubtreeRaycast(groupRef.current);
  }, [geometry, edges]);

  if (!visible) return null;

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      <mesh geometry={geometry} renderOrder={999}>
        <meshBasicMaterial color="#6366f1" transparent opacity={0.15} depthTest={false} />
      </mesh>
      <lineSegments geometry={edges} renderOrder={1000}>
        <lineBasicMaterial color="#6366f1" depthTest={false} />
      </lineSegments>
    </group>
  );
}

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

const DRAG_START_PX = 3;
const noopRaycast = () => {};

function disableSubtreeRaycast(object) {
  if (!object) return;
  object.raycast = noopRaycast;
  object.traverse((child) => {
    child.raycast = noopRaycast;
  });
}

const NonInteractiveGroup = forwardRef(function NonInteractiveGroup({ children, ...props }, ref) {
  useLayoutEffect(() => {
    if (ref && typeof ref === 'object') {
      disableSubtreeRaycast(ref.current);
    }
  }, [children, ref]);

  return (
    <group ref={ref} {...props}>
      {children}
    </group>
  );
});

function findPlacedItemId(object) {
  let current = object;
  while (current) {
    if (current.userData?.placedItemId) return current.userData.placedItemId;
    current = current.parent;
  }
  return null;
}

/** Disable orbit before OrbitControls sees a furniture pointerdown (capture phase). */
function CanvasPointerGuard({ active, onFurnitureInteract }) {
  const { camera, gl, controls, scene } = useThree();

  useEffect(() => {
    if (!active) return undefined;

    const canvas = gl.domElement;

    const hitsPlacedItem = (event) => {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return false;
      const ndcX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const ndcY = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera({ x: ndcX, y: ndcY }, camera);
      const hits = raycaster.intersectObjects(scene.children, true);
      return hits.some((hit) => findPlacedItemId(hit.object));
    };

    const onPointerDownCapture = (event) => {
      if (event.button !== 0) return;
      if (hitsPlacedItem(event)) {
        if (controls && 'enabled' in controls) controls.enabled = false;
        onFurnitureInteract?.(true);
      }
    };

    canvas.addEventListener('pointerdown', onPointerDownCapture, true);
    return () => canvas.removeEventListener('pointerdown', onPointerDownCapture, true);
  }, [active, camera, gl, controls, onFurnitureInteract, scene]);

  return null;
}

function SceneLoader() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
      <planeGeometry args={[2, 0.35]} />
      <meshBasicMaterial color="#2d2926" transparent opacity={0.85} />
    </mesh>
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

function WebGLContextGuard({ onContextIssue }) {
  const { gl, invalidate } = useThree();

  useEffect(() => {
    const canvas = gl.domElement;
    const onContextLost = (event) => {
      event.preventDefault();
      onContextIssue?.(true);
    };
    const onContextRestored = () => {
      onContextIssue?.(false);
      invalidate();
    };
    canvas.addEventListener('webglcontextlost', onContextLost, false);
    canvas.addEventListener('webglcontextrestored', onContextRestored, false);
    return () => {
      canvas.removeEventListener('webglcontextlost', onContextLost, false);
      canvas.removeEventListener('webglcontextrestored', onContextRestored, false);
    };
  }, [gl, invalidate, onContextIssue]);

  return null;
}

function FurnitureProxy({ widthM, depthM, heightM, active = false }) {
  return (
    <mesh position={[0, heightM / 2, 0]}>
      <boxGeometry args={[widthM, heightM, depthM]} />
      <meshStandardMaterial
        color={active ? '#d6c4ad' : '#8f867c'}
        transparent
        opacity={active ? 0.72 : 0.2}
        roughness={0.8}
        wireframe={!active}
      />
    </mesh>
  );
}

const PlacedGltfItem = memo(function PlacedGltfItem({ item, selected, onSelect, onMove, onPointerActive }) {
  const groupRef = useRef(null);
  const visualRef = useRef(null);
  const draggingRef = useRef(false);
  const pointerIdRef = useRef(null);
  const pendingDragRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const dragOffsetRef = useRef({ x: 0, z: 0 });
  const selectedRef = useRef(selected);
  const [dragging, setDragging] = useState(false);
  const { camera, gl, invalidate } = useThree();
  const widthM = (item.widthCm ?? 100) / 100;
  const depthM = (item.depthCm ?? 100) / 100;
  const heightM = Math.max(0.08, (item.heightCm ?? 100) / 100);

  selectedRef.current = selected;

  useLayoutEffect(() => {
    if (groupRef.current) {
      groupRef.current.userData.placedItemId = item.id;
    }
  }, [item.id]);

  useLayoutEffect(() => {
    if (!groupRef.current || draggingRef.current) return;
    groupRef.current.position.set(item.x, item.y ?? 0, item.z);
    groupRef.current.rotation.set(0, item.rotationY, 0);
  }, [item.rotationY, item.x, item.y, item.z]);

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

  const releaseCamera = useCallback(() => {
    onPointerActive?.(false);
  }, [onPointerActive]);

  const finishDrag = useCallback((pointerId) => {
    const wasDragging = draggingRef.current;
    pointerIdRef.current = null;
    pendingDragRef.current = false;
    if (!wasDragging) {
      releaseCamera();
      gl.domElement.style.cursor = 'grab';
      invalidate();
      return;
    }
    draggingRef.current = false;
    setDragging(false);
    if (pointerId != null) {
      try {
        gl.domElement.releasePointerCapture(pointerId);
      } catch {
        // ignore if capture was already released
      }
    }
    if (groupRef.current) {
      onMove?.(item.id, groupRef.current.position.x, groupRef.current.position.z);
    }
    releaseCamera();
    gl.domElement.style.cursor = selectedRef.current ? 'grab' : '';
    invalidate();
  }, [gl.domElement, invalidate, item.id, onMove, releaseCamera]);

  useEffect(() => {
    const onWindowPointerMove = (event) => {
      if (pointerIdRef.current == null || pointerIdRef.current !== event.pointerId) return;
      if (!pendingDragRef.current) return;

      if (!draggingRef.current) {
        const dx = event.clientX - dragStartRef.current.x;
        const dy = event.clientY - dragStartRef.current.y;
        if ((dx * dx) + (dy * dy) < DRAG_START_PX * DRAG_START_PX) return;

        draggingRef.current = true;
        setDragging(true);
        gl.domElement.style.cursor = 'grabbing';
        gl.domElement.setPointerCapture(event.pointerId);
        invalidate();

        const hit = projectPointerToFloor(event.clientX, event.clientY);
        if (hit && groupRef.current) {
          dragOffsetRef.current = {
            x: groupRef.current.position.x - hit.x,
            z: groupRef.current.position.z - hit.z,
          };
        }
      }

      if (!groupRef.current) return;
      const hit = projectPointerToFloor(event.clientX, event.clientY);
      if (!hit) return;
      groupRef.current.position.set(
        hit.x + dragOffsetRef.current.x,
        item.y ?? 0,
        hit.z + dragOffsetRef.current.z,
      );
      invalidate();
    };

    const onWindowPointerUp = (event) => {
      if (pointerIdRef.current !== event.pointerId) return;
      finishDrag(event.pointerId);
    };

    window.addEventListener('pointermove', onWindowPointerMove);
    window.addEventListener('pointerup', onWindowPointerUp);
    return () => {
      window.removeEventListener('pointermove', onWindowPointerMove);
      window.removeEventListener('pointerup', onWindowPointerUp);
    };
  }, [finishDrag, gl.domElement, invalidate, item.y, projectPointerToFloor]);

  useEffect(() => {
    const releaseOrbit = () => {
      if (pointerIdRef.current != null) {
        finishDrag(pointerIdRef.current);
      }
    };
    window.addEventListener('blur', releaseOrbit);
    return () => window.removeEventListener('blur', releaseOrbit);
  }, [finishDrag]);

  const handlePointerDown = (event) => {
    if (event.button !== 0) return;
    event.stopPropagation();

    onPointerActive?.(true);

    pointerIdRef.current = event.pointerId;
    dragStartRef.current = { x: event.clientX, y: event.clientY };
    pendingDragRef.current = true;
  };

  const handleDoubleClick = (event) => {
    event.stopPropagation();
    onSelect?.(item);
  };

  const handlePointerOver = (event) => {
    event.stopPropagation();
    if (!draggingRef.current) {
      gl.domElement.style.cursor = selectedRef.current ? 'grab' : 'pointer';
    }
  };

  const handlePointerOut = () => {
    if (!draggingRef.current && pointerIdRef.current == null) {
      gl.domElement.style.cursor = '';
    }
  };

  return (
    <group
      ref={groupRef}
      rotation={[0, item.rotationY, 0]}
    >
      <mesh
        position={[0, heightM / 2, 0]}
        onPointerDown={handlePointerDown}
        onDoubleClick={handleDoubleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <boxGeometry args={[widthM * 1.2, heightM * 1.2, depthM * 1.2]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
      {selected ? (
        <NonInteractiveGroup position={[0, heightM / 2, 0]}>
          <SelectionOutline widthM={widthM} depthM={depthM} heightM={heightM} visible />
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -(heightM / 2) + 0.015, 0]}>
            <ringGeometry args={[Math.max(widthM, depthM) * 0.35, Math.max(widthM, depthM) * 0.55, 32]} />
            <meshBasicMaterial color="#818cf8" transparent opacity={0.45} depthWrite={false} />
          </mesh>
        </NonInteractiveGroup>
      ) : null}
      {dragging ? <FurnitureProxy widthM={widthM} depthM={depthM} heightM={heightM} active /> : null}
      <NonInteractiveGroup ref={visualRef} visible={!dragging}>
        <Suspense fallback={<FurnitureProxy widthM={widthM} depthM={depthM} heightM={heightM} />}>
          <LoadedModel
            url={item.modelUrl}
            materialUrl={item.materialUrl}
            widthCm={item.widthCm}
            depthCm={item.depthCm}
            heightCm={item.heightCm}
          />
        </Suspense>
      </NonInteractiveGroup>
    </group>
  );
});

class SceneErrorBoundary extends Component {
  static loggedSceneError = false;

  constructor(props) {
    super(props);
    this.state = { failed: false };
  }

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error) {
    if (!SceneErrorBoundary.loggedSceneError) {
      SceneErrorBoundary.loggedSceneError = true;
      console.warn('Could not render GLTF scene:', error?.message ?? error);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.failed && !this.state.failed) {
      this.props.onRecover?.();
    }
  }

  render() {
    if (this.state.failed) {
      return (
        <div className={styles.error}>
          {`Could not render this scene. Supported formats: ${SUPPORTED_MODEL_LABEL}.`}
          <button
            type="button"
            className={styles.returnBtn}
            style={{ marginTop: 12 }}
            onClick={() => this.setState({ failed: false })}
          >
            Retry 3D view
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

/**
 * Modern GLTF/GLB design viewer (replaces Blueprint3D .js JSON renderer in 3D mode).
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
  showCeiling = true,
  ceilingTextureUrl = '/rooms/textures/wallmap.png',
  ceilingTextureScale = 200,
  ceilingFixtures = [],
  dropPreviewItem = null,
  dropPreviewPosition = null,
  placementItem = null,
  onPlaceItem,
  onBackgroundClick,
  placedItems = [],
  selectedItemId = null,
  onSelectItem,
  onMoveItem,
  wallPlacementMode = null,
  wallOpenings = [],
  floorplan = null,
  onPlaceWallOpening,
  onClose,
  showCaption = true,
}, ref) {
  const title = room?.name ?? '3D design view';
  const [furnitureActive, setFurnitureActive] = useState(false);
  const [sceneFailed, setSceneFailed] = useState(false);
  const projectDropRef = useRef(null);
  const projectScreenRef = useRef(null);
  const selectedItem = placedItems.find((item) => item.id === selectedItemId) ?? null;
  const zoomApiRef = useRef(null);
  const handleZoomReady = useCallback((api) => {
    zoomApiRef.current = api;
  }, []);
  const floorplanWalls = useMemo(
    () => floorplan?.getWalls?.() ?? [],
    [floorplan, shellRevision],
  );

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

  const setProjectScreen = useCallback((projector) => {
    projectScreenRef.current = projector;
  }, []);

  useImperativeHandle(ref, () => ({
    projectDrop(clientX, clientY, rect) {
      return projectDropRef.current?.(clientX, clientY, rect) ?? null;
    },
    projectWorldToScreen(x, z) {
      return projectScreenRef.current?.(x, z) ?? null;
    },
  }), []);

  const handleContextIssue = useCallback((failed) => {
    setSceneFailed(failed);
  }, []);

  return (
    <section className={styles.root} aria-label={`${title} GLTF view`}>
      {sceneFailed ? (
        <div className={styles.error}>
          3D view paused after a graphics reset. Reload the page if walls or furniture stay missing.
        </div>
      ) : null}
      <SceneErrorBoundary onRecover={() => setSceneFailed(false)}>
        <Canvas
          camera={initialCamera}
          dpr={[1, 1.25]}
          frameloop="demand"
          onPointerMissed={() => {
            if (wallPlacementMode) return;
            setFurnitureActive(false);
            onSelectItem?.(null);
            onBackgroundClick?.();
          }}
          gl={{
            antialias: true,
            powerPreference: 'high-performance',
            outputColorSpace: SRGBColorSpace,
            toneMapping: ACESFilmicToneMapping,
            toneMappingExposure: 1.0,
          }}
          shadows
        >
          <DropProjectionBridge onMount={setProjectDrop} />
          <ScreenProjectionBridge onMount={setProjectScreen} />
          <WebGLContextGuard onContextIssue={handleContextIssue} />
          <CanvasPointerGuard
            active={!wallPlacementMode && !placementItem}
            onFurnitureInteract={setFurnitureActive}
          />
          <color attach="background" args={['#ffffff']} />
          <ambientLight intensity={0.65} />
          <hemisphereLight args={['#ffffff', '#ffffff', 0.35]} />
          <directionalLight
            position={[8, 12, 6]}
            intensity={1.35}
            color="#ffffff"
            castShadow
            shadow-mapSize={[1024, 1024]}
          />
          <directionalLight position={[-8, 5, -4]} intensity={0.35} color="#ffffff" />
          {!room?.sceneModelUrl && !roomShell ? (
            <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
              <planeGeometry args={[10, 10]} />
              <meshStandardMaterial color="#ffffff" roughness={0.94} metalness={0.02} />
            </mesh>
          ) : null}
          {!room?.sceneModelUrl && roomShell ? (
            <BlueprintRoomShell
              shell={roomShell}
              wallOpenings={wallOpenings}
              floorplanWalls={floorplanWalls}
              selectedFloorRoom={selectedFloorRoom}
              selectedWallEdge={wallPlacementMode ? null : selectedWallEdge}
              onFloorClick={wallPlacementMode ? null : onFloorClick}
              onWallClick={wallPlacementMode ? null : onWallClick}
              showCeiling={showCeiling}
              ceilingTextureUrl={ceilingTextureUrl}
              ceilingTextureScale={ceilingTextureScale}
              ceilingFixtures={ceilingFixtures}
              wallPlacementMode={wallPlacementMode}
              onWallPlacementClick={onPlaceWallOpening}
            />
          ) : null}
          <CatalogDropPreview item={dropPreviewItem} position={dropPreviewPosition} />
          <ProductPlacementLayer
            item={wallPlacementMode ? null : placementItem}
            onPlace={onPlaceItem}
          />
          <Suspense fallback={<SceneLoader />}>
            {room?.sceneModelUrl ? (
              <OptionalSceneRoom room={room} />
            ) : null}
            {placedItems.map((item) => (
              <PlacedGltfItem
                key={item.id}
                item={item}
                selected={selectedItemId === item.id}
                onSelect={onSelectItem}
                onMove={onMoveItem}
                onPointerActive={setFurnitureActive}
              />
            ))}
          </Suspense>
          {!roomShell ? (
            <WallPlacementLayer
              active={Boolean(wallPlacementMode)}
              config={wallPlacementMode}
              floorplan={floorplan}
              onPlace={onPlaceWallOpening}
              onHoverChange={() => {}}
            />
          ) : null}
          <BlueprintCameraControls
            floorSpec={floorSpec}
            roomShell={roomShell}
            shellRevision={shellRevision}
            enabled={!wallPlacementMode && !placementItem && !furnitureActive}
            onReady={handleZoomReady}
          />
        </Canvas>
      </SceneErrorBoundary>
      <MoveHandlesOverlay
        selectedItem={selectedItem}
        projectWorldToScreen={(x, z) => projectScreenRef.current?.(x, z) ?? null}
        visible={Boolean(selectedItem) && !wallPlacementMode && !placementItem}
      />
      {wallPlacementMode ? (
        <div className={styles.placementHint}>
          Click a wall to place {wallPlacementMode.label}. Press Esc to cancel.
        </div>
      ) : placementItem ? (
        <div className={styles.placementHint}>
          Step 1: click the floor to place {placementItem.name} · Esc to cancel
        </div>
      ) : (
        <div className={styles.controlsHelp}>
          {placedItems.length === 0
            ? 'Open Catalog on the left to add furniture'
            : 'Need help? Try clicking an item — tips will pop up here'}
        </div>
      )}
      {!room?.sceneModelUrl && roomShell ? (
        <div className={styles.zoomControls} aria-label="Zoom controls">
          <button
            type="button"
            className={styles.zoomBtn}
            aria-label="Zoom in"
            onClick={() => zoomApiRef.current?.zoomIn()}
          >
            +
          </button>
          <button
            type="button"
            className={styles.zoomBtn}
            aria-label="Zoom out"
            onClick={() => zoomApiRef.current?.zoomOut()}
          >
            −
          </button>
        </div>
      ) : null}
      {showCaption ? (
        <div className={styles.caption}>
          <div>
            <span className={styles.eyebrow}>GLTF renderer</span>
            <strong>{title}</strong>
            <span className={styles.hint}>
              Click to select furniture, drag selected item to move. Arrow keys nudge selection.
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
