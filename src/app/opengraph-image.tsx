import { ImageResponse } from "next/og";
import { SITE_NAME, SITE_OG_ALT, SITE_TAGLINE } from "@/lib/site";

export const alt = SITE_OG_ALT;
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#1C1626",
          padding: "72px 80px",
          color: "#FAF6F0",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -90,
            left: 80,
            width: 380,
            height: 380,
            borderRadius: 190,
            background: "rgba(196, 69, 54, 0.32)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: -80,
            bottom: -120,
            width: 460,
            height: 460,
            borderRadius: 230,
            background: "rgba(112, 88, 168, 0.28)",
            display: "flex",
          }}
        />
        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              width: 88,
              height: 88,
              borderRadius: 24,
              background: "#C44536",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              width="56"
              height="56"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#FAF6F0"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="6" cy="6" r="3" />
              <path d="M8.12 8.12 12 12" />
              <path d="M20 4 8.12 15.88" />
              <circle cx="6" cy="18" r="3" />
              <path d="M14.8 14.8 20 20" />
            </svg>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginLeft: 20,
            }}
          >
            <div style={{ fontSize: 34, fontWeight: 700 }}>{SITE_NAME}</div>
            <div style={{ fontSize: 20, color: "#C9C0D4" }}>{SITE_TAGLINE}</div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 62,
              fontWeight: 700,
              lineHeight: 1.08,
              letterSpacing: -1.2,
            }}
          >
            Clip a YouTube moment.
          </div>
          <div
            style={{
              fontSize: 62,
              fontWeight: 700,
              lineHeight: 1.08,
              letterSpacing: -1.2,
            }}
          >
            Keep the file.
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 28,
              color: "#C9C0D4",
              fontSize: 26,
            }}
          >
            MP4 or GIF · Nothing is uploaded · No account
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
