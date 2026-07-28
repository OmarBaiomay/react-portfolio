import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { useBrand } from '../context/BrandContext';
import {
  cacheSceneId,
  hasCachedAppearance,
  readCachedSceneId,
  resolveRandomSceneId,
} from '../lib/appearanceCache';
import { getBootstrappedHeroScene } from '../lib/bootstrapAppearance';

function rgbChannelsToHex(channels, fallback = 0xff5c1a) {
  const parts = String(channels || '')
    .trim()
    .split(/\s+/)
    .map(Number);
  if (parts.length < 3 || parts.some((n) => Number.isNaN(n))) return fallback;
  const [r, g, b] = parts;
  return (r << 16) + (g << 8) + b;
}

function createRenderer(mount, width, height) {
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance',
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(width, height);
  renderer.setClearColor(0x000000, 0);
  mount.appendChild(renderer.domElement);
  return renderer;
}

function disposeObject(obj) {
  obj.traverse((child) => {
    if (child.geometry) child.geometry.dispose();
    if (child.material) {
      if (Array.isArray(child.material)) child.material.forEach((m) => m.dispose());
      else child.material.dispose();
    }
  });
}

function buildCrystal(root, accent, soft) {
  const core = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.15, 1),
    new THREE.MeshBasicMaterial({ color: accent, wireframe: true, transparent: true, opacity: 0.65 })
  );
  root.add(core);
  const inner = new THREE.Mesh(
    new THREE.OctahedronGeometry(0.62, 0),
    new THREE.MeshBasicMaterial({ color: soft, wireframe: true, transparent: true, opacity: 0.5 })
  );
  root.add(inner);
  const rings = [];
  for (let i = 0; i < 3; i++) {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(1.55 + i * 0.38, 0.011, 12, 80),
      new THREE.MeshBasicMaterial({ color: accent, transparent: true, opacity: 0.24 - i * 0.04 })
    );
    ring.rotation.x = Math.PI / 2.2 + i * 0.35;
    ring.rotation.y = i * 0.5;
    root.add(ring);
    rings.push(ring);
  }
  const satellites = [];
  for (let i = 0; i < 8; i++) {
    const mesh = new THREE.Mesh(
      new THREE.TetrahedronGeometry(0.16, 0),
      new THREE.MeshBasicMaterial({ color: accent, wireframe: true, transparent: true, opacity: 0.85 })
    );
    mesh.userData = {
      angle: (i / 8) * Math.PI * 2,
      radius: 2.15 + (i % 3) * 0.18,
      speed: 0.18 + (i % 4) * 0.04,
      yAmp: 0.55 + (i % 2) * 0.25,
    };
    root.add(mesh);
    satellites.push(mesh);
  }
  return {
    update(t, pointer) {
      core.rotation.y = t * 0.55;
      core.rotation.x = t * 0.28;
      inner.rotation.y = -t * 0.85;
      inner.rotation.z = t * 0.4;
      rings.forEach((ring, i) => {
        ring.rotation.z = t * (0.22 + i * 0.08);
        ring.rotation.x = Math.PI / 2.2 + i * 0.35 + Math.sin(t * 0.3 + i) * 0.08;
      });
      satellites.forEach((mesh) => {
        const { angle, radius, speed, yAmp } = mesh.userData;
        const a = angle + t * speed * 1.55;
        mesh.position.set(Math.cos(a) * radius, Math.sin(a * 1.4) * yAmp, Math.sin(a) * radius * 0.45);
        mesh.rotation.x += 0.035;
        mesh.rotation.y += 0.04;
      });
      root.rotation.y = pointer.x * 0.32 + Math.sin(t * 0.25) * 0.1;
      root.rotation.x = pointer.y * 0.18;
    },
  };
}

