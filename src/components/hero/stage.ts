import * as T from "three";

/**
 * The 3D hero stage: one WebGL canvas, four procedural pieces (one per slide).
 * These are stylised "similar products" that lead to real stock; swap any builder
 * for a GLB from Blender later (GLTFLoader) without touching the page.
 */

type Anim = (m: T.Object3D, t: number, spin: number, whip: number) => void;
interface Piece extends T.Group {
  userData: { s: number; anim: Anim };
}

export interface HeroStage {
  show(i: number): void;
  setAutoSpin(on: boolean): void;
  dispose(): void;
}

interface Mats {
  gold: T.MeshPhysicalMaterial;
  ruby: T.MeshPhysicalMaterial;
  emerald: T.MeshPhysicalMaterial;
  kundan: T.MeshPhysicalMaterial;
  pearl: T.MeshPhysicalMaterial;
  fabric: T.MeshPhysicalMaterial;
}

function envScene() {
  const s = new T.Scene();
  s.add(new T.Mesh(new T.BoxGeometry(12, 12, 12), new T.MeshBasicMaterial({ color: 0x4a3a3c, side: T.BackSide })));
  const panel = (w: number, h: number, pos: [number, number, number], rot: [number, number], k: number, col = 0xffffff) => {
    const m = new T.Mesh(
      new T.PlaneGeometry(w, h),
      new T.MeshBasicMaterial({ color: new T.Color(col).multiplyScalar(k), side: T.DoubleSide }),
    );
    m.position.set(...pos);
    m.rotation.set(rot[0], rot[1], 0);
    s.add(m);
  };
  panel(8, 2.5, [0, 5.9, 0], [Math.PI / 2, 0], 7);
  panel(2.5, 7, [-5.9, 0.5, 0], [0, Math.PI / 2], 3.5);
  panel(2, 6, [5.9, 0, 1.5], [0, -Math.PI / 2], 2.6, 0xffe2c4);
  panel(5, 3, [0, 1, -5.9], [0, 0], 1.8);
  panel(9, 5, [0, 0.5, 5.9], [0, Math.PI], 2.2, 0xffe8d6); // big warm softbox behind the camera: faces read gold, not brown
  panel(6, 1, [0, -5.9, 0], [-Math.PI / 2, 0], 0.6);
  return s;
}

function materials(): Mats {
  const gem = (hex: number) =>
    new T.MeshPhysicalMaterial({
      color: hex,
      emissive: new T.Color(hex).multiplyScalar(0.12),
      metalness: 0,
      roughness: 0.05,
      clearcoat: 1,
      clearcoatRoughness: 0.03,
      ior: 1.75,
      specularIntensity: 1,
    });
  return {
    gold: new T.MeshPhysicalMaterial({ color: 0xe8b45a, metalness: 1, roughness: 0.2, clearcoat: 0.35, clearcoatRoughness: 0.15, side: T.DoubleSide }),
    ruby: gem(0xb3123a),
    emerald: gem(0x0b7a4e),
    kundan: new T.MeshPhysicalMaterial({ color: 0xffffff, metalness: 0.05, roughness: 0.03, clearcoat: 1, ior: 2.1, specularIntensity: 1 }),
    pearl: new T.MeshPhysicalMaterial({ color: 0xf6efe4, roughness: 0.25, clearcoat: 0.8, clearcoatRoughness: 0.2, sheen: 1, sheenColor: new T.Color(0xffe4ef), sheenRoughness: 0.4 }),
    fabric: new T.MeshPhysicalMaterial({ color: 0xc2185b, roughness: 0.75, sheen: 1, sheenColor: new T.Color(0xff9cc4), sheenRoughness: 0.5, side: T.DoubleSide }),
  };
}

const mesh = (g: T.BufferGeometry, m: T.Material) => new T.Mesh(g, m);
const v3 = (p: number[]) => new T.Vector3(p[0], p[1], p[2] ?? 0);

