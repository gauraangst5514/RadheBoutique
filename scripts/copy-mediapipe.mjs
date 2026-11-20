// Copies MediaPipe's WebAssembly runtime into public/ so try-on works without a third-party CDN.
// Runs automatically after `npm install` (postinstall).
import { cpSync, existsSync, mkdirSync } from "fs";
const src = "node_modules/@mediapipe/tasks-vision/wasm";
const dest = "public/mediapipe/wasm";
if (existsSync(src)) {
  mkdirSync(dest, { recursive: true });
  cpSync(src, dest, { recursive: true });
  console.log("mediapipe wasm copied to", dest);
}
