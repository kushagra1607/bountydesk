import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "BountyDesk — Bug Bounty Tracker & Report Builder";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          background:
            "linear-gradient(135deg, #0a0a0a 0%, #14143a 50%, #0a0a0a 100%)",
          padding: "80px",
          fontFamily: "system-ui, sans-serif",
          color: "#fff",
        }}
      >
        <div
          style={{
            fontSize: 28,
            color: "#7c8cff",
            fontWeight: 600,
            marginBottom: 24,
            letterSpacing: 1.5,
          }}
        >
          ~/bountydesk
        </div>
        <div
          style={{
            fontSize: 76,
            fontWeight: 800,
            lineHeight: 1.05,
            marginBottom: 24,
            maxWidth: 1000,
          }}
        >
          Stop tracking bounties in a{" "}
          <span style={{ color: "#7c8cff" }}>messy spreadsheet.</span>
        </div>
        <div
          style={{
            fontSize: 32,
            color: "#a0a0b8",
            marginBottom: 40,
            maxWidth: 900,
          }}
        >
          The open-source bug bounty tracker + Markdown report builder for
          hunters.
        </div>
        <div
          style={{
            display: "flex",
            gap: 16,
            fontSize: 22,
            color: "#7c8cff",
          }}
        >
          <span style={{ padding: "8px 20px", border: "2px solid #7c8cff", borderRadius: 30 }}>
            HackerOne
          </span>
          <span style={{ padding: "8px 20px", border: "2px solid #7c8cff", borderRadius: 30 }}>
            Bugcrowd
          </span>
          <span style={{ padding: "8px 20px", border: "2px solid #7c8cff", borderRadius: 30 }}>
            Intigriti
          </span>
          <span style={{ padding: "8px 20px", border: "2px solid #7c8cff", borderRadius: 30 }}>
            Free + $7/mo Pro
          </span>
        </div>
      </div>
    ),
    { ...size },
  );
}