/* 01 Anti-tarnish clover pendant on a snake chain */
function clover(M: Mats): Piece {
  const g = new T.Group() as Piece;
  const r = 0.3024;
  const shape = new T.Shape();
  for (let k = 0; k < 4; k++) {
    const a = Math.PI / 4 + (k * Math.PI) / 2;
    shape.absarc(Math.cos(a) * r, Math.sin(a) * r, r, a - Math.PI / 2, a + Math.PI / 2, false);
  }
  const geo = new T.ExtrudeGeometry(shape, { depth: 0.1, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.05, bevelSegments: 5, curveSegments: 40 });
  geo.center();
  const leaf = mesh(geo, M.gold);
  leaf.rotation.z = Math.PI / 4;
  g.add(leaf);
  const ring = mesh(new T.TorusGeometry(0.14, 0.03, 16, 48), M.gold);
  ring.position.z = 0.11;
  g.add(ring);
  const stone = mesh(new T.SphereGeometry(0.12, 32, 24), M.emerald);
  stone.scale.set(1, 1, 0.55);
  stone.position.z = 0.12;
  g.add(stone);
  const bail = mesh(new T.TorusGeometry(0.11, 0.035, 16, 40), M.gold);
  bail.rotation.y = Math.PI / 2;
  bail.position.y = 0.72;
  g.add(bail);
  const pts = [[-1.5, 3.4, -0.5], [-1.0, 2.2, -0.2], [-0.45, 1.25, 0], [0, 0.82, 0], [0.45, 1.25, 0], [1.0, 2.2, -0.2], [1.5, 3.4, -0.5]].map(v3);
  g.add(mesh(new T.TubeGeometry(new T.CatmullRomCurve3(pts), 240, 0.045, 14, false), M.gold));
  g.userData = {
    s: 1.25,
    anim: (m, t, spin, whip) => {
      m.rotation.y = Math.sin(spin * 0.9) * 0.75 + whip;
      m.rotation.z = Math.sin(t * 1.3) * 0.04;
      m.position.y = -0.35 + Math.sin(t * 1.6) * 0.05;
    },
  };
  return g;
}

/* 02 Kashmiri kundan jhumkas */
function jhumka(M: Mats, gemMat: T.Material) {
  const g = new T.Group();
  const hook = mesh(new T.TorusGeometry(0.16, 0.025, 12, 48, Math.PI * 1.25), M.gold);
  hook.position.set(0.05, 1.12, 0);
  hook.rotation.z = -0.25;
  g.add(hook);
  const stud = mesh(new T.CylinderGeometry(0.33, 0.33, 0.08, 48), M.gold);
  stud.rotation.x = Math.PI / 2;
  stud.position.y = 0.78;
  g.add(stud);
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    const kd = mesh(new T.SphereGeometry(0.055, 16, 12), M.kundan);
    kd.position.set(Math.cos(a) * 0.25, 0.78 + Math.sin(a) * 0.25, 0.05);
    g.add(kd);
  }
  const cg = mesh(new T.SphereGeometry(0.13, 32, 24), gemMat);
  cg.scale.set(1, 1.15, 0.55);
  cg.position.set(0, 0.78, 0.07);
  g.add(cg);
  const link = mesh(new T.SphereGeometry(0.06, 16, 12), M.gold);
  link.position.y = 0.43;
  g.add(link);
  const prof = [[0.03, 0.4], [0.12, 0.37], [0.22, 0.29], [0.31, 0.14], [0.39, -0.03], [0.45, -0.16], [0.47, -0.21]].map((p) => new T.Vector2(p[0], p[1]));
  g.add(mesh(new T.LatheGeometry(prof, 64), M.gold));
  const band = mesh(new T.TorusGeometry(0.34, 0.025, 12, 64), M.gold);
  band.rotation.x = Math.PI / 2;
  band.position.y = 0.1;
  g.add(band);
  const rim = mesh(new T.TorusGeometry(0.47, 0.032, 12, 72), M.gold);
  rim.rotation.x = Math.PI / 2;
  rim.position.y = -0.21;
  g.add(rim);
  for (let j = 0; j < 10; j++) {
    const b = (j / 10) * Math.PI * 2;
    const dk = mesh(new T.SphereGeometry(0.04, 12, 10), M.kundan);
    dk.position.set(Math.cos(b) * 0.36, 0, Math.sin(b) * 0.36);
    g.add(dk);
  }
  for (let n = 0; n < 16; n++) {
    const c = (n / 16) * Math.PI * 2;
    const x = Math.cos(c) * 0.46;
    const z = Math.sin(c) * 0.46;
    const bead = mesh(new T.SphereGeometry(0.045, 14, 10), gemMat);
    bead.position.set(x, -0.31, z);
    g.add(bead);
    const pearl = mesh(new T.SphereGeometry(0.052, 16, 12), M.pearl);
    pearl.position.set(x, -0.43, z);
    g.add(pearl);
  }
  const drop = mesh(new T.SphereGeometry(0.09, 20, 16), M.pearl);
  drop.scale.set(1, 1.3, 1);
  drop.position.y = -0.36;
  g.add(drop);
  return g;
}

