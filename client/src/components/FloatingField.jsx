import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useTheme } from '../context/ThemeContext';
import { useBrand } from '../context/BrandContext';
import { hasCachedAppearance } from '../lib/appearanceCache';

function rgbChannelsToHex(channels, fallback = 0xffffff) {
  const parts = String(channels || '')
    .trim()
    .split(/\s+/)
    .map(Number);
  if (parts.length < 3 || parts.some((n) => Number.isNaN(n))) return fallback;
  const [r, g, b] = parts;
  return (r << 16) + (g << 8) + b;
}

/**
 * Fixed full-viewport floating cubes — camera Y driven by parent via setScrollProgress.
 */
export default function FloatingField({ scrollProgressRef }) {
  const mountRef = useRef(null);
  const apiRef = useRef({ progress: 0 });
  const { isDark, theme } = useTheme();
  const { palette, accentKey, loading: brandLoading } = useBrand();
  const cachedAppearance = useRef(hasCachedAppearance()).current;

  useEffect(() => {
    if (scrollProgressRef) {
      scrollProgressRef.current = (progress) => {
        apiRef.current.progress = progress;
      };
    }
  }, [scrollProgressRef]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    if (brandLoading && !cachedAppearance) return undefined;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return undefined;

    const tone = theme === 'light' ? palette?.light : palette?.dark;
    const accent = rgbChannelsToHex(tone?.accent, 0xff5c1a);
    const soft = isDark ? 0x2a2a2a : 0xc4c4c8;

    while (mount.firstChild) mount.removeChild(mount.firstChild);

    const width = mount.clientWidth || window.innerWidth;
    const height = mount.clientHeight || window.innerHeight;

    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 5);

    const scene = new THREE.Scene();
    scene.add(new THREE.AmbientLight(0xffffff, isDark ? 0.18 : 0.35));
    const dir = new THREE.DirectionalLight(0xffffff, isDark ? 0.55 : 0.7);
    dir.position.set(5, 3, 2);
    scene.add(dir);

    const boxGeom = new THREE.BoxGeometry(2, 2, 2);
    const materials = [
      new THREE.MeshLambertMaterial({ color: accent }),
      new THREE.MeshLambertMaterial({ color: soft }),
    ];

    const meshes = [];
    const count = window.matchMedia('(max-width: 767px)').matches ? 22 : 40;
    for (let i = 0; i < count; i += 1) {
      const mesh = new THREE.Mesh(boxGeom, materials[i % 2]);
      mesh.position.set(
        3.2 * (Math.random() * 2 - 1),
        14 * (Math.random() * 2 - 1),
        4 * (Math.random() * 2 - 1)
      );
      mesh.rotation.y = Math.PI * Math.random();
      mesh.userData.rotationSpeed = Math.random() * 0.01 + 0.004;
      scene.add(mesh);
      meshes.push(mesh);
    }

    const clock = new THREE.Clock();
    let frame = 0;
    let alive = true;

    const onResize = () => {
      const w = mount.clientWidth || window.innerWidth;
      const h = mount.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    const tick = () => {
      if (!alive) return;
      const time = clock.getElapsedTime();
      const amplitude = 0.05;
      const period = 8;
      const baseScale = 0.2;
      const scale = baseScale + amplitude * Math.sin(Math.PI * 2 * (time / period));

      meshes.forEach((mesh) => {
        mesh.scale.setScalar(scale);
        mesh.rotation.x += mesh.userData.rotationSpeed;
      });

      const cameraRange = 10;
      const progress = apiRef.current.progress;
      camera.position.y = (1 - progress) * cameraRange + progress * -cameraRange;

      renderer.render(scene, camera);
      frame = window.requestAnimationFrame(tick);
    };

    mount.classList.add('is-ready');
    tick();

    return () => {
      alive = false;
      window.cancelAnimationFrame(frame);
      window.removeEventListener('resize', onResize);
      mount.classList.remove('is-ready');
      meshes.forEach((mesh) => scene.remove(mesh));
      boxGeom.dispose();
      materials.forEach((m) => m.dispose());
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [isDark, theme, accentKey, brandLoading, cachedAppearance, palette]);

  return (
    <div
      ref={mountRef}
      data-floating-field
      className="pointer-events-none absolute inset-0 z-0"
      aria-hidden="true"
    />
  );
}
