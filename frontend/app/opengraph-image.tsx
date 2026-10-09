import { ImageResponse } from "next/og";
import { HERO, PROFILE } from "@/app/content/profile";

/**
 * Image d'aperçu quand le lien est partagé (LinkedIn, Slack, iMessage…).
 * Générée une fois au build : 1200 × 630, le format attendu par les réseaux.
 */
export const alt = `${PROFILE.fullName}, ${PROFILE.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "72px 80px",
        color: "#f2f2f0",
        background:
          "radial-gradient(60% 55% at 18% 25%, rgba(242,242,240,0.20), transparent 70%), radial-gradient(55% 50% at 85% 85%, rgba(242,242,240,0.12), transparent 70%), #050505",
      }}
    >
      <div style={{ display: "flex", fontSize: 30, letterSpacing: 1, opacity: 0.85 }}>{HERO.eyebrow}</div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          fontSize: 92,
          fontWeight: 700,
          lineHeight: 0.98,
          letterSpacing: -3,
        }}
      >
        {HERO.lines.map((l) => (
          <span key={l.text} style={{ color: l.accent ? "#e3412b" : "#f2f2f0" }}>
            {l.text}
          </span>
        ))}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 28 }}>
        <div style={{ width: 16, height: 16, borderRadius: 999, background: "#10b981" }} />
        {HERO.availability} · {HERO.location}
      </div>
    </div>,
    size,
  );
}