function jhumkas(M: Mats): Piece {
  const g = new T.Group() as Piece;
  const L = jhumka(M, M.ruby);
  const R = jhumka(M, M.emerald);
  const pL = new T.Group();
  const pR = new T.Group();
  L.position.y = -1.12;
  R.position.y = -1.12;
  pL.add(L);
  pR.add(R);
  pL.position.set(-0.85, 1.12, 0);
  pR.position.set(0.85, 1.12, 0);
  g.add(pL, pR);
  g.position.y = -0.55;
  g.userData = {
    s: 1.3,
    anim: (m, t, spin, whip) => {
      m.rotation.y = Math.sin(spin * 0.8) * 0.55 + whip;
      pL.rotation.z = Math.sin(t * 2.1) * 0.09;
      pR.rotation.z = Math.sin(t * 2.1 + 1.4) * 0.09;
      L.rotation.y = t * 0.6;
      R.rotation.y = -t * 0.6;
    },
  };
  return g;
}

/* 03 Rajwadi hasli */
function hasli(M: Mats): Piece {
  const g = new T.Group() as Piece;
  const arc = Math.PI * 1.15;
  const R = 1.3;
  const collar = new T.Group();
  const torus = mesh(new T.TorusGeometry(R, 0.11, 28, 180, arc), M.gold);
  torus.scale.set(1, 1, 0.55);
  collar.add(torus);
  collar.rotation.z = -Math.PI / 2 - arc / 2;
  for (const a of [0, arc]) {
    const cap = mesh(new T.SphereGeometry(0.15, 24, 16), M.gold);
    cap.position.set(Math.cos(a) * R, Math.sin(a) * R, 0);
    collar.add(cap);
  }
  const n = 11;
  for (let i = 1; i < n; i++) {
    const a = (i / n) * arc;
    if (Math.abs(a - arc / 2) < 0.05) continue;
    const bez = mesh(new T.TorusGeometry(0.095, 0.022, 10, 32), M.gold);
    const st = mesh(new T.SphereGeometry(0.085, 24, 16), i % 2 ? M.ruby : M.emerald);
    st.scale.set(1, 1, 0.55);
    const px = Math.cos(a) * R;
    const py = Math.sin(a) * R;
    bez.position.set(px, py, 0.07);
    st.position.set(px, py, 0.08);
    collar.add(bez, st);
  }
  g.add(collar);
  const pend = new T.Group();
  const back = mesh(new T.CylinderGeometry(0.27, 0.27, 0.07, 8), M.gold);
  back.rotation.set(Math.PI / 2, Math.PI / 8, 0);
  pend.add(back);
  const big = mesh(new T.CylinderGeometry(0.2, 0.22, 0.09, 8), M.ruby);
  big.rotation.set(Math.PI / 2, Math.PI / 8, 0);
  big.position.z = 0.05;
  pend.add(big);
  for (let k = 0; k < 8; k++) {
    const b = (k / 8) * Math.PI * 2 + Math.PI / 8;
    const kd = mesh(new T.SphereGeometry(0.04, 12, 10), M.kundan);
    kd.position.set(Math.cos(b) * 0.31, Math.sin(b) * 0.31, 0.03);
    pend.add(kd);
  }
  const tear = mesh(new T.SphereGeometry(0.15, 28, 20), M.emerald);
  tear.scale.set(0.75, 1.1, 0.5);
  tear.position.set(0, -0.48, 0.03);
  pend.add(tear);
  const tearB = mesh(new T.TorusGeometry(0.15, 0.02, 10, 40), M.gold);
  tearB.scale.set(0.8, 1.15, 1);
  tearB.position.set(0, -0.48, 0.02);
  pend.add(tearB);
  for (let p = -2; p <= 2; p++) {
    const pr = mesh(new T.SphereGeometry(0.06, 16, 12), M.pearl);
    pr.position.set(p * 0.13, -0.78 + Math.abs(p) * 0.06, 0);
    pend.add(pr);
  }
  pend.position.set(0, -R - 0.28, 0.02);
  g.add(pend);
  g.position.y = 0.45;
  g.userData = {
    s: 1.05,
    anim: (m, t, spin, whip) => {
      m.rotation.y = Math.sin(spin * 0.8) * 0.6 + whip;
      m.rotation.x = -0.28;
      pend.rotation.z = Math.sin(t * 1.8) * 0.05;
    },
  };
  return g;
}

