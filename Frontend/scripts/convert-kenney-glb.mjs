/**
 * Converts Kenney GLB files to Three.js r69 JSONLoader format (.js)
 * preserving per-part material colours from the GLB.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const SRC_DIR = path.join(ROOT, 'public', 'models', 'kenney');
const OUT_DIR = path.join(ROOT, 'public', 'models', 'kenney-js');

function extractColor(material) {
  if (!material) return [0.78, 0.74, 0.7];
  const mats = Array.isArray(material) ? material : [material];
  for (const mat of mats) {
    if (mat?.color) return [mat.color.r, mat.color.g, mat.color.b];
    if (mat?.emissive) {
      const e = mat.emissive;
      if (e.r + e.g + e.b > 0.01) return [e.r, e.g, e.b];
    }
  }
  return [0.78, 0.74, 0.7];
}

function makeLegacyMaterial(color, name) {
  return {
    DbgColor: 15658734,
    DbgIndex: 0,
    DbgName: name,
    blending: 'NormalBlending',
    colorAmbient: color.map((c) => Math.min(1, c * 0.55)),
    colorDiffuse: color,
    colorSpecular: [0.18, 0.18, 0.18],
    depthTest: true,
    depthWrite: true,
    shading: 'Lambert',
    specularCoef: 40,
    transparency: 1.0,
    transparent: false,
    vertexColors: false,
  };
}

function meshesToLegacyJson(meshes, scale = 1) {
  const materials = [];
  const materialIndexByKey = new Map();
  const vertices = [];
  const normals = [];
  const faces = [];

  const getMaterialIndex = (color) => {
    const key = color.map((v) => v.toFixed(4)).join(',');
    if (!materialIndexByKey.has(key)) {
      const idx = materials.length;
      materialIndexByKey.set(key, idx);
      materials.push(makeLegacyMaterial(color, `kenney_${idx}`));
    }
    return materialIndexByKey.get(key);
  };

  meshes.forEach(({ geometry, color }) => {
    const matIdx = getMaterialIndex(color);
    const pos = geometry.getAttribute('position');
    const normal = geometry.getAttribute('normal');
    const index = geometry.getIndex();
    const vertOffset = vertices.length / 3;

    for (let i = 0; i < pos.count; i++) {
      vertices.push(pos.getX(i) * scale, pos.getY(i) * scale, pos.getZ(i) * scale);
    }

    if (normal) {
      for (let i = 0; i < normal.count; i++) {
        normals.push(normal.getX(i), normal.getY(i), normal.getZ(i));
      }
    } else {
      for (let i = 0; i < pos.count; i++) {
        normals.push(0, 1, 0);
      }
    }

    const triCount = index ? index.count / 3 : pos.count / 3;
    for (let i = 0; i < triCount; i++) {
      const a = (index ? index.getX(i * 3) : i * 3) + vertOffset;
      const b = (index ? index.getX(i * 3 + 1) : i * 3 + 1) + vertOffset;
      const c = (index ? index.getX(i * 3 + 2) : i * 3 + 2) + vertOffset;
      faces.push(2, a, b, c, matIdx);
    }
  });

  return {
    metadata: {
      formatVersion: 3.1,
      generatedBy: 'convert-kenney-glb.mjs',
      vertices: vertices.length / 3,
      faces: faces.length / 5,
      normals: normals.length / 3,
      colors: 0,
      uvs: 0,
      materials: materials.length,
      morphTargets: 0,
      bones: 0,
    },
    scale: 1,
    materials,
    vertices,
    morphTargets: [],
    normals,
    colors: [],
    uvs: [],
    faces,
    bones: [],
    skinIndices: [],
    skinWeights: [],
    animations: [],
  };
}

async function convertFile(glbPath, outPath) {
  const loader = new GLTFLoader();
  const buf = fs.readFileSync(glbPath);
  const arrayBuffer = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);

  const gltf = await new Promise((resolve, reject) => {
    loader.parse(arrayBuffer, path.dirname(glbPath), resolve, reject);
  });

  gltf.scene.updateMatrixWorld(true);

  const meshes = [];
  gltf.scene.traverse((child) => {
    if (child.isMesh && child.geometry) {
      const geom = child.geometry.clone();
      geom.applyMatrix4(child.matrixWorld);
      meshes.push({ geometry: geom, color: extractColor(child.material) });
    }
  });

  if (!meshes.length) {
    throw new Error('No mesh geometry found');
  }

  const box = new THREE.Box3();
  meshes.forEach(({ geometry }) => {
    geometry.computeBoundingBox();
    box.union(geometry.boundingBox);
  });
  const size = new THREE.Vector3();
  box.getSize(size);
  const maxDim = Math.max(size.x, size.y, size.z);
  const scale = maxDim > 0 && maxDim < 5 ? 100 : 1;

  const json = meshesToLegacyJson(meshes, scale);
  fs.writeFileSync(outPath, JSON.stringify(json, null, '\t'));
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const files = fs.readdirSync(SRC_DIR).filter((f) => f.endsWith('.glb'));
  let ok = 0;
  let fail = 0;

  for (const file of files) {
    const base = file.replace(/\.glb$/i, '');
    const src = path.join(SRC_DIR, file);
    const out = path.join(OUT_DIR, `${base}.js`);
    try {
      await convertFile(src, out);
      ok++;
      if (ok % 20 === 0) console.log(`Converted ${ok}/${files.length}...`);
    } catch (err) {
      fail++;
      console.error(`FAIL ${file}:`, err.message);
    }
  }

  console.log(`Done: ${ok} converted, ${fail} failed (${files.length} total)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
