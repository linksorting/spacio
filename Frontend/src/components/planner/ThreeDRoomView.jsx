import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const SCALE = 0.05; // px → Three.js world units

function getItemColor(name = '') {
  const n = name.toLowerCase();
  if (/(sofa|couch|loveseat|sectional|daybed)/.test(n)) return '#4a4a4a';
  if (/(armchair|accent chair|lounge|recliner|bean|pouf|ottoman)/.test(n)) return '#505050';
  if (/(chair|stool|bench|seat)/.test(n)) return '#5a5a5a';
  if (/(bed|headboard|mattress)/.test(n)) return '#c8bfb0';
  if (/(coffee table|side table|end table|nesting|console)/.test(n)) return '#6b5a42';
  if (/(table|desk|workstation|counter)/.test(n)) return '#7a6a50';
  if (/(cabinet|wardrobe|shelf|bookcase|sideboard|dresser|storage|drawer|pantry|unit)/.test(n)) return '#6a5030';
  if (/(lamp|light|chandelier|pendant)/.test(n)) return '#f0e0a0';
  if (/(plant|tree|planter)/.test(n)) return '#3a6a2a';
  if (/(rug|carpet|mat)/.test(n)) return '#b0a080';
  if (/(stove|oven|cooktop|hob|range|chimney|grill)/.test(n)) return '#2a2a2a';
  if (/(fridge|refrigerator)/.test(n)) return '#c0c4c8';
  if (/(bathtub|tub|shower)/.test(n)) return '#e0e8ee';
  if (/(toilet|wc|bidet|sink|basin|washbasin|vanity)/.test(n)) return '#f0f0f0';
  if (/(island|countertop|worktop)/.test(n)) return '#908060';
  if (/(mirror)/.test(n)) return '#c8dce8';
  if (/(door)/.test(n)) return '#6a5030';
  if (/(window|curtain|blind)/.test(n)) return '#c8dce8';
  return '#707070';
}

function getItemHeight(name = '') {
  const n = name.toLowerCase();
  if (/(sofa|couch|loveseat|sectional|daybed)/.test(n)) return 0.85;
  if (/(armchair|accent chair|lounge|recliner|bean|pouf|ottoman)/.test(n)) return 0.9;
  if (/(chair|stool|bench|seat)/.test(n)) return 0.85;
  if (/(bed|headboard|mattress)/.test(n)) return 0.55;
  if (/(coffee table|side table|end table|nesting)/.test(n)) return 0.45;
  if (/(table|desk|workstation|counter)/.test(n)) return 0.75;
  if (/(cabinet|wardrobe|shelf|bookcase|sideboard|dresser|storage|drawer|pantry|unit)/.test(n)) return 1.0;
  if (/(lamp|light|chandelier|pendant)/.test(n)) return 1.5;
  if (/(plant|tree|planter)/.test(n)) return 1.0;
  if (/(rug|carpet|mat)/.test(n)) return 0.02;
  if (/(stove|oven|cooktop|hob|range|chimney|grill)/.test(n)) return 0.9;
  if (/(fridge|refrigerator)/.test(n)) return 1.7;
  if (/(bathtub|tub)/.test(n)) return 0.6;
  if (/(toilet|wc|bidet)/.test(n)) return 0.6;
  if (/(sink|basin|washbasin|vanity)/.test(n)) return 0.85;
  if (/(shower)/.test(n)) return 2.1;
  if (/(island|countertop|worktop)/.test(n)) return 0.9;
  return 0.5;
}

const FLOOR_COLORS = {
  oak: '#c89b60',
  walnut: '#6a4e30',
  maple: '#d4b896',
  marble: '#e8e0d8',
  concrete: '#b0a8a0',
  herring: '#a0845a',
  tile_wht: '#f0ece8',
  tile_grey: '#9a9590',
};