function buildRibbon(root, accent, soft) {
  const ribbon = new THREE.Mesh(
    new THREE.TorusKnotGeometry(1.05, 0.26, 180, 24, 2, 3),
    new THREE.MeshBasicMaterial({ color: accent, wireframe: true, transparent: true, opacity: 0.58 })
  );
  root.add(ribbon);
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(2.15, 0.014, 16, 100),
    new THREE.MeshBasicMaterial({ color: accent, transparent: true, opacity: 0.28 })
  );
  ring.rotation.x = Math.PI / 2.4;
  root.add(ring);
  const cube = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: soft, wireframe: true, transparent: true, opacity: 0.35 })
  );
  cube.position.set(-1.45, 0.4, -0.5);
  root.add(cube);
  return {
    update(t, pointer) {
      ribbon.rotation.x = t * 0.55;
      ribbon.rotation.y = t * 0.68;
      ribbon.rotation.z = Math.sin(t * 0.4) * 0.15;
      cube.rotation.x = t * 0.4;
      cube.rotation.y = -t * 0.48;
      cube.position.y = 0.4 + Math.sin(t * 0.9) * 0.2;
      ring.rotation.z = t * 0.35;
      ring.scale.setScalar(1 + Math.sin(t * 0.5) * 0.04);
      root.rotation.y = pointer.x * 0.35 + Math.sin(t * 0.3) * 0.12;
      root.rotation.x = pointer.y * 0.18;
    },
  };
}

function buildHelix(root, accent, soft) {
  const segs = 120;
  const turns = 7;
  const height = 4.6;
  const radius = 1.15;

  const makeSpiral = (phase, color, opacity) => {
    const pts = [];
    for (let i = 0; i < segs; i++) {
      const a = (i / segs) * Math.PI * 2 * turns + phase;
      const y = (i / segs) * height - height / 2;
      pts.push(new THREE.Vector3(Math.cos(a) * radius, y, Math.sin(a) * radius));
    }
    const curve = new THREE.CatmullRomCurve3(pts);
    return new THREE.Mesh(
      new THREE.TubeGeometry(curve, 220, 0.038, 8, false),
      new THREE.MeshBasicMaterial({ color, wireframe: true, transparent: true, opacity })
    );
  };

  const tubeA = makeSpiral(0, accent, 0.72);
  const tubeB = makeSpiral(Math.PI, soft, 0.55);
  const tubeC = makeSpiral(Math.PI / 2, accent, 0.28);
  tubeC.scale.setScalar(0.72);
  root.add(tubeA, tubeB, tubeC);

  const rungs = [];
  for (let i = 0; i < 28; i++) {
    const tt = i / 28;
    const a = tt * Math.PI * 2 * turns;
    const y = tt * height - height / 2;
    const rung = new THREE.Mesh(
      new THREE.CylinderGeometry(0.012, 0.012, radius * 2, 6),
      new THREE.MeshBasicMaterial({ color: accent, transparent: true, opacity: 0.35 })
    );
    rung.position.set(0, y, 0);
    rung.rotation.z = Math.PI / 2;
    rung.rotation.y = a;
    root.add(rung);
    rungs.push(rung);
  }

  const nodes = [];
  for (let i = 0; i < 42; i++) {
    const size = 0.05 + (i % 5) * 0.018;
    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry(size, 10, 10),
      new THREE.MeshBasicMaterial({
        color: i % 3 === 0 ? soft : accent,
        transparent: true,
        opacity: 0.92,
      })
    );
    root.add(mesh);
    nodes.push(mesh);
  }

  const extras = [];
  for (let i = 0; i < 12; i++) {
    const geo =
      i % 3 === 0
        ? new THREE.OctahedronGeometry(0.12, 0)
        : i % 3 === 1
          ? new THREE.TetrahedronGeometry(0.14, 0)
          : new THREE.BoxGeometry(0.16, 0.16, 0.16);
    const mesh = new THREE.Mesh(
      geo,
      new THREE.MeshBasicMaterial({ color: accent, wireframe: true, transparent: true, opacity: 0.55 })
    );
    mesh.userData = {
      angle: (i / 12) * Math.PI * 2,
      radius: 1.9 + (i % 4) * 0.2,
      speed: 0.15 + (i % 3) * 0.05,
      y: ((i / 12) * height - height / 2) * 0.85,
    };
    root.add(mesh);
    extras.push(mesh);
  }

  return {
    update(t, pointer) {
      root.rotation.y = t * 0.38 + pointer.x * 0.28;
      root.rotation.x = 0.18 + pointer.y * 0.14;
      tubeA.rotation.y = Math.sin(t * 0.45) * 0.14;
      tubeB.rotation.y = -Math.sin(t * 0.45) * 0.14;
      rungs.forEach((rung, idx) => {
        rung.material.opacity = 0.25 + Math.sin(t * 2.8 + idx * 0.3) * 0.18;
      });
      nodes.forEach((mesh, idx) => {
        const side = idx % 2 === 0 ? 0 : Math.PI;
        const a = t * 1.05 + (idx / nodes.length) * Math.PI * 2 * turns + side;
        let y = (idx / nodes.length) * height - height / 2 + t * 0.55;
        y = ((((y + height / 2) % height) + height) % height) - height / 2;
        mesh.position.set(Math.cos(a) * radius, y, Math.sin(a) * radius);
      });
      extras.forEach((mesh) => {
        const { angle, radius: r, speed, y } = mesh.userData;
        const a = angle + t * speed * 1.6;
        mesh.position.set(Math.cos(a) * r, y + Math.sin(t + angle) * 0.22, Math.sin(a) * r);
        mesh.rotation.x += 0.028;
        mesh.rotation.y += 0.035;
      });
    },
  };
}

