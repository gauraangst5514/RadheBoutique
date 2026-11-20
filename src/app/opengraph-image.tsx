import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

// The picture shown when the site is shared on WhatsApp, Instagram, Google etc.
export const alt = "Radhe Boutique Nashik: trendy jewellery from ₹29";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage() {
  const anton = await readFile(join(process.cwd(), "assets/anton.woff"));
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#F6C9D6", color: "#6B1026", fontFamily: "Anton", position: "relative" }}>
        <div style={{ position: "absolute", left: -120, top: -160, width: 520, height: 520, borderRadius: 999, background: "#FF9CC0", opacity: 0.6, display: "flex" }} />
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 72px", width: 760 }}>
          <div style={{ display: "flex", alignSelf: "flex-start", background: "#6B1026", color: "#F6C9D6", borderRadius: 999, padding: "10px 22px", fontSize: 26, letterSpacing: 4 }}>
            RADHE BOUTIQUE · NASHIK
          </div>
          <div style={{ fontSize: 168, lineHeight: 0.88, marginTop: 26, display: "flex" }}>SHINE</div>
          <div style={{ fontSize: 168, lineHeight: 0.88, display: "flex", color: "#C81E63" }}>DAILY</div>
          <div style={{ fontSize: 40, marginTop: 26, display: "flex", letterSpacing: 1 }}>KOREAN EARRINGS FROM RS.29</div>
        </div>
        <div style={{ display: "flex", flex: 1, alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: 330, height: 440, borderRadius: "999px 999px 24px 24px", background: "#6B1026", border: "6px solid #E9B949", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#F6C9D6" }}>
            <div style={{ fontSize: 34, letterSpacing: 4, display: "flex" }}>FREE SHIPPING</div>
            <div style={{ fontSize: 96, color: "#E9B949", display: "flex" }}>RS.299+</div>
            <div style={{ fontSize: 30, letterSpacing: 3, display: "flex" }}>ORDER ON WHATSAPP</div>
          </div>
        </div>
      </div>
    ),
    { ...size, fonts: [{ name: "Anton", data: anton, weight: 400, style: "normal" }] },
  );
}
