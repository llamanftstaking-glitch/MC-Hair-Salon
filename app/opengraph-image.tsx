import { ImageResponse } from "next/og";

export const runtime     = "edge";
export const alt         = "MC Hair Salon & Spa — Upper East Side, New York City";
export const size        = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%", height: "100%",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        backgroundColor: "#000000",
        position: "relative",
        fontFamily: "Georgia, serif",
      }}
    >
      {/* Radial gold glow */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: "50%",
        background: "radial-gradient(ellipse 80% 100% at 50% 0%, rgba(184,134,11,0.22) 0%, transparent 80%)",
      }} />

      {/* Top gold line */}
      <div style={{ width: 56, height: 1, backgroundColor: "#C9A84C", marginBottom: 40, opacity: 0.8 }} />

      {/* MC letters in gold */}
      <div style={{
        fontSize: 108, fontWeight: "bold", color: "#C9A84C",
        letterSpacing: "-4px", lineHeight: 1, marginBottom: 20,
      }}>
        MC
      </div>

      {/* Salon name */}
      <div style={{
        fontSize: 30, color: "#ffffff",
        letterSpacing: "10px", textTransform: "uppercase",
        marginBottom: 14,
      }}>
        Hair Salon &amp; Spa
      </div>

      {/* Location */}
      <div style={{
        fontSize: 15, color: "#888888",
        letterSpacing: "5px", textTransform: "uppercase",
      }}>
        Upper East Side · New York City · Est. 2011
      </div>

      {/* Bottom gold line */}
      <div style={{ width: 56, height: 1, backgroundColor: "#C9A84C", marginTop: 40, opacity: 0.8 }} />

      {/* Bottom address */}
      <div style={{
        position: "absolute", bottom: 36,
        fontSize: 13, color: "#555555",
        letterSpacing: "2px",
      }}>
        336 East 78th St, New York, NY 10075 · (212) 988-5252
      </div>
    </div>,
    { ...size },
  );
}
