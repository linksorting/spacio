import createGL from 'gl';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';
import * as THREE from 'three-headless';
import { GLTFLoader } from 'three-headless/examples/jsm/loaders/GLTFLoader.js';
import { OBJLoader } from 'three-headless/examples/jsm/loaders/OBJLoader.js';

if (typeof globalThis.requestAnimationFrame !== 'function') {
  globalThis.requestAnimationFrame = (cb) => setTimeout(cb, 16);
  globalThis.cancelAnimationFrame = (id) => clearTimeout(id);
}
if (typeof globalThis.self === 'undefined') {
  globalThis.self = globalThis;
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC = path.join(__dirname, '../public');
const MODELS_DIR = path.join(PUBLIC, 'models');
const THUMBS_DIR = path.join(PUBLIC, 'thumbnails/models');
const MANIFEST = path.join(PUBLIC, 'thumbnails/manifest.json');
const W = 400;
const H = 300;

fs.mkdirSync(THUMBS_DIR, { recursive: true });

const manifest = fs.existsSync(MANIFEST)
  ? JSON.parse(fs.readFileSync(MANIFEST, 'utf8'))
  : {};

/** @type {string[]} */
const models = [];
(function walk(dir) {
  if (!fs.existsSync(dir)) return;
  for (const f of fs.readdirSync(dir)) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) {
      walk(full);
      continue;
    }
    if (/\.(glb|gltf|obj)$/i.test(f)) models.push(full);
  }
}(MODELS_DIR));

console.log(`Found ${models.length} models to process\n`);

const gl = createGL(W, H, { preserveDrawingBuffer: true, webgl: 1 });
[
  'texImage3D',
  'texSubImage3D',
  'copyTexSubImage3D',
  'compressedTexImage3D',
  'compressedTexSubImage3D',
  'framebufferTextureLayer',
  'drawBuffers',
  'createVertexArray',
  'bindVertexArray',
  'deleteVertexArray',
].forEach((name) => {
  if (typeof gl[name] !== 'function') {
    gl[name] = name.startsWith('create') ? () => ({}) : () => {};
  }
});
const fakeCanvas = {
  width: W,
  height: H,
  style: {},
  addEventListener: () => {},
  removeEventListener: () => {},
  getContext: () => gl,
  getBoundingClientRect: () => ({ left: 0, top: 0, width: W, height: H }),
};
const renderer = new THREE.WebGLRenderer({
  canvas: fakeCanvas,
  context: gl,
  antialias: true,
  forceWebGL: true,
});
renderer.setSize(W, H);
renderer.setClearColor(0xf5f5f5);
renderer.shadowMap.enabled = false;

const camera = new THREE.PerspectiveCamera(38, W / H, 0.01, 500000);

async function saveFrame(outPath) {
  const pixels = new Uint8Array(W * H * 4);
  gl.readPixels(0, 0, W, H, gl.RGBA, gl.UNSIGNED_BYTE, pixels);

  const rows = [];
  for (let y = H - 1; y >= 0; y -= 1) {
    rows.push(Buffer.from(pixels.subarray(y * W * 4, (y + 1) * W * 4)));
  }

  await sharp(Buffer.concat(rows), {
    raw: { width: W, height: H, channels: 4 },
  }).png().toFile(outPath);
}

for (const modelPath of models) {
  const relToPublic = `/${path.relative(PUBLIC, modelPath).replace(/\\/g, '/')}`;
  const thumbFileName = `${relToPublic
    .replace(/^\//, '')
    .replace(/[/\\]/g, '_')
    .replace(/\.[^.]+$/, '')}.png`;
  const thumbPath = path.join(THUMBS_DIR, thumbFileName);
  const thumbUrl = `/thumbnails/models/${thumbFileName}`;

  if (fs.existsSync(thumbPath)) {
    console.log(`skip  ${thumbFileName}`);
    manifest[relToPublic] = thumbUrl;
    continue;
  }

  try {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf5f5f5);

    scene.add(new THREE.AmbientLight(0xffffff, 0.55));
    const key = new THREE.DirectionalLight(0xffffff, 1.1);
    key.position.set(6, 9, 6);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0xddddff, 0.4);
    fill.position.set(-5, 3, -4);
    scene.add(fill);
    const rim = new THREE.DirectionalLight(0xffffff, 0.2);
    rim.position.set(0, 2, -8);
    scene.add(rim);

    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(100000, 100000),
      new THREE.MeshStandardMaterial({ color: 0xf5f5f5 }),
    );
    floor.rotation.x = -Math.PI / 2;
    scene.add(floor);

    const ext = path.extname(modelPath).toLowerCase();
    let object = null;
    const resourcePath = `${path.dirname(modelPath)}${path.sep}`;

    if (ext === '.glb') {
      const buffer = fs.readFileSync(modelPath);
      const gltf = await new GLTFLoader().parseAsync(buffer.buffer.slice(
        buffer.byteOffset,
        buffer.byteOffset + buffer.byteLength,
      ), resourcePath);
      object = gltf.scene;
    } else if (ext === '.gltf') {
      const json = JSON.parse(fs.readFileSync(modelPath, 'utf8'));
      const gltf = await new GLTFLoader().parseAsync(json, resourcePath);
      object = gltf.scene;
    } else if (ext === '.obj') {
      object = new OBJLoader().parse(fs.readFileSync(modelPath, 'utf8'));
      object.traverse((child) => {
        if (child.isMesh && !child.material?.name) {
          child.material = new THREE.MeshStandardMaterial({
            color: 0xc8b89a,
            roughness: 0.7,
            metalness: 0.05,
          });
        }
      });
    }

    if (!object) {
      console.warn(`skip  (load failed) ${thumbFileName}`);
      continue;
    }

    object.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = false;
        child.receiveShadow = false;
      }
    });

    scene.add(object);

    const box = new THREE.Box3().setFromObject(object);
    const size = new THREE.Vector3();
    const centre = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(centre);

    object.position.sub(centre);
    object.position.y -= box.min.y;

    const maxDim = Math.max(size.x, size.y, size.z);
    if (maxDim === 0) {
      console.warn(`skip  (zero size) ${thumbFileName}`);
      continue;
    }

    const dist = maxDim * 2.2;
    camera.position.set(dist * 0.7, dist * 0.65, dist * 0.7);
    camera.lookAt(0, size.y * 0.3, 0);
    camera.near = maxDim * 0.01;
    camera.far = maxDim * 20;
    camera.updateProjectionMatrix();

    renderer.render(scene, camera);
    await saveFrame(thumbPath);
    manifest[relToPublic] = thumbUrl;
    console.log(`done  ${thumbFileName}`);

    object.traverse((child) => {
      child.geometry?.dispose?.();
      (Array.isArray(child.material) ? child.material : [child.material])
        .forEach((material) => material?.dispose?.());
    });
  } catch (error) {
    console.error(`FAIL  ${thumbFileName} — ${error.message}`);
  }
}

fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2));
console.log(`\nDone. ${Object.keys(manifest).length} thumbnails in manifest.`);