function buildPanels(root, accent, soft) {
  const panels = [];
  for (let i = 0; i < 10; i++) {
    const w = 1.1 + (i % 3) * 0.35;
    const h = 0.7 + (i % 2) * 0.45;
    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(w, h, 4, 3),
      new THREE.MeshBasicMaterial({
        color: i % 2 === 0 ? accent : soft,
        wireframe: true,
        transparent: true,
        opacity: 0.55,
        side: THREE.DoubleSide,
      })
    );
    mesh.position.set((i % 3) * 1.15 - 1.15, Math.floor(i / 3) * 1.0 - 1.0, (i % 2) * -0.6);
    mesh.rotation.y = (i - 3) * 0.12;
    mesh.userData = { baseY: mesh.position.y, phase: i * 0.7 };
    root.add(mesh);
    panels.push(mesh);
  }
  const frame = new THREE.Mesh(
    new THREE.BoxGeometry(4.2, 3.2, 0.08),
    new THREE.MeshBasicMaterial({ color: accent, wireframe: true, transparent: true, opacity: 0.25 })
  );
  root.add(frame);
  return {
    update(t, pointer) {
      panels.forEach((mesh) => {
        mesh.position.y = mesh.userData.baseY + Math.sin(t * 1.2 + mesh.userData.phase) * 0.12;
        mesh.rotation.z = Math.sin(t * 0.6 + mesh.userData.phase) * 0.05;
      });
      frame.rotation.y = Math.sin(t * 0.2) * 0.08;
      root.rotation.y = pointer.x * 0.2;
      root.rotation.x = pointer.y * 0.12;
    },
  };
}

function buildOrbs(root, accent, soft) {
  const orbs = [];
  for (let i = 0; i < 16; i++) {
    const size = 0.18 + (i % 4) * 0.08;
    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry(size, 16, 16),
      new THREE.MeshBasicMaterial({
        color: i % 2 === 0 ? accent : soft,
        wireframe: i % 3 !== 0,
        transparent: true,
        opacity: i % 3 === 0 ? 0.35 : 0.7,
      })
    );
    mesh.userData = {
      angle: (i / 16) * Math.PI * 2,
      radius: 0.6 + (i % 5) * 0.35,
      speed: 0.2 + (i % 4) * 0.05,
      yAmp: 0.4 + (i % 3) * 0.25,
    };
    root.add(mesh);
    orbs.push(mesh);
  }
  const core = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.45, 1),
    new THREE.MeshBasicMaterial({ color: accent, wireframe: true, transparent: true, opacity: 0.8 })
  );
  root.add(core);
  return {
    update(t, pointer) {
      core.rotation.y = t * 0.4;
      core.rotation.x = t * 0.2;
      orbs.forEach((mesh) => {
        const { angle, radius, speed, yAmp } = mesh.userData;
        const a = angle + t * speed;
        mesh.position.set(Math.cos(a) * radius, Math.sin(a * 1.3) * yAmp, Math.sin(a) * radius);
      });
      root.rotation.y = pointer.x * 0.2;
      root.rotation.x = pointer.y * 0.1;
    },
  };
}

