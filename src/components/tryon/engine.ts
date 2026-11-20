import { FaceLandmarker, FilesetResolver, type NormalizedLandmark } from "@mediapipe/tasks-vision";

/**
 * Live try-on: MediaPipe face tracking in the browser (nothing is uploaded),
 * then the product's cut-out photo is drawn at the earlobes or under the chin.
 */

export type TryOnKind = "earrings" | "necklace";

const MODEL_URL =
  process.env.NEXT_PUBLIC_FACE_MODEL_URL ||
  "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task";

export async function loadFaceTracker(): Promise<FaceLandmarker> {
  const fileset = await FilesetResolver.forVisionTasks("/mediapipe/wasm");
  const make = (delegate: "GPU" | "CPU") =>
    FaceLandmarker.createFromOptions(fileset, {
      baseOptions: { modelAssetPath: MODEL_URL, delegate },
      runningMode: "VIDEO",
      numFaces: 1,
      minFaceDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });
  try {
    return await make("GPU");
  } catch {
    return await make("CPU"); // older phones without WebGL2 support for MediaPipe
  }
}

// Face-mesh landmark ids (canonical 468-point mesh).
const L = { earTopA: 234, jawA: 132, earTopB: 454, jawB: 361, chin: 152, forehead: 10, nose: 1 };

type V = { x: number; y: number };
const sub = (a: V, b: V): V => ({ x: a.x - b.x, y: a.y - b.y });
const add = (a: V, b: V): V => ({ x: a.x + b.x, y: a.y + b.y });
const mul = (a: V, k: number): V => ({ x: a.x * k, y: a.y * k });
const len = (a: V) => Math.hypot(a.x, a.y) || 1;
const norm = (a: V) => mul(a, 1 / len(a));
const lerpV = (a: V, b: V, t: number): V => ({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t });

/** Maps normalised video coordinates to the on-screen box (object-fit: cover). */
export function coverMap(vw: number, vh: number, cw: number, ch: number) {
  const s = Math.max(cw / vw, ch / vh);
  const dx = (cw - vw * s) / 2;
  const dy = (ch - vh * s) / 2;
  return (p: NormalizedLandmark): V => ({ x: p.x * vw * s + dx, y: p.y * vh * s + dy });
}

interface Pendulum {
  angle: number;
  vel: number;
  lastX: number | null;
  lastV: number;
}
const pendulum = (): Pendulum => ({ angle: 0, vel: 0, lastX: null, lastV: 0 });

/** Keeps smoothed positions and earring swing between frames. */
export class OverlayState {
  a: V | null = null;
  b: V | null = null;
  neck: V | null = null;
  faceW = 0;
  pa = pendulum();
  pb = pendulum();
  reset() {
    this.a = this.b = this.neck = null;
    this.faceW = 0;
    this.pa = pendulum();
    this.pb = pendulum();
  }
}

function swing(p: Pendulum, x: number, dt: number) {
  // Simple damped pendulum pushed by how fast the earlobe moves sideways.
  const v = p.lastX === null ? 0 : (x - p.lastX) / Math.max(dt, 1e-3);
  const accel = (v - p.lastV) / Math.max(dt, 1e-3);
  p.lastX = x;
  p.lastV = v;
  const k = 60, c = 7, push = 0.0009;
  p.vel += (-k * p.angle - c * p.vel - accel * push) * dt;
  p.angle = Math.max(-0.6, Math.min(0.6, p.angle + p.vel * dt));
  return p.angle;
}

export interface DrawOpts {
  kind: TryOnKind;
  img: HTMLImageElement;
  /** earring width as a share of face width; necklace width as a share of face width */
  size?: number;
}

/**
 * Draws the piece for one frame. Returns false when no face is visible.
 * Coordinates are in the un-mirrored video space; the canvas is mirrored with CSS like the video.
 */
export function drawFrame(
  ctx: CanvasRenderingContext2D,
  lm: NormalizedLandmark[] | undefined,
  map: (p: NormalizedLandmark) => V,
  state: OverlayState,
  dt: number,
  opts: DrawOpts,
): boolean {
  const { width: cw, height: ch } = ctx.canvas;
  ctx.clearRect(0, 0, cw, ch);
  if (!lm || lm.length < 455) {
    state.reset();
    return false;
  }
  const P = (i: number) => map(lm[i]);
  const topA = P(L.earTopA), topB = P(L.earTopB), jawA = P(L.jawA), jawB = P(L.jawB);
  const chin = P(L.chin), forehead = P(L.forehead), nose = P(L.nose);
  const faceW = len(sub(topB, topA));
  const faceH = len(sub(chin, forehead));
  const centre = lerpV(topA, topB, 0.5);
  const k = 0.45; // smoothing: lower = steadier, higher = snappier
  state.faceW = state.faceW ? state.faceW + (faceW - state.faceW) * k : faceW;

  if (opts.kind === "earrings") {
    const lobe = (top: V, jaw: V) => {
      const p = lerpV(top, jaw, 0.72);
      return add(p, mul(norm(sub(p, centre)), faceW * 0.02));
    };
    const la = lobe(topA, jawA), lb = lobe(topB, jawB);
    state.a = state.a ? lerpV(state.a, la, k) : la;
    state.b = state.b ? lerpV(state.b, lb, k) : lb;

    // Head turned: hide the earring that would be behind the head.
    const r = (nose.x - topA.x) / ((topB.x - topA.x) || 1);
    const showA = r > 0.3, showB = r < 0.7;

    const w = state.faceW * (opts.size ?? 0.26);
    const h = w * (opts.img.naturalHeight / (opts.img.naturalWidth || 1));
    const draw = (pos: V, p: Pendulum, show: boolean) => {
      const ang = swing(p, pos.x, dt);
      if (!show) return;
      ctx.save();
      ctx.translate(pos.x, pos.y);
      ctx.rotate(ang); // earrings hang with gravity, so only the swing rotates them
      ctx.shadowColor = "rgba(0,0,0,.25)";
      ctx.shadowBlur = w * 0.08;
      ctx.shadowOffsetY = w * 0.04;
      ctx.drawImage(opts.img, -w / 2, -h * 0.04, w, h);
      ctx.restore();
    };
    draw(state.a, state.pa, showA);
    draw(state.b, state.pb, showB);
    return true;
  }

  // Necklace: sits on the collarbone line, a bit below the chin, level with the shoulders.
  const down = norm(sub(chin, forehead));
  const neck = add(chin, mul(down, faceH * 0.38));
  state.neck = state.neck ? lerpV(state.neck, neck, k) : neck;
  const w = state.faceW * (opts.size ?? 1.3);
  const h = w * (opts.img.naturalHeight / (opts.img.naturalWidth || 1));
  ctx.save();
  ctx.shadowColor = "rgba(0,0,0,.28)";
  ctx.shadowBlur = w * 0.03;
  ctx.shadowOffsetY = w * 0.015;
  ctx.drawImage(opts.img, state.neck.x - w / 2, state.neck.y - h * 0.08, w, h);
  ctx.restore();
  return true;
}