/* 04 Kurti on a hanger */
function kurti(M: Mats): Piece {
  const g = new T.Group() as Piece;
  const s = new T.Shape();
  s.moveTo(-0.3, 1.6);
  s.lineTo(-0.78, 1.5);
  s.lineTo(-1.28, 0.98);
  s.lineTo(-1.06, 0.74);
  s.lineTo(-0.72, 1.0);
  s.quadraticCurveTo(-0.6, 0.4, -0.66, 0.15);
  s.quadraticCurveTo(-0.95, -0.8, -1.2, -1.6);
  s.quadraticCurveTo(0, -1.78, 1.2, -1.6);
  s.quadraticCurveTo(0.95, -0.8, 0.66, 0.15);
  s.quadraticCurveTo(0.6, 0.4, 0.72, 1.0);
  s.lineTo(1.06, 0.74);
  s.lineTo(1.28, 0.98);
  s.lineTo(0.78, 1.5);
  s.lineTo(0.3, 1.6);
  s.lineTo(0, 1.12);
  s.lineTo(-0.3, 1.6);
  g.add(mesh(new T.ExtrudeGeometry(s, { depth: 0.06, bevelEnabled: true, bevelThickness: 0.03, bevelSize: 0.03, bevelSegments: 3, curveSegments: 24 }), M.fabric));
  const trim = (points: number[][], rad = 0.035) =>
    mesh(new T.TubeGeometry(new T.CatmullRomCurve3(points.map((p) => new T.Vector3(p[0], p[1], 0.1))), 120, rad, 10, false), M.gold);
  g.add(trim([[-1.16, -1.5], [-0.6, -1.6], [0, -1.64], [0.6, -1.6], [1.16, -1.5]]));
  g.add(trim([[-1.18, -1.36], [-0.6, -1.45], [0, -1.49], [0.6, -1.45], [1.18, -1.36]], 0.018));
  g.add(trim([[-0.27, 1.55], [-0.12, 1.32], [0, 1.18], [0.12, 1.32], [0.27, 1.55]]));
  g.add(trim([[-1.24, 0.94], [-1.15, 0.85], [-1.07, 0.78]], 0.03));
  g.add(trim([[1.24, 0.94], [1.15, 0.85], [1.07, 0.78]], 0.03));
  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 5; c++) {
      const y = 0.75 - r * 0.42;
      const spread = 0.5 + (0.75 - y) * 0.18;
      const dot = mesh(new T.SphereGeometry(0.035, 10, 8), M.gold);
      dot.scale.z = 0.5;
      dot.position.set((c - 2) * spread * 0.42 + (r % 2 ? 0.1 : -0.1), y, 0.1);
      g.add(dot);
    }
  }
  const hanger = [[-0.9, 1.52], [-0.45, 1.75], [0, 1.95], [0.45, 1.75], [0.9, 1.52]].map((p) => new T.Vector3(p[0], p[1], -0.02));
  g.add(mesh(new T.TubeGeometry(new T.CatmullRomCurve3(hanger), 80, 0.035, 10, false), M.gold));
  const hook = mesh(new T.TorusGeometry(0.15, 0.03, 12, 40, Math.PI * 1.3), M.gold);
  hook.position.set(0, 2.12, -0.02);
  hook.rotation.z = -0.6;
  g.add(hook);
  g.position.y = -0.3;
  g.userData = {
    s: 0.95,
    anim: (m, t, spin, whip) => {
      m.rotation.y = Math.sin(spin * 0.7) * 0.5 + whip;
      m.rotation.z = Math.sin(t * 1.2) * 0.03;
    },
  };
  return g;
}