function buildLattice(root, accent, soft) {
  const nodes = [];
  const count = 18;
  for (let i = 0; i < count; i++) {
    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.07, 10, 10),
      new THREE.MeshBasicMaterial({ color: i % 2 ? soft : accent, transparent: true, opacity: 0.9 })
    );
    mesh.position.set(
      (Math.random() - 0.5) * 3.2,
      (Math.random() - 0.5) * 3.2,
      (Math.random() - 0.5) * 2.4
    );
    mesh.userData = { base: mesh.position.clone(), phase: Math.random() * Math.PI * 2 };
    root.add(mesh);
    nodes.push(mesh);
  }
  const lines = [];
  for (let i = 0; i < count; i++) {
    for (let j = i + 1; j < count; j++) {
      if (nodes[i].position.distanceTo(nodes[j].position) < 1.55) {
        const geo = new THREE.BufferGeometry().setFromPoints([nodes[i].position, nodes[j].position]);
        const line = new THREE.Line(
          geo,
          new THREE.LineBasicMaterial({ color: accent, transparent: true, opacity: 0.28 })
        );
        line.userData = { a: i, b: j };
        root.add(line);
        lines.push(line);
      }
    }
  }
  return {
    update(t, pointer) {
      nodes.forEach((mesh) => {
        const { base, phase } = mesh.userData;
        mesh.position.set(
          base.x + Math.sin(t * 0.7 + phase) * 0.12,
          base.y + Math.cos(t * 0.6 + phase) * 0.12,
          base.z + Math.sin(t * 0.5 + phase) * 0.08
        );
      });
      lines.forEach((line) => {
        const { a, b } = line.userData;
        const arr = line.geometry.attributes.position.array;
        arr[0] = nodes[a].position.x;
        arr[1] = nodes[a].position.y;
        arr[2] = nodes[a].position.z;
        arr[3] = nodes[b].position.x;
        arr[4] = nodes[b].position.y;
        arr[5] = nodes[b].position.z;
        line.geometry.attributes.position.needsUpdate = true;
      });
      root.rotation.y = t * 0.12 + pointer.x * 0.15;
      root.rotation.x = pointer.y * 0.1;
    },
  };
}

function buildTorus(root, accent, soft) {
  const rings = [];
  for (let i = 0; i < 8; i++) {
    const mesh = new THREE.Mesh(
      new THREE.TorusGeometry(0.55 + i * 0.28, 0.02 + (i % 2) * 0.01, 12, 80),
      new THREE.MeshBasicMaterial({
        color: i % 2 ? soft : accent,
        wireframe: true,
        transparent: true,
        opacity: 0.55 - i * 0.04,
      })
    );
    mesh.rotation.x = (i / 8) * Math.PI;
    mesh.rotation.y = i * 0.35;
    mesh.userData = { speed: 0.1 + i * 0.03 };
    root.add(mesh);
    rings.push(mesh);
  }
  const diamond = new THREE.Mesh(
    new THREE.OctahedronGeometry(0.4, 0),
    new THREE.MeshBasicMaterial({ color: accent, wireframe: true, transparent: true, opacity: 0.8 })
  );
  root.add(diamond);
  return {
    update(t, pointer) {
      diamond.rotation.y = t * 0.5;
      diamond.rotation.x = t * 0.3;
      rings.forEach((mesh, i) => {
        mesh.rotation.z = t * mesh.userData.speed;
        mesh.rotation.x = (i / 8) * Math.PI + Math.sin(t * 0.3 + i) * 0.15;
      });
      root.rotation.y = pointer.x * 0.2;
      root.rotation.x = pointer.y * 0.1;
    },
  };
}

