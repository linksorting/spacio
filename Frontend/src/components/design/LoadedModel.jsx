/* eslint-disable react/no-unknown-property */
import { Component } from 'react';
import { useGLTF } from '@react-three/drei';
import { useLoader } from '@react-three/fiber';
import { useMemo } from 'react';
import { Box3, Vector3 } from 'three';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { getModelFormat } from '@/lib/modelFormats';

const fittedTemplateCache = new Map();
const warnedModelUrls = new Set();

function cacheKey(url, materialUrl, materialPalette, widthCm, depthCm, heightCm) {
  const paletteKey = materialPalette ? JSON.stringify(materialPalette) : '';
  return `${url}|${materialUrl ?? ''}|${widthCm}|${depthCm}|${heightCm}|${paletteKey}`;
}

function applyMaterialPalette(root, materialPalette) {
  if (!root || !materialPalette) return root;

  root.traverse((object) => {
    if (!object.isMesh) return;

    const materials = Array.isArray(object.material) ? object.material : [object.material];
    const styledMaterials = materials.map((material) => {
      if (!material || material.map || !materialPalette[material.name]) return material;

      const styled = material.clone();
      styled.color.set(materialPalette[material.name]);
      styled.roughness = 0.62;
      styled.metalness = 0.04;
      styled.needsUpdate = true;
      return styled;
    });

    object.material = Array.isArray(object.material) ? styledMaterials : styledMaterials[0];
  });

  return root;
}

function buildFittedTemplate(root, materialPalette, widthCm, depthCm, heightCm) {
  const scene = applyMaterialPalette(root, materialPalette);
  scene.traverse((child) => {
    if (!child.isMesh) return;
    child.castShadow = true;
    child.receiveShadow = true;
  });

  if (![widthCm, depthCm, heightCm].every((value) => Number.isFinite(value) && value > 0)) {
    return { scene, scale: 1, position: [0, 0, 0] };
  }

  const box = new Box3().setFromObject(scene);
  const size = new Vector3();
  const center = new Vector3();
  box.getSize(size);
  box.getCenter(center);

  const sourceMax = Math.max(size.x, size.y, size.z);
  const targetMax = Math.max(widthCm, depthCm, heightCm) / 100;
  const scale = sourceMax > 0 ? targetMax / sourceMax : 1;

  return {
    scene,
    scale,
    position: [-center.x * scale, -box.min.y * scale, -center.z * scale],
  };
}

function getFittedInstance(url, materialUrl, sourceRoot, materialPalette, widthCm, depthCm, heightCm) {
  const key = cacheKey(url, materialUrl, materialPalette, widthCm, depthCm, heightCm);
  if (!fittedTemplateCache.has(key)) {
    fittedTemplateCache.set(
      key,
      buildFittedTemplate(sourceRoot, materialPalette, widthCm, depthCm, heightCm),
    );
  }

  const template = fittedTemplateCache.get(key);
  return {
    scene: template.scene.clone(true),
    scale: template.scale,
    position: template.position,
  };
}

function ModelLoadFallback({ widthCm = 100, depthCm = 100, heightCm = 100, failed = false }) {
  const widthM = widthCm / 100;
  const depthM = depthCm / 100;
  const heightM = Math.max(0.08, heightCm / 100);
  return (
    <mesh position={[0, heightM / 2, 0]}>
      <boxGeometry args={[widthM, heightM, depthM]} />
      <meshStandardMaterial
        color={failed ? '#7f1d1d' : '#8B6A45'}
        transparent
        opacity={failed ? 0.65 : 0.82}
        roughness={0.72}
        wireframe={failed}
      />
    </mesh>
  );
}

