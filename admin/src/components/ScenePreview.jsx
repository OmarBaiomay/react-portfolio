import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * Live WebGL mini-scenes matching client HeroScene geometries.
 * Keeps the renderer alive for the card lifetime; only pauses the
 * animation loop when off-screen (disposing on scroll caused black cards).
 */
const ScenePreview = ({ sceneId: sceneIdProp, id }) => {
  const sceneId = sceneIdProp || id || 'crystal';
  const mountRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    const canvas = canvasRef.current;
    if (!mount || !canvas) return undefined;

    let renderer;
    let scene;
    let camera;
    let group;
    let frameId = 0;
    let running = false;
    let visible = false;
    let disposed = false;

    const accent = 0xb794f6;
    const muted = 0x666666;

    const wire = (g, geometry, color, opacity = 0.85) => {
      const mesh = new THREE.Mesh(
        geometry,
        new THREE.MeshBasicMaterial({
          color,
          wireframe: true,
          transparent: true,
          opacity,
        }),
      );
      g.add(mesh);
      return mesh;
    };

    const buildGroup = (sid) => {
      const g = new THREE.Group();

      switch (sid) {
        case 'ribbon': {
          wire(g, new THREE.TorusKnotGeometry(0.7, 0.17, 100, 14, 2, 3), accent, 0.9);
          const cube = wire(g, new THREE.BoxGeometry(0.5, 0.5, 0.5), muted, 0.45);
          cube.position.set(-0.95, 0.25, -0.3);
          const ring = new THREE.Mesh(
            new THREE.TorusGeometry(1.15, 0.012, 8, 64),
            new THREE.MeshBasicMaterial({ color: accent, transparent: true, opacity: 0.35 }),
          );
          ring.rotation.x = Math.PI / 2.4;
          g.add(ring);
          break;
        }
        case 'helix': {
          const makeCurve = (phase) =>
            new THREE.CatmullRomCurve3(
              Array.from({ length: 36 }, (_, i) => {
                const t = i / 35;
                const a = t * Math.PI * 6 + phase;
                return new THREE.Vector3(Math.cos(a) * 0.55, (t - 0.5) * 2.0, Math.sin(a) * 0.55);
              }),
            );
          wire(g, new THREE.TubeGeometry(makeCurve(0), 100, 0.045, 8, false), accent, 0.9);
          wire(g, new THREE.TubeGeometry(makeCurve(Math.PI), 100, 0.035, 8, false), muted, 0.55);
          break;
        }
        case 'crystal':
          wire(g, new THREE.OctahedronGeometry(0.85, 0), accent, 0.9);
          wire(g, new THREE.IcosahedronGeometry(0.5, 0), muted, 0.4).position.set(0.7, -0.35, 0.2);
          break;
        case 'panels': {
          for (let i = 0; i < 5; i += 1) {
            const p = wire(g, new THREE.PlaneGeometry(0.7, 1.0), i % 2 ? accent : muted, 0.55);
            p.position.set((i - 2) * 0.35, Math.sin(i) * 0.15, -i * 0.12);
            p.rotation.y = (i - 2) * 0.22;
          }
          break;
        }
        case 'orbs':
          wire(g, new THREE.IcosahedronGeometry(0.55, 1), accent, 0.9);
          wire(g, new THREE.IcosahedronGeometry(0.28, 1), muted, 0.5).position.set(0.75, 0.35, 0.2);
          wire(g, new THREE.IcosahedronGeometry(0.22, 1), muted, 0.45).position.set(-0.7, -0.25, 0.15);
          break;
        case 'lattice': {
          g.add(
            new THREE.LineSegments(
              new THREE.EdgesGeometry(new THREE.BoxGeometry(1.4, 1.4, 1.4)),
              new THREE.LineBasicMaterial({ color: accent, transparent: true, opacity: 0.75 }),
            ),
          );
          for (let i = 0; i < 8; i += 1) {
            const n = wire(g, new THREE.BoxGeometry(0.18, 0.18, 0.18), i % 2 ? accent : muted, 0.7);
            const a = (i / 8) * Math.PI * 2;
            n.position.set(Math.cos(a) * 0.75, Math.sin(a * 1.5) * 0.4, Math.sin(a) * 0.75);
          }
          break;
        }
        case 'torus':
          wire(g, new THREE.TorusGeometry(0.7, 0.28, 16, 48), accent, 0.9);
          wire(g, new THREE.TorusGeometry(0.4, 0.1, 12, 32), muted, 0.45).rotation.x = Math.PI / 2;
          break;
        case 'constellation': {
          const pts = Array.from({ length: 24 }, () =>
            new THREE.Vector3(
              (Math.random() - 0.5) * 2,
              (Math.random() - 0.5) * 1.4,
              (Math.random() - 0.5) * 1.2,
            ),
          );
          g.add(
            new THREE.Points(
              new THREE.BufferGeometry().setFromPoints(pts),
              new THREE.PointsMaterial({ color: accent, size: 0.07, transparent: true, opacity: 0.95 }),
            ),
          );
          const lines = [];
          for (let i = 0; i < pts.length - 1; i += 1) {
            if (pts[i].distanceTo(pts[i + 1]) < 0.85) lines.push(pts[i], pts[i + 1]);
          }
          if (lines.length) {
            g.add(
              new THREE.LineSegments(
                new THREE.BufferGeometry().setFromPoints(lines),
                new THREE.LineBasicMaterial({ color: muted, transparent: true, opacity: 0.5 }),
              ),
            );
          }
          break;
        }
        default:
          wire(g, new THREE.IcosahedronGeometry(0.7, 0), accent, 0.9);
          wire(g, new THREE.BoxGeometry(0.4, 0.4, 0.4), muted, 0.4).position.set(0.7, -0.3, 0);
      }

      return g;
    };

    const resize = () => {
      if (!renderer || !camera || !mount) return;
      const w = Math.max(mount.clientWidth, 1);
      const h = Math.max(mount.clientHeight, 1);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    };

    const tick = () => {
      if (disposed || !renderer || !group) return;
      if (visible) {
        group.rotation.y += 0.01;
        group.rotation.x = Math.sin(performance.now() * 0.00045) * 0.14;
        renderer.render(scene, camera);
      }
      frameId = requestAnimationFrame(tick);
    };

    const init = () => {
      if (disposed || running) return;
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      if (w < 2 || h < 2) return;

      try {
        renderer = new THREE.WebGLRenderer({
          canvas,
          antialias: true,
          alpha: true,
          powerPreference: 'low-power',
          failIfMajorPerformanceCaveat: false,
        });
      } catch (err) {
        console.warn('[ScenePreview] WebGL failed:', err);
        return;
      }

      running = true;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
      renderer.setClearColor(0x000000, 0);
      renderer.setSize(w, h, false);

      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(40, w / h, 0.1, 50);
      camera.position.set(0, 0.12, 3.0);

      group = buildGroup(sceneId);
      scene.add(group);

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(tick);
    };

    const tryInit = () => {
      if (disposed || running || !visible) return;
      init();
    };

    const ro = new ResizeObserver(() => {
      if (running) resize();
      else tryInit();
    });
    ro.observe(mount);

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) tryInit();
        if (visible && renderer && scene && camera) {
          renderer.render(scene, camera);
        }
      },
      { root: null, rootMargin: '200px', threshold: 0 },
    );
    io.observe(mount);

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      ro.disconnect();
      io.disconnect();
      if (group) {
        group.traverse((obj) => {
          if (obj.geometry) obj.geometry.dispose();
          if (obj.material) {
            if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
            else obj.material.dispose();
          }
        });
      }
      if (renderer) {
        renderer.dispose();
        renderer = null;
      }
    };
  }, [sceneId]);

  return (
    <div
      ref={mountRef}
      className="relative aspect-[16/10] w-full overflow-hidden"
      style={{
        background:
          'radial-gradient(ellipse at center, rgba(183,148,246,0.16), transparent 68%)',
      }}
    >
      <canvas
        ref={canvasRef}
        className="block h-full w-full"
        style={{ display: 'block', width: '100%', height: '100%' }}
      />
    </div>
  );
};

export default ScenePreview;
