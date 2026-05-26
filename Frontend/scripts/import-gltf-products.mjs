/**
 * Copies extracted GLTF furniture packages into public assets and converts
 * each model to the legacy Three JSONLoader format consumed by Blueprint3D.
 * UVs and diffuse texture paths are retained so imported products keep color.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as THREE from 'three';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const SOURCE_ROOT = path.resolve(ROOT, '..', '..');
const OUT_ROOT = path.join(ROOT, 'public', 'models', 'imported-products');

const PRODUCTS = [
  { folder: 'Sofa_01_1k.gltf', slug: 'sofa-01', source: 'Sofa_01_1k.gltf' },
  { folder: 'sofa_02_1k.gltf', slug: 'sofa-02', source: 'sofa_02_1k.gltf' },
  { folder: 'sofa_03_1k.gltf', slug: 'sofa-03', source: 'sofa_03_1k.gltf' },
  { folder: 'modern_arm_chair_01_1k.gltf', slug: 'modern-arm-chair-01', source: 'modern_arm_chair_01_1k.gltf' },
  { folder: 'coffee_table_round_01_1k.gltf', slug: 'coffee-table-round-01', source: 'coffee_table_round_01_1k.gltf' },
  { folder: 'round_wooden_table_01_1k.gltf', slug: 'round-wooden-table-01', source: 'round_wooden_table_01_1k.gltf' },
  { folder: 'GothicBed_01_1k.gltf', slug: 'gothic-bed-01', source: 'GothicBed_01_1k.gltf' },
  { folder: 'chinese_cabinet_1k.gltf', slug: 'chinese-cabinet', source: 'chinese_cabinet_1k.gltf' },
];

const COMPONENT_ARRAYS = {
  5120: Int8Array,
  5121: Uint8Array,
  5122: Int16Array,
  5123: Uint16Array,
  5125: Uint32Array,
  5126: Float32Array,
};

const COMPONENT_COUNTS = {
  SCALAR: 1,
  VEC2: 2,
  VEC3: 3,
  VEC4: 4,
};

function readAccessor(gltf, buffers, accessorIndex) {
  const accessor = gltf.accessors[accessorIndex];
  const view = gltf.bufferViews[accessor.bufferView];
  const ArrayType = COMPONENT_ARRAYS[accessor.componentType];
  const count = COMPONENT_COUNTS[accessor.type];
  const itemBytes = ArrayType.BYTES_PER_ELEMENT * count;
  const stride = view.byteStride ?? itemBytes;
  const source = buffers[view.buffer];
  const offset = (view.byteOffset ?? 0) + (accessor.byteOffset ?? 0);
  const values = [];

  for (let index = 0; index < accessor.count; index += 1) {
    const start = offset + index * stride;
    const entry = new ArrayType(source.buffer, source.byteOffset + start, count);
    values.push(Array.from(entry));
  }
  return values;
}

function nodeMatrix(node) {
  if (node.matrix) return new THREE.Matrix4().fromArray(node.matrix);
  const position = new THREE.Vector3(...(node.translation ?? [0, 0, 0]));
  const quaternion = new THREE.Quaternion(...(node.rotation ?? [0, 0, 0, 1]));
  const scale = new THREE.Vector3(...(node.scale ?? [1, 1, 1]));
  return new THREE.Matrix4().compose(position, quaternion, scale);
}

function collectMeshNodes(gltf) {
  const meshes = [];
  const rootNodes = gltf.scenes[gltf.scene ?? 0]?.nodes ?? [];
  const visit = (nodeIndex, parentMatrix) => {
    const node = gltf.nodes[nodeIndex];
    const worldMatrix = parentMatrix.clone().multiply(nodeMatrix(node));
    if (node.mesh !== undefined) meshes.push({ mesh: gltf.meshes[node.mesh], worldMatrix });
    (node.children ?? []).forEach((child) => visit(child, worldMatrix));
  };
  rootNodes.forEach((nodeIndex) => visit(nodeIndex, new THREE.Matrix4()));
  return meshes;
}

function makeMaterial(gltf, material, index) {
  const baseTexture = material?.pbrMetallicRoughness?.baseColorTexture?.index;
  const normalTexture = material?.normalTexture?.index;
  const imageUri = baseTexture === undefined ? null : gltf.images[gltf.textures[baseTexture].source]?.uri;
  const normalUri = normalTexture === undefined ? null : gltf.images[gltf.textures[normalTexture].source]?.uri;
  const diffuse = material?.pbrMetallicRoughness?.baseColorFactor?.slice(0, 3) ?? [1, 1, 1];
  const output = {
    DbgColor: 15658734,
    DbgIndex: index,
    DbgName: material?.name ?? `imported_${index}`,
    blending: 'NormalBlending',
    colorAmbient: diffuse.map((value) => Math.min(1, value * 0.72)),
    colorDiffuse: diffuse,
    colorEmissive: [0, 0, 0],
    colorSpecular: [0.16, 0.16, 0.16],
    depthTest: true,
    depthWrite: true,
    shading: 'Lambert',
    specularCoef: 28,
    transparency: 1,
    transparent: false,
    vertexColors: false,
  };
  if (imageUri) {
    output.mapDiffuse = imageUri;
    output.mapDiffuseWrap = ['repeat', 'repeat'];
  }
  if (normalUri) output.importedNormalMap = normalUri;
  return output;
}

function convertPackage(sourceDir, targetDir, sourceGltf, slug) {
  const gltf = JSON.parse(fs.readFileSync(path.join(sourceDir, sourceGltf), 'utf8'));
  const buffers = gltf.buffers.map((buffer) => fs.readFileSync(path.join(sourceDir, buffer.uri)));
  const vertices = [];
  const normals = [];
  const uvs = [];
  const faces = [];
  const bounds = new THREE.Box3();

  collectMeshNodes(gltf).forEach(({ mesh, worldMatrix }) => {
    const normalMatrix = new THREE.Matrix3().getNormalMatrix(worldMatrix);
    mesh.primitives.forEach((primitive) => {
      if ((primitive.mode ?? 4) !== 4) return;
      const positions = readAccessor(gltf, buffers, primitive.attributes.POSITION);
      const sourceNormals = primitive.attributes.NORMAL === undefined
        ? positions.map(() => [0, 1, 0])
        : readAccessor(gltf, buffers, primitive.attributes.NORMAL);
      const sourceUvs = primitive.attributes.TEXCOORD_0 === undefined
        ? positions.map(() => [0, 0])
        : readAccessor(gltf, buffers, primitive.attributes.TEXCOORD_0);
      const indices = primitive.indices === undefined
        ? positions.map((_, index) => [index])
        : readAccessor(gltf, buffers, primitive.indices);
      const vertexOffset = vertices.length / 3;

      positions.forEach((position, index) => {
        const vertex = new THREE.Vector3(...position).applyMatrix4(worldMatrix);
        const normal = new THREE.Vector3(...sourceNormals[index]).applyMatrix3(normalMatrix).normalize();
        bounds.expandByPoint(vertex);
        vertices.push(vertex.x, vertex.y, vertex.z);
        normals.push(normal.x, normal.y, normal.z);
        // glTF textures are read with flipY disabled; JSONLoader materials use
        // Three's legacy flipped image convention.
        uvs.push(sourceUvs[index][0], 1 - sourceUvs[index][1]);
      });

      for (let index = 0; index < indices.length; index += 3) {
        const a = indices[index][0] + vertexOffset;
        const b = indices[index + 1][0] + vertexOffset;
        const c = indices[index + 2][0] + vertexOffset;
        const materialIndex = primitive.material ?? 0;
        faces.push(42, a, b, c, materialIndex, a, b, c, a, b, c);
      }
    });
  });

  const size = new THREE.Vector3();
  bounds.getSize(size);
  const scale = Math.max(size.x, size.y, size.z) < 10 ? 100 : 1;
  const scaledVertices = vertices.map((value) => value * scale);
  const output = {
    metadata: {
      formatVersion: 3.1,
      generatedBy: 'import-gltf-products.mjs',
      vertices: scaledVertices.length / 3,
      faces: faces.length / 11,
      normals: normals.length / 3,
      colors: 0,
      uvs: [uvs.length / 2],
      materials: gltf.materials?.length ?? 1,
      morphTargets: 0,
      bones: 0,
    },
    scale: 1,
    materials: (gltf.materials ?? [{}]).map((material, index) => makeMaterial(gltf, material, index)),
    vertices: scaledVertices,
    morphTargets: [],
    normals,
    colors: [],
    uvs: [uvs],
    faces,
    bones: [],
    skinIndices: [],
    skinWeights: [],
    animations: [],
  };
  fs.writeFileSync(path.join(targetDir, `${slug}.js`), JSON.stringify(output));
}

function main() {
  fs.mkdirSync(OUT_ROOT, { recursive: true });
  PRODUCTS.forEach((product) => {
    const sourceDir = path.join(SOURCE_ROOT, product.folder);
    const targetDir = path.join(OUT_ROOT, product.slug);
    if (!fs.existsSync(path.join(sourceDir, product.source))) {
      throw new Error(`Missing source package: ${sourceDir}`);
    }
    fs.mkdirSync(targetDir, { recursive: true });
    fs.cpSync(sourceDir, targetDir, { recursive: true });
    convertPackage(sourceDir, targetDir, product.source, product.slug);
    console.log(`Imported ${product.slug}`);
  });
}

main();
