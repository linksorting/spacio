import { useGLTF } from '@react-three/drei';
import { useLoader } from '@react-three/fiber';
import { useMemo } from 'react';
import { Box3, Vector3 } from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { getModelFormat } from '@/lib/modelFormats';

const fittedTemplateCache = new Map();

function cacheKey(url, materialPalette, widthCm, depthCm, heightCm) {
  const paletteKey = materialPalette ? JSON.stringify(materialPalette) : '';
  return `${url}|${widthCm}|${depthCm}|${heightCm}|${paletteKey}`;
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
    child.castShadow = false;
    child.receiveShadow = false;
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

function getFittedInstance(url, sourceRoot, materialPalette, widthCm, depthCm, heightCm) {
  const key = cacheKey(url, materialPalette, widthCm, depthCm, heightCm);
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

function GltfModel({ url, materialPalette, widthCm, depthCm, heightCm }) {
  const gltf = useGLTF(url);
  const fitted = useMemo(
    () => getFittedInstance(url, gltf.scene, materialPalette, widthCm, depthCm, heightCm),
    [url, gltf.scene, materialPalette, widthCm, depthCm, heightCm],
  );
  return <primitive object={fitted.scene} scale={fitted.scale} position={fitted.position} />;
}

function ObjModel({ url, widthCm, depthCm, heightCm }) {
  const object = useLoader(OBJLoader, url);
  const fitted = useMemo(
    () => getFittedInstance(url, object, null, widthCm, depthCm, heightCm),
    [url, object, widthCm, depthCm, heightCm],
  );
  return <primitive object={fitted.scene} scale={fitted.scale} position={fitted.position} />;
}

/**
 * Loads a scene/product model from GLTF, GLB, OBJ, or BJ (OBJ alias).
 */
export default function LoadedModel({ url, materialPalette = null, widthCm, depthCm, heightCm }) {
  const format = getModelFormat(url);
  if (format === 'gltf') {
    return (
      <GltfModel
        url={url}
        materialPalette={materialPalette}
        widthCm={widthCm}
        depthCm={depthCm}
        heightCm={heightCm}
      />
    );
  }
  if (format === 'obj') {
    return <ObjModel url={url} widthCm={widthCm} depthCm={depthCm} heightCm={heightCm} />;
  }
  return null;
}

/** @param {string} url */
export function preloadModel(url) {
  if (getModelFormat(url) === 'gltf') {
    useGLTF.preload(url);
  }
}