function buildConstellation(root, accent, soft) {
  const stars = [];
  for (let i = 0; i < 36; i++) {
    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.04 + (i % 4) * 0.02, 8, 8),
      new THREE.MeshBasicMaterial({
        color: i % 5 === 0 ? soft : accent,
        transparent: true,
        opacity: 0.95,
      })
    );
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = 1.2 + Math.random() * 1.8;
    mesh.position.set(
      r * Math.sin(phi) * Math.cos(theta),
      r * Math.sin(phi) * Math.sin(theta),
      r * Math.cos(phi)
    );
    mesh.userData = { phase: Math.random() * 10 };
    root.add(mesh);
    stars.push(mesh);
  }
  for (let i = 0; i < stars.length; i++) {
    for (let j = i + 1; j < stars.length; j++) {
      if (stars[i].position.distanceTo(stars[j].position) < 1.35) {
        const geo = new THREE.BufferGeometry().setFromPoints([
          stars[i].position.clone(),
          stars[j].position.clone(),
        ]);
        root.add(
          new THREE.Line(
            geo,
            new THREE.LineBasicMaterial({ color: accent, transparent: true, opacity: 0.22 })
          )
        );
      }
    }
  }
  return {
    update(t, pointer) {
      stars.forEach((mesh) => {
        const s = 1 + Math.sin(t * 2 + mesh.userData.phase) * 0.15;
        mesh.scale.setScalar(s);
      });
      root.rotation.y = t * 0.15 + pointer.x * 0.18;
      root.rotation.x = 0.15 + pointer.y * 0.1;
    },
  };
}

function addParticles(root, accent) {
  const count = 160;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 12;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 8;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 8 - 1;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const points = new THREE.Points(
    geo,
    new THREE.PointsMaterial({
      color: accent,
      size: 0.032,
      transparent: true,
      opacity: 0.6,
      sizeAttenuation: true,
    })
  );
  root.add(points);
  return points;
}

const HERO_SCENE_ORDER = [
  'crystal',
  'ribbon',
  'helix',
  'panels',
  'orbs',
  'lattice',
  'torus',
  'constellation',
];

const builders = [
  buildCrystal,
  buildRibbon,
  buildHelix,
  buildPanels,
  buildOrbs,
  buildLattice,
  buildTorus,
  buildConstellation,
];

function resolveSceneIndex(sceneId) {
  if (!sceneId || sceneId === 'random') {
    const pick = resolveRandomSceneId(HERO_SCENE_ORDER);
    const idx = HERO_SCENE_ORDER.indexOf(pick);
    return idx >= 0 ? idx : 0;
  }
  const idx = HERO_SCENE_ORDER.indexOf(sceneId);
  return idx >= 0 ? idx : 0;
}

function normalizeSceneId(sceneId) {
  if (!sceneId || sceneId === 'random') {
    return resolveRandomSceneId(HERO_SCENE_ORDER);
  }
  return HERO_SCENE_ORDER.includes(sceneId) ? sceneId : resolveRandomSceneId(HERO_SCENE_ORDER);
}