export default function ThreeDRoomView({ rooms, walls, items, wallColor = '#d8d4ce', floorTexture = 'oak' }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let mounted = true;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#f0ece8');
    scene.fog = new THREE.Fog('#f0ece8', 20, 40);

    // Camera
    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 100);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);

    // Lighting — soft interior lighting like Foyr
    const ambient = new THREE.AmbientLight('#ffffff', 0.7);
    scene.add(ambient);

    const mainLight = new THREE.DirectionalLight('#fff5e6', 0.9);
    mainLight.position.set(4, 8, 6);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.set(2048, 2048);
    mainLight.shadow.camera.near = 0.5;
    mainLight.shadow.camera.far = 30;
    mainLight.shadow.camera.left = -10;
    mainLight.shadow.camera.right = 10;
    mainLight.shadow.camera.top = 10;
    mainLight.shadow.camera.bottom = -10;
    mainLight.shadow.bias = -0.001;
    scene.add(mainLight);

    const fillLight = new THREE.DirectionalLight('#e0e8ff', 0.4);
    fillLight.position.set(-5, 5, -3);
    scene.add(fillLight);

    // hemisphere light for sky/ground bounce
    const hemi = new THREE.HemisphereLight('#e8eef5', '#c89b60', 0.3);
    scene.add(hemi);

    // Compute scene bounds from rooms
    let minX = Infinity, minZ = Infinity, maxX = -Infinity, maxZ = -Infinity;
    rooms.forEach(r => {
      const rx = r.x * SCALE;
      const rz = r.y * SCALE;
      minX = Math.min(minX, rx);
      minZ = Math.min(minZ, rz);
      maxX = Math.max(maxX, rx + r.w * SCALE);
      maxZ = Math.max(maxZ, rz + r.h * SCALE);
    });

    if (rooms.length === 0) {
      minX = 0; minZ = 0; maxX = 8; maxZ = 6;
    }

    const centerX = (minX + maxX) / 2;
    const centerZ = (minZ + maxZ) / 2;
    const roomW = maxX - minX;
    const roomH = maxZ - minZ;

    const WALL_H = 2.8;
    const WALL_T = 0.08;

    // Wall material
    const wallMat = new THREE.MeshStandardMaterial({
      color: wallColor,
      roughness: 0.95,
      metalness: 0.0,
    });
    const wallEdgeMat = new THREE.LineBasicMaterial({ color: '#1a1a1a', linewidth: 1 });

    // Floor texture — wooden planks via procedural
    const floorCanvas = document.createElement('canvas');
    floorCanvas.width = 512;
    floorCanvas.height = 512;
    const fCtx = floorCanvas.getContext('2d');
    // Base wood color
    const baseFloorColor = FLOOR_COLORS[floorTexture] || '#c89b60';
    fCtx.fillStyle = baseFloorColor;
    fCtx.fillRect(0, 0, 512, 512);
    // Plank lines
    fCtx.strokeStyle = '#b08848';
    fCtx.lineWidth = 1;
    for (let i = 0; i < 16; i++) {
      const y = i * 32;
      fCtx.beginPath();
      fCtx.moveTo(0, y);
      fCtx.lineTo(512, y);
      fCtx.stroke();
    }
    // Vertical stagger lines
    for (let row = 0; row < 16; row++) {
      const offset = (row % 2) * 128;
      for (let col = 0; col < 4; col++) {
        const x = col * 256 + offset;
        fCtx.beginPath();
        fCtx.moveTo(x, row * 32);
        fCtx.lineTo(x, (row + 1) * 32);
        fCtx.stroke();
      }
    }
    // Subtle grain
    fCtx.globalAlpha = 0.06;
    for (let i = 0; i < 2000; i++) {
      const gx = Math.random() * 512;
      const gy = Math.random() * 512;
      fCtx.fillStyle = Math.random() > 0.5 ? '#000' : '#fff';
      fCtx.fillRect(gx, gy, 1, 1);
    }
    fCtx.globalAlpha = 1;

    const floorTex = new THREE.CanvasTexture(floorCanvas);
    floorTex.wrapS = THREE.RepeatWrapping;
    floorTex.wrapT = THREE.RepeatWrapping;
    floorTex.repeat.set(2, 2);

    const floorMat = new THREE.MeshStandardMaterial({
      map: floorTex,
      roughness: 0.65,
      metalness: 0.02,
    });

    // Build rooms
    rooms.forEach(room => {
      const rx = room.x * SCALE;
      const rz = room.y * SCALE;
      const rw = room.w * SCALE;
      const rh = room.h * SCALE;

      // Floor
      const floorGeo = new THREE.PlaneGeometry(rw, rh);
      const floor = new THREE.Mesh(floorGeo, floorMat);
      floor.rotation.x = -Math.PI / 2;
      floor.position.set(rx + rw / 2, 0, rz + rh / 2);
      floor.receiveShadow = true;
      scene.add(floor);

      // Ceiling (subtle)
      const ceilGeo = new THREE.PlaneGeometry(rw, rh);
      const ceilMat = new THREE.MeshStandardMaterial({ color: '#eae6e0', roughness: 1 });
      const ceil = new THREE.Mesh(ceilGeo, ceilMat);
      ceil.rotation.x = Math.PI / 2;
      ceil.position.set(rx + rw / 2, WALL_H, rz + rh / 2);
      scene.add(ceil);

      // 4 Walls — thin, tall, with edges
      const addWall = (w, h, d, px, py, pz) => {
        const geo = new THREE.BoxGeometry(w, h, d);
        const mesh = new THREE.Mesh(geo, wallMat);
        mesh.position.set(px, py, pz);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        scene.add(mesh);

        const edges = new THREE.EdgesGeometry(geo);
        const line = new THREE.LineSegments(edges, wallEdgeMat);
        line.position.copy(mesh.position);
        scene.add(line);
      };

      // Back (far z)
      addWall(rw + WALL_T * 2, WALL_H, WALL_T, rx + rw / 2, WALL_H / 2, rz - WALL_T / 2);
      // Front (near z)
      addWall(rw + WALL_T * 2, WALL_H, WALL_T, rx + rw / 2, WALL_H / 2, rz + rh + WALL_T / 2);
      // Left
      addWall(WALL_T, WALL_H, rh, rx - WALL_T / 2, WALL_H / 2, rz + rh / 2);
      // Right
      addWall(WALL_T, WALL_H, rh, rx + rw + WALL_T / 2, WALL_H / 2, rz + rh / 2);
    });

    // Standalone walls
    walls.forEach(wall => {
      const x1 = wall.x1 * SCALE;
      const z1 = wall.y1 * SCALE;
      const x2 = wall.x2 * SCALE;
      const z2 = wall.y2 * SCALE;
      const len = Math.sqrt((x2 - x1) ** 2 + (z2 - z1) ** 2);
      const angle = Math.atan2(z2 - z1, x2 - x1);

      const geo = new THREE.BoxGeometry(len, WALL_H, WALL_T);
      const mesh = new THREE.Mesh(geo, wallMat);
      mesh.position.set((x1 + x2) / 2, WALL_H / 2, (z1 + z2) / 2);
      mesh.rotation.y = -angle;
      mesh.castShadow = true;
      scene.add(mesh);

      const edges = new THREE.EdgesGeometry(geo);
      const line = new THREE.LineSegments(edges, wallEdgeMat);
      line.position.copy(mesh.position);
      line.rotation.copy(mesh.rotation);
      scene.add(line);
    });

    const addFallbackItem = (item) => {
      const ix = item.x * SCALE;
      const iz = item.y * SCALE;
      const iw = item.w * SCALE;
      const id = item.h * SCALE;
      const ih = getItemHeight(item.name);
      const color = getItemColor(item.name);

      const geo = new THREE.BoxGeometry(iw, ih, id);
      const mat = new THREE.MeshStandardMaterial({
        color,
        roughness: 0.6,
        metalness: 0.02,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(ix + iw / 2, ih / 2, iz + id / 2);
      mesh.rotation.y = -(item.rotation || 0) * Math.PI / 180;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      scene.add(mesh);

      // Edges
      const edges = new THREE.EdgesGeometry(geo);
      const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: '#111' }));
      line.position.copy(mesh.position);
      line.rotation.copy(mesh.rotation);
      scene.add(line);
    };

    const loader = new GLTFLoader();
    const normalizeModel = (model, item) => {
      if (!mounted) return;
      const ix = item.x * SCALE;
      const iz = item.y * SCALE;
      const iw = item.w * SCALE;
      const id = item.h * SCALE;
      const ih = getItemHeight(item.name);

      const box = new THREE.Box3().setFromObject(model);
      const size = new THREE.Vector3();
      const center = new THREE.Vector3();
      box.getSize(size);
      box.getCenter(center);
      model.position.sub(center);

      const scale = Math.min(
        iw / Math.max(size.x, 0.001),
        ih / Math.max(size.y, 0.001),
        id / Math.max(size.z, 0.001)
      );
      model.scale.setScalar(scale);
      model.rotation.y = -(item.rotation || 0) * Math.PI / 180;
      model.position.set(ix + iw / 2, 0, iz + id / 2);
      model.traverse(child => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
      scene.add(model);
    };

    // Furniture items
    items.forEach(item => {
      if (item.model3dUrl) {
        loader.load(
          item.model3dUrl,
          gltf => normalizeModel(gltf.scene, item),
          undefined,
          () => addFallbackItem(item)
        );
        return;
      }

      addFallbackItem(item);
    });

    // Default ground if no rooms
    if (rooms.length === 0) {
      const gGeo = new THREE.PlaneGeometry(20, 20);
      const ground = new THREE.Mesh(gGeo, floorMat);
      ground.rotation.x = -Math.PI / 2;
      ground.position.set(5, -0.01, 4);
      ground.receiveShadow = true;
      scene.add(ground);
    }

    // Camera — Foyr-like: slightly elevated, looking into the room from a corner
    const maxDim = Math.max(roomW, roomH, 2);

    // Start position: slightly outside the front-right corner, at human eye level
    let theta = -0.4; // horizontal angle
    let phi = 0.35;   // vertical angle (low = more eye-level)
    let radius = maxDim * 1.4;
    const lookY = WALL_H * 0.35;

    const updateCamera = () => {
      camera.position.x = centerX + radius * Math.cos(phi) * Math.cos(theta);
      camera.position.y = Math.max(0.3, radius * Math.sin(phi));
      camera.position.z = centerZ + radius * Math.cos(phi) * Math.sin(theta);
      camera.lookAt(centerX, lookY, centerZ);
    };
    updateCamera();

    // Orbit controls
    let isDragging = false;
    let prevMouse = { x: 0, y: 0 };

    const onMouseDown = (e) => { isDragging = true; prevMouse = { x: e.clientX, y: e.clientY }; };
    const onMouseMove = (e) => {
      if (!isDragging) return;
      const dx = e.clientX - prevMouse.x;
      const dy = e.clientY - prevMouse.y;
      theta -= dx * 0.005;
      phi = Math.max(0.05, Math.min(Math.PI / 2.5, phi + dy * 0.004));
      prevMouse = { x: e.clientX, y: e.clientY };
      updateCamera();
    };
    const onMouseUp = () => { isDragging = false; };
    const onWheel = (e) => {
      e.preventDefault();
      radius = Math.max(1, Math.min(20, radius + e.deltaY * 0.008));
      updateCamera();
    };

    const canvas = renderer.domElement;
    canvas.addEventListener('mousedown', onMouseDown);
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mouseup', onMouseUp);
    canvas.addEventListener('mouseleave', onMouseUp);
    canvas.addEventListener('wheel', onWheel, { passive: false });

    // Render loop
    let animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    // Resize
    const onResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    return () => {
      mounted = false;
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
      canvas.removeEventListener('mousedown', onMouseDown);
      canvas.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('mouseup', onMouseUp);
      canvas.removeEventListener('mouseleave', onMouseUp);
      canvas.removeEventListener('wheel', onWheel);
      renderer.dispose();
      scene.traverse(object => {
        if (object.geometry) object.geometry.dispose();
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach(material => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      });
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [rooms, walls, items, wallColor, floorTexture]);

  return <div ref={mountRef} className="absolute inset-0" />;
}
