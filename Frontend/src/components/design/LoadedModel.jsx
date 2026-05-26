/* eslint-disable react/no-unknown-property */
import { useGLTF } from '@react-three/drei';
import { useLoader } from '@react-three/fiber';
import { useMemo } from 'react';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { getModelFormat } from '@/lib/modelFormats';

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

function GltfModel({ url, materialPalette }) {
  const gltf = useGLTF(url);
  const scene = useMemo(
    () => applyMaterialPalette(gltf.scene.clone(true), materialPalette),
    [gltf.scene, materialPalette],
  );
  return <primitive object={scene} />;
}

function ObjModel({ url }) {
  const object = useLoader(OBJLoader, url);
  const scene = useMemo(() => {
    const clone = object.clone(true);
    clone.traverse((child) => {
      if (!child.isMesh) return;
      child.castShadow = true;
      child.receiveShadow = true;
      if (Array.isArray(child.material)) {
        child.material = child.material.map((material) => material?.clone?.() ?? material);
      } else if (child.material?.clone) {
        child.material = child.material.clone();
      }
    });
    return clone;
  }, [object]);
  return <primitive object={scene} />;
}

/**
 * Loads a scene/product model from GLTF, GLB, OBJ, or BJ (OBJ alias).
 * @param {{ url: string, materialPalette?: Record<string, string> }} props
 */
export default function LoadedModel({ url, materialPalette = null }) {
  const format = getModelFormat(url);
  if (format === 'gltf') return <GltfModel url={url} materialPalette={materialPalette} />;
  if (format === 'obj') return <ObjModel url={url} />;
  return null;
}

/** @param {string} url */
export function preloadModel(url) {
  if (getModelFormat(url) === 'gltf') {
    useGLTF.preload(url);
  }
}