export default function HeroScene() {
  const mountRef = useRef(null);
  const { isDark, theme } = useTheme();
  const { isRtl } = useLanguage();
  const { palette, accentKey, loading: brandLoading } = useBrand();
  const [sceneId, setSceneId] = useState(() => {
    const cached = readCachedSceneId();
    return cached ? normalizeSceneId(cached) : null;
  });
  const [sceneReady, setSceneReady] = useState(() => Boolean(readCachedSceneId()));
  const cachedAppearance = useRef(hasCachedAppearance()).current;
  const canBuild = Boolean(sceneReady && sceneId && (!brandLoading || cachedAppearance));

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const data = await getBootstrappedHeroScene();
        if (!alive) return;
        const next = normalizeSceneId(data?.sceneId || 'helix');
        cacheSceneId(data?.sceneId === 'random' ? 'random' : next);
        // Keep concrete id in state so the mesh stays stable; cache stores admin setting.
        setSceneId((prev) => {
          if (data?.sceneId === 'random') {
            // Prefer existing session pick / previous mesh
            return prev || next;
          }
          return next;
        });
      } catch {
        if (alive) {
          setSceneId((prev) => prev || normalizeSceneId('helix'));
        }
      } finally {
        if (alive) setSceneReady(true);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const sceneIndex = useMemo(
    () => (sceneId ? resolveSceneIndex(sceneId) : 0),
    [sceneId]
  );

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount || !canBuild) return;

    let cleanup = () => {};

    try {
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const isMobile = window.matchMedia('(max-width: 767px)').matches;
      const isLarge = window.matchMedia('(min-width: 1280px)').matches;
      const tone = theme === 'light' ? palette?.light : palette?.dark;
      const accent = rgbChannelsToHex(tone?.accent);
      const soft = isDark ? 0x2a2a2a : 0x9a9aa3;
      const fogColor = isDark ? 0x050505 : 0xf4f4f5;
      const width = mount.clientWidth || window.innerWidth;
      const height = mount.clientHeight || window.innerHeight;

      while (mount.firstChild) mount.removeChild(mount.firstChild);

      const scene = new THREE.Scene();
      scene.fog = new THREE.FogExp2(fogColor, isMobile ? 0.022 : isLarge ? 0.02 : 0.028);

      const camera = new THREE.PerspectiveCamera(isMobile ? 42 : isLarge ? 36 : 38, width / height, 0.1, 80);
      camera.position.set(0, isMobile ? 0.05 : 0.1, isMobile ? 7.2 : isLarge ? 7.0 : 8.4);

      const renderer = createRenderer(mount, width, height);

      const root = new THREE.Group();
      root.position.x = isMobile ? 0 : isRtl ? -0.65 : 0.65;
      root.position.y = isMobile ? 0.35 : 0;
      root.scale.setScalar(isMobile ? 1.15 : isLarge ? 1.42 : 1.18);
      scene.add(root);

      const controller = builders[sceneIndex](root, accent, soft);
      const particles = addParticles(root, accent);

      if (isMobile) {
        root.traverse((child) => {
          if (child.material && 'opacity' in child.material) {
            child.material.transparent = true;
            child.material.opacity = Math.min(1, (child.material.opacity || 0.5) + 0.22);
            child.material.needsUpdate = true;
          }
        });
        if (particles.material) {
          particles.material.opacity = 0.9;
          particles.material.size = 0.05;
        }
      }

      let frameId;
      let t = 0;
      const pointer = { x: 0, y: 0 };
      const onPointer = (e) => {
        pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
        pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
      };
      window.addEventListener('pointermove', onPointer);

      const onResize = () => {
        const w = mount.clientWidth;
        const h = mount.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };
      window.addEventListener('resize', onResize);

      const animate = () => {
        frameId = requestAnimationFrame(animate);
        if (!prefersReduced) {
          // Snappier motion — shapes feel more alive without going chaotic
          t += isMobile ? 0.014 : 0.018;
          controller.update(t, pointer);
          particles.rotation.y = t * 0.06;
          particles.rotation.x = Math.sin(t * 0.2) * 0.08;
          root.position.y = (isMobile ? 0.35 : 0) + Math.sin(t * 0.55) * 0.12;
          root.rotation.z = Math.sin(t * 0.22) * 0.04;
        }
        renderer.render(scene, camera);
      };
      animate();

      cleanup = () => {
        cancelAnimationFrame(frameId);
        window.removeEventListener('resize', onResize);
        window.removeEventListener('pointermove', onPointer);
        disposeObject(root);
        renderer.dispose();
        if (renderer.domElement.parentNode === mount) {
          mount.removeChild(renderer.domElement);
        }
      };
    } catch (err) {
      console.warn('[HeroScene] skipped (WebGL unavailable):', err?.message || err);
      while (mount.firstChild) mount.removeChild(mount.firstChild);
    }

    return () => cleanup();
  }, [isDark, isRtl, sceneIndex, theme, accentKey, canBuild, sceneId, palette]);

  return (
    <div
      className="hero-scene-wrap pointer-events-none absolute inset-0 z-0 md:inset-y-0 md:end-0 md:start-auto md:w-[62%] lg:w-[64%] xl:w-[70%]"
      data-hero-scene={sceneId || 'pending'}
      aria-hidden="true"
    >
      <div ref={mountRef} className="absolute inset-0" />
    </div>
  );
}
