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
      {/* Subtle white vignette at top */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: "40%",
        background: "radial-gradient(ellipse 70% 100% at 50% 0%, rgba(255,255,255,0.04) 0%, transparent 80%)",
      }} />

      {/* Corner marks — top left */}
      <div style={{ position: "absolute", top: 40, left: 48, width: 28, height: 1, backgroundColor: "#ffffff", opacity: 0.4 }} />
      <div style={{ position: "absolute", top: 40, left: 48, width: 1, height: 28, backgroundColor: "#ffffff", opacity: 0.4 }} />

      {/* Corner marks — top right */}
      <div style={{ position: "absolute", top: 40, right: 48, width: 28, height: 1, backgroundColor: "#ffffff", opacity: 0.4 }} />
      <div style={{ position: "absolute", top: 40, right: 48, width: 1, height: 28, backgroundColor: "#ffffff", opacity: 0.4 }} />

      {/* Corner marks — bottom left */}
      <div style={{ position: "absolute", bottom: 40, left: 48, width: 28, height: 1, backgroundColor: "#ffffff", opacity: 0.4 }} />
      <div style={{ position: "absolute", bottom: 40, left: 48, width: 1, height: 28, backgroundColor: "#ffffff", opacity: 0.4 }} />

      {/* Corner marks — bottom right */}
      <div style={{ position: "absolute", bottom: 40, right: 48, width: 28, height: 1, backgroundColor: "#ffffff", opacity: 0.4 }} />
      <div style={{ position: "absolute", bottom: 40, right: 48, width: 1, height: 28, backgroundColor: "#ffffff", opacity: 0.4 }} />

      {/* Top rule */}
      <div style={{ width: 48, height: 1, backgroundColor: "#ffffff", marginBottom: 44, opacity: 0.5 }} />

      {/* MC — large white */}
      <div style={{
        fontSize: 112, fontWeight: "bold", color: "#ffffff",
        letterSpacing: "-6px", lineHeight: 1, marginBottom: 18,
      }}>
        MC
      </div>

      {/* Salon name */}
      <div style={{
        fontSize: 28, color: "#ffffff",
        letterSpacing: "12px", textTransform: "uppercase",
        marginBottom: 16, opacity: 0.9,
      }}>
        Hair Salon &amp; Spa
      </div>

      {/* Location line */}
      <div style={{
        fontSize: 13, color: "#777777",
        letterSpacing: "5px", textTransform: "uppercase",
      }}>
        Upper East Side · New York City · Est. 2011
      </div>

      {/* Bottom rule */}
      <div style={{ width: 48, height: 1, backgroundColor: "#ffffff", marginTop: 44, opacity: 0.5 }} />

      {/* Address footer */}
      <div style={{
        position: "absolute", bottom: 40,
        fontSize: 12, color: "#444444",
        letterSpacing: "2px",
      }}>
        336 East 78th St, New York, NY 10075 · (212) 988-5252
      </div>
    </div>,
    { ...size },
  );
}
