import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

const SCENE_COUNT = 4;

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

/** Crystal core + rings + satellites */
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
      new THREE.MeshBasicMaterial({
        color: accent,
        transparent: true,
        opacity: 0.24 - i * 0.04,
      })
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
      core.rotation.y = t * 0.35;
      core.rotation.x = t * 0.18;
      inner.rotation.y = -t * 0.55;
      inner.rotation.z = t * 0.25;
      rings.forEach((ring, i) => {
        ring.rotation.z = t * (0.12 + i * 0.05);
      });
      satellites.forEach((mesh) => {
        const { angle, radius, speed, yAmp } = mesh.userData;
        const a = angle + t * speed;
        mesh.position.set(Math.cos(a) * radius, Math.sin(a * 1.4) * yAmp, Math.sin(a) * radius * 0.45);
        mesh.rotation.x += 0.02;
        mesh.rotation.y += 0.025;
      });
      root.rotation.y = pointer.x * 0.18 + Math.sin(t * 0.15) * 0.06;
      root.rotation.x = pointer.y * 0.1;
    },
  };
}

/** Classic ribbon / torus knot */
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
      ribbon.rotation.x = t * 0.35;
      ribbon.rotation.y = t * 0.42;
      cube.rotation.x = t * 0.25;
      cube.rotation.y = -t * 0.3;
      ring.rotation.z = t * 0.2;
      root.rotation.y = pointer.x * 0.22 + Math.sin(t * 0.2) * 0.08;
      root.rotation.x = pointer.y * 0.1;
    },
  };
}

/** DNA / helix twin spirals */
function buildHelix(root, accent, soft) {
  const pointsA = [];
  const pointsB = [];
  for (let i = 0; i < 80; i++) {
    const a = (i / 80) * Math.PI * 6;
    const y = (i / 80) * 4.2 - 2.1;
    pointsA.push(new THREE.Vector3(Math.cos(a) * 1.1, y, Math.sin(a) * 1.1));
    pointsB.push(new THREE.Vector3(Math.cos(a + Math.PI) * 1.1, y, Math.sin(a + Math.PI) * 1.1));
  }

  const curveA = new THREE.CatmullRomCurve3(pointsA);
  const curveB = new THREE.CatmullRomCurve3(pointsB);
  const tubeA = new THREE.Mesh(
    new THREE.TubeGeometry(curveA, 160, 0.045, 8, false),
    new THREE.MeshBasicMaterial({ color: accent, wireframe: true, transparent: true, opacity: 0.7 })
  );
  const tubeB = new THREE.Mesh(
    new THREE.TubeGeometry(curveB, 160, 0.045, 8, false),
    new THREE.MeshBasicMaterial({ color: soft, wireframe: true, transparent: true, opacity: 0.55 })
  );
  root.add(tubeA, tubeB);

  const nodes = [];
  for (let i = 0; i < 18; i++) {
    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.08, 10, 10),
      new THREE.MeshBasicMaterial({ color: accent, transparent: true, opacity: 0.9 })
    );
    mesh.userData = { i };
    root.add(mesh);
    nodes.push(mesh);
  }

  return {
    update(t, pointer) {
      root.rotation.y = t * 0.25 + pointer.x * 0.15;
      root.rotation.x = 0.2 + pointer.y * 0.08;
      tubeA.rotation.y = Math.sin(t * 0.3) * 0.1;
      tubeB.rotation.y = -Math.sin(t * 0.3) * 0.1;
      nodes.forEach((mesh, idx) => {
        const a = t * 0.8 + (idx / 18) * Math.PI * 2;
        let y = (idx / 18) * 4.2 - 2.1 + t * 0.4;
        y = ((((y + 2.1) % 4.2) + 4.2) % 4.2) - 2.1;
        const side = idx % 2 === 0 ? 1 : -1;
        mesh.position.set(Math.cos(a) * 1.1 * side, y, Math.sin(a) * 1.1);
      });
    },
  };
}

/** Floating grid panels / dashboard shards */
function buildPanels(root, accent, soft) {
  const panels = [];
  for (let i = 0; i < 7; i++) {
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
    mesh.position.set(
      (i % 3) * 1.15 - 1.15,
      Math.floor(i / 3) * 1.1 - 0.7,
      (i % 2) * -0.6
    );
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

function addParticles(root, accent) {
  const count = 100;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 10;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 6;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 6 - 1;
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

const builders = [buildCrystal, buildRibbon, buildHelix, buildPanels];

export default function HeroScene() {
  const mountRef = useRef(null);
  const { isDark } = useTheme();
  const { isRtl } = useLanguage();

  const sceneIndex = useMemo(() => Math.floor(Math.random() * SCENE_COUNT), []);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let cleanup = () => {};

    try {
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const isMobile = window.matchMedia('(max-width: 767px)').matches;
      const accent = 0xff5c1a;
      const soft = isDark ? 0x2a2a2a : 0x9a9aa3;
      const fogColor = isDark ? 0x050505 : 0xf4f4f5;

      const width = mount.clientWidth || window.innerWidth;
      const height = mount.clientHeight || window.innerHeight;

      // Avoid leftover canvases from HMR / StrictMode
      while (mount.firstChild) mount.removeChild(mount.firstChild);

      const scene = new THREE.Scene();
      // Lighter fog on phones so the wireframe stays readable
      scene.fog = new THREE.FogExp2(fogColor, isMobile ? 0.022 : 0.028);

      const camera = new THREE.PerspectiveCamera(isMobile ? 42 : 38, width / height, 0.1, 80);
      camera.position.set(0, isMobile ? 0.05 : 0.1, isMobile ? 7.2 : 9.2);

      const renderer = createRenderer(mount, width, height);

      const root = new THREE.Group();
      root.position.x = isMobile ? 0 : isRtl ? -0.55 : 0.55;
      root.position.y = isMobile ? 0.35 : 0;
      root.scale.setScalar(isMobile ? 1.15 : 1.02);
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
          t += 0.009;
          controller.update(t, pointer);
          particles.rotation.y = t * 0.035;
        }
        renderer.render(scene, camera);
      };
      animate();

      if (import.meta.env.DEV) {
        console.info(`[HeroScene] variant ${sceneIndex + 1}/${SCENE_COUNT}`);
      }

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
  }, [isDark, isRtl, sceneIndex]);

  return (
    <div
      className="hero-scene-wrap pointer-events-none absolute inset-0 z-0 md:inset-y-0 md:end-0 md:start-auto md:w-[56%] lg:w-[54%]"
      data-hero-scene={sceneIndex}
      aria-hidden="true"
    >
      <div ref={mountRef} className="absolute inset-0" />
    </div>
  );
}