/** Apply a warm wood-brown material to any mesh that has no texture map. */
function applyDefaultBrown(root) {
  if (!root) return root;
  root.traverse((object) => {
    if (!object.isMesh) return;
    const mats = Array.isArray(object.material) ? object.material : [object.material];
    object.material = Array.isArray(object.material)
      ? mats.map((m) => {
          if (!m || m.map) return m;
          const n = m.clone();
          n.color.set('#8B6A45');
          n.roughness = 0.68;
          n.metalness = 0.04;
          n.needsUpdate = true;
          return n;
        })
      : (() => {
          if (mats[0]?.map) return mats[0];
          const n = mats[0]?.clone?.() ?? mats[0];
          if (n) { n.color.set('#8B6A45'); n.roughness = 0.68; n.metalness = 0.04; n.needsUpdate = true; }
          return n;
        })();
  });
  return root;
}

class ModelLoadErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error) {
    const url = this.props.url;
    if (warnedModelUrls.has(url)) return;
    warnedModelUrls.add(url);
    console.warn(`Could not load model ${url}:`, error?.message ?? error);
  }

  render() {
    if (this.state.failed) {
      return (
        <ModelLoadFallback
          widthCm={this.props.widthCm}
          depthCm={this.props.depthCm}
          heightCm={this.props.heightCm}
          failed
        />
      );
    }
    return this.props.children;
  }
}

function GltfModel({ url, materialPalette, widthCm, depthCm, heightCm }) {
  const gltf = useGLTF(url, '/libs/draco/');
  const fitted = useMemo(
    () => getFittedInstance(url, '', gltf.scene, materialPalette, widthCm, depthCm, heightCm),
    [url, gltf.scene, materialPalette, widthCm, depthCm, heightCm],
  );
  return <primitive object={fitted.scene} scale={fitted.scale} position={fitted.position} />;
}

function ObjModel({ url, widthCm, depthCm, heightCm }) {
  const object = useLoader(OBJLoader, url);
  const fitted = useMemo(() => {
    applyDefaultBrown(object);
    return getFittedInstance(url, '', object, null, widthCm, depthCm, heightCm);
  }, [url, object, widthCm, depthCm, heightCm]);
  return <primitive object={fitted.scene} scale={fitted.scale} position={fitted.position} />;
}

function MaterialObjModel({ url, materialUrl, widthCm, depthCm, heightCm }) {
  const materials = useLoader(MTLLoader, materialUrl);
  materials.preload();
  const object = useLoader(OBJLoader, url, (loader) => loader.setMaterials(materials));
  const fitted = useMemo(
    () => getFittedInstance(url, materialUrl, object, null, widthCm, depthCm, heightCm),
    [url, materialUrl, object, widthCm, depthCm, heightCm],
  );
  return <primitive object={fitted.scene} scale={fitted.scale} position={fitted.position} />;
}

/**
 * Loads a scene/product model from GLTF, GLB, OBJ, or BJ (OBJ alias).
 * Failures are isolated so one bad asset cannot crash the whole 3D canvas.
 */
export default function LoadedModel({
  url,
  materialUrl = '',
  materialPalette = null,
  widthCm,
  depthCm,
  heightCm,
}) {
  const format = getModelFormat(url);
  const body = format === 'gltf' ? (
    <GltfModel
      url={url}
      materialPalette={materialPalette}
      widthCm={widthCm}
      depthCm={depthCm}
      heightCm={heightCm}
    />
  ) : format === 'obj' && materialUrl ? (
    <MaterialObjModel
      url={url}
      materialUrl={materialUrl}
      widthCm={widthCm}
      depthCm={depthCm}
      heightCm={heightCm}
    />
  ) : format === 'obj' ? (
    <ObjModel url={url} widthCm={widthCm} depthCm={depthCm} heightCm={heightCm} />
  ) : null;

  if (!body) return null;

  return (
    <ModelLoadErrorBoundary url={url} widthCm={widthCm} depthCm={depthCm} heightCm={heightCm}>
      {body}
    </ModelLoadErrorBoundary>
  );
}

export { ModelLoadFallback, ModelLoadErrorBoundary };

/** @param {string} url @param {string} [materialUrl] */
export function preloadModel(url, materialUrl = '') {
  if (getModelFormat(url) === 'gltf') {
    useGLTF.preload(url);
  } else if (getModelFormat(url) === 'obj' && !materialUrl) {
    useLoader.preload(OBJLoader, url);
  }
}