export function createHeroStage(canvas: HTMLCanvasElement, startIndex: number, opts: { zBase?: number } = {}): HeroStage {
  const zBase = opts.zBase ?? 9;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  // High-DPI phones are already sharp; skipping MSAA there saves a lot of GPU work.
  const renderer = new T.WebGLRenderer({ canvas, antialias: dpr < 1.5, alpha: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(dpr);
  renderer.toneMapping = T.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;
  renderer.setClearColor(0x000000, 0);

  const scene = new T.Scene();
  const camera = new T.PerspectiveCamera(30, 1, 0.1, 100);
  camera.position.set(0, 0, zBase);

  const pm = new T.PMREMGenerator(renderer);
  const envRT = pm.fromScene(envScene(), 0.04);
  scene.environment = envRT.texture;

  const key = new T.DirectionalLight(0xffffff, 1.6);
  key.position.set(3, 4, 6);
  const rim = new T.DirectionalLight(0xffe2c0, 1.0);
  rim.position.set(-5, 2, -4);
  scene.add(key, rim, new T.AmbientLight(0xffffff, 0.25));

  const M = materials();
  const holder = new T.Group();
  holder.position.y = zBase < 9 ? 0.05 : 0.3;
  scene.add(holder);
  const pieces = [clover(M), jhumkas(M), hasli(M), kurti(M)];
  pieces.forEach((p) => {
    p.visible = false;
    holder.add(p);
  });

  const st = { slide: startIndex, spin: 0, drag: 0, dragging: false, lastX: 0, tiltX: 0, tiltTarget: 0, tIn: 0, auto: true, raf: 0, last: performance.now(), visible: true };
  const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;

  const show = (i: number) => {
    st.slide = i;
    pieces.forEach((p, k) => (p.visible = k === i));
    st.tIn = reduce ? 1 : 0;
  };
  show(startIndex);

  const resize = () => {
    const w = canvas.clientWidth || 1;
    const h = canvas.clientHeight || 1;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    const narrow = zBase < 9 ? 0.95 : 1.1;
    camera.position.z = camera.aspect < narrow ? zBase * ((zBase < 9 ? 0.95 : 1.25) / camera.aspect) : zBase;
    camera.updateProjectionMatrix();
  };
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  resize();

  const onDown = (e: PointerEvent) => {
    st.dragging = true;
    st.lastX = e.clientX;
    canvas.setPointerCapture?.(e.pointerId);
  };
  const onMove = (e: PointerEvent) => {
    const r = canvas.getBoundingClientRect();
    st.tiltTarget = ((e.clientY - r.top) / r.height - 0.5) * 0.35;
    if (!st.dragging) return;
    st.drag += (e.clientX - st.lastX) * 0.012;
    st.lastX = e.clientX;
  };
  const onUp = () => (st.dragging = false);
  const onLeave = () => (st.tiltTarget = 0);
  canvas.addEventListener("pointerdown", onDown);
  canvas.addEventListener("pointermove", onMove);
  canvas.addEventListener("pointerup", onUp);
  canvas.addEventListener("pointercancel", onUp);
  canvas.addEventListener("pointerleave", onLeave);

  const io = new IntersectionObserver((en) => (st.visible = en[0]?.isIntersecting ?? true));
  io.observe(canvas);

  const easeOutBack = (x: number) => 1 + 2.5 * Math.pow(x - 1, 3) + 1.5 * Math.pow(x - 1, 2);

  const frame = (now: number) => {
    st.raf = requestAnimationFrame(frame);
    const dt = Math.min(0.05, (now - st.last) / 1000);
    st.last = now;
    if (!st.visible || document.hidden) return;
    const t = now / 1000;
    if (st.auto && !reduce && !st.dragging) st.spin += dt * 0.45;
    st.tiltX += (st.tiltTarget - st.tiltX) * 0.06;
    st.tIn = Math.min(1, st.tIn + dt / 0.75);
    const p = easeOutBack(st.tIn);
    const q = Math.min(1, st.tIn * 1.15);
    const whip = Math.pow(1 - q, 3) * Math.PI * 1.6;
    const piece = pieces[st.slide];
    piece.scale.setScalar(piece.userData.s * (0.35 + 0.65 * p));
    piece.userData.anim(piece, t, st.spin + st.drag, whip);
    holder.rotation.x = st.tiltX;
    renderer.render(scene, camera);
  };
  st.raf = requestAnimationFrame(frame);

  return {
    show,
    setAutoSpin: (on) => (st.auto = on),
    dispose() {
      cancelAnimationFrame(st.raf);
      ro.disconnect();
      io.disconnect();
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointercancel", onUp);
      canvas.removeEventListener("pointerleave", onLeave);
      scene.traverse((o) => {
        if ((o as T.Mesh).geometry) (o as T.Mesh).geometry.dispose();
      });
      Object.values(M).forEach((m) => m.dispose());
      envRT.dispose();
      pm.dispose();
      renderer.dispose();
    },
  };
}

/** Builders exposed for tooling (scripts/render-tryon-assets.entry.ts renders try-on look-alike PNGs from them). */
export const pieceKit = { materials, jhumka, hasli, clover, envScene };
