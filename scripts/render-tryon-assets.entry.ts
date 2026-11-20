// Browser entry used to render the try-on look-alike PNGs in public/tryon/ from the 3D hero models.
// Bundle: npx esbuild scripts/render-tryon-assets.entry.ts --bundle --outfile=/tmp/r/bundle.js, open in a page,
// call renderPiece("jhumka","ruby",600,900) and save the PNG it returns.
import * as T from "three";
import { pieceKit } from "../src/components/hero/stage";

// Renders one piece, front-on, on a transparent background, and returns a PNG data URL.
(window as any).renderPiece = (which: string, gem: string, w: number, h: number) => {
  const canvas = document.createElement("canvas");
  canvas.width = w; canvas.height = h;
  const r = new T.WebGLRenderer({ canvas, antialias: true, alpha: true, preserveDrawingBuffer: true });
  r.toneMapping = T.ACESFilmicToneMapping; r.toneMappingExposure = 1.1; r.setClearColor(0, 0);
  const scene = new T.Scene();
  const pm = new T.PMREMGenerator(r);
  scene.environment = pm.fromScene(pieceKit.envScene(), 0.04).texture;
  const key = new T.DirectionalLight(0xffffff, 1.6); key.position.set(3, 4, 6);
  scene.add(key, new T.AmbientLight(0xffffff, 0.3));
  const M = pieceKit.materials();
  const gems: Record<string, T.Material> = { ruby: M.ruby, emerald: M.emerald, pink: new T.MeshPhysicalMaterial({ color: 0xf2a7c3, roughness: 0.05, clearcoat: 1, ior: 1.75 }) };
  let obj: T.Object3D;
  if (which === "jhumka") { obj = pieceKit.jhumka(M, gems[gem]); obj.rotation.y = 0.35; }
  else { obj = pieceKit.hasli(M); obj.rotation.x = -0.5; }
  scene.add(obj);
  const box = new T.Box3().setFromObject(obj); const size = box.getSize(new T.Vector3()); const c = box.getCenter(new T.Vector3());
  const half = Math.max(size.x / 2 * h / w, size.y / 2) * 1.04;
  const cam = new T.OrthographicCamera(-half * w / h, half * w / h, half, -half, 0.1, 50);
  cam.position.set(c.x, c.y, 10); cam.lookAt(c.x, c.y, 0);
  r.render(scene, cam);
  return canvas.toDataURL("image/png");
};
