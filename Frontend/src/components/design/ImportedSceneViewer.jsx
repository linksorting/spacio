/* eslint-disable react/no-unknown-property */
import { Component, Suspense, useEffect, useRef } from 'react';
import { Bounds, Center, Html, OrbitControls, TransformControls, useProgress } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { ACESFilmicToneMapping, SRGBColorSpace } from 'three';
import LoadedModel from './LoadedModel';
import { SUPPORTED_MODEL_LABEL } from '@/lib/modelFormats';
import styles from './ImportedSceneViewer.module.css';

function SceneLoader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className={styles.loading}>Loading detailed room {Math.round(progress)}%</div>
    </Html>
  );
}

function SceneRoom({ room }) {
  return (
    <LoadedModel
      url={room.sceneModelUrl}
      materialPalette={room.materialPalette}
    />
  );
}

function PlacedTemplateItem({ item, selected, onSelect, onMove }) {
  const groupRef = useRef(null);

  useEffect(() => {
    if (!groupRef.current) return;
    groupRef.current.position.set(item.x, 0, item.z);
    groupRef.current.rotation.set(0, item.rotationY, 0);
  }, [item.rotationY, item.x, item.z]);

  const object = (
    <group
      ref={groupRef}
      position={[item.x, 0, item.z]}
      rotation={[0, item.rotationY, 0]}
      onClick={(event) => {
        event.stopPropagation();
        onSelect(item.sourceItem);
      }}
    >
      <LoadedModel url={item.previewModelUrl} materialUrl={item.materialUrl} widthCm={item.widthCm} depthCm={item.depthCm} heightCm={item.heightCm} />
    </group>
  );

  if (!selected) return object;

  return (
    <TransformControls
      mode="translate"
      translationSnap={0.1}
      showY={false}
      onObjectChange={() => {
        if (!groupRef.current) return;
        groupRef.current.position.y = 0;
        onMove(item.sourceItem, groupRef.current.position.x, groupRef.current.position.z);
      }}
    >
      {object}
    </TransformControls>
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
    console.error('Could not render imported scene:', error);
  }

  render() {
    if (this.state.failed) {
      return (
        <div className={styles.error}>
          {`This scene could not be rendered. Supported formats: ${SUPPORTED_MODEL_LABEL}.`}
        </div>
      );
    }
    return this.props.children;
  }
}

export default function ImportedSceneViewer({
  room,
  placedItems = [],
  selectedItem = null,
  onSelectItem,
  onMoveItem,
  onClose,
}) {
  return (
    <section className={styles.root} aria-label={`${room.name} 3D preview`}>
      <SceneErrorBoundary key={room.id}>
        <Canvas
          camera={{ position: [7, 5, 8], fov: 44, near: 0.01, far: 10000 }}
          dpr={[1, 1.5]}
          gl={{
            antialias: true,
            powerPreference: 'high-performance',
            outputColorSpace: SRGBColorSpace,
            toneMapping: ACESFilmicToneMapping,
            toneMappingExposure: 1.05,
          }}
          shadows
        >
          <color attach="background" args={['#201c19']} />
          <ambientLight intensity={0.7} />
          <hemisphereLight args={['#fff3df', '#2d2926', 1.15]} />
          <directionalLight position={[8, 12, 6]} intensity={2.25} color="#ffe7ca" castShadow />
          <directionalLight position={[-8, 5, -4]} intensity={0.65} color="#dce9ff" />
          <Suspense fallback={<SceneLoader />}>
            <Bounds fit clip observe margin={1.08}>
              <Center>
                <SceneRoom room={room} />
                {placedItems.map((item) => (
                  <PlacedTemplateItem
                    key={item.id}
                    item={item}
                    selected={selectedItem === item.sourceItem}
                    onSelect={onSelectItem}
                    onMove={onMoveItem}
                  />
                ))}
              </Center>
            </Bounds>
          </Suspense>
          <OrbitControls makeDefault enableDamping />
        </Canvas>
      </SceneErrorBoundary>
      <div className={styles.caption}>
        <div>
          <span className={styles.eyebrow}>Imported detailed scene</span>
          <strong>{room.name}</strong>
          {room.colorTreatment ? <span className={styles.treatment}>{room.colorTreatment}</span> : null}
          <span className={styles.hint}>
            {`Supports ${SUPPORTED_MODEL_LABEL}. Add catalog pieces, select to move, drag to orbit.`}
          </span>
        </div>
        <button type="button" className={styles.returnBtn} onClick={onClose}>
          Edit floor plan
        </button>
      </div>
    </section>
  );
}
