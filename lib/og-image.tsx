import { ImageResponse } from "next/og";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

const FOREST = "#234738";
const FOREST_50 = "#e9efe9";
const FOREST_700 = "#2f5b47";
const OCHRE = "#bf801f";
const PAPER = "#fbf8f1";
const INK = "#15201a";
const MUTED = "#6b7568";

export type OgImageContent = {
  kicker: string;
  title: string;
  subtitle: string;
};

export function renderOgImage({ kicker, title, subtitle }: OgImageContent) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          backgroundColor: PAPER,
          backgroundImage: `radial-gradient(circle at 90% 10%, ${FOREST_50} 0%, ${PAPER} 55%)`,
          padding: "72px 88px",
          fontFamily: "serif",
          color: INK,
        }}
      >
        {/* Top-left wordmark */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
            fontSize: 18,
            letterSpacing: "0.32em",
            color: FOREST,
            textTransform: "uppercase",
            fontWeight: 600,
          }}
        >
          VERO GTM
        </div>

        {/* Center content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: 80,
            maxWidth: 980,
          }}
        >
          {/* Kicker (small mono uppercase, sits above the title) */}
          <div
            style={{
              display: "flex",
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
              fontSize: 18,
              letterSpacing: "0.18em",
              color: FOREST_700,
              textTransform: "uppercase",
              marginBottom: 28,
            }}
          >
            {kicker}
          </div>

          {/* Title (serif italic, large) */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontStyle: "italic",
              fontSize: 72,
              lineHeight: 1.05,
              letterSpacing: "-0.015em",
              fontWeight: 400,
              color: FOREST,
            }}
          >
            {title}
          </div>

          {/* Subtitle (mono small caps muted) */}
          <div
            style={{
              display: "flex",
              marginTop: 32,
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
              fontSize: 20,
              letterSpacing: "0.08em",
              color: MUTED,
              textTransform: "uppercase",
            }}
          >
            {subtitle}
          </div>
        </div>

        {/* Bottom-left handle */}
        <div
          style={{
            position: "absolute",
            left: 88,
            bottom: 64,
            display: "flex",
            alignItems: "center",
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
            fontSize: 22,
            color: FOREST,
          }}
        >
          <span style={{ color: OCHRE, marginRight: 4 }}>@</span>
          <span>khushagarwala</span>
        </div>

        {/* Bottom-right logomark */}
        <div
          style={{
            position: "absolute",
            right: 88,
            bottom: 56,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg
            width={80}
            height={80}
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="12" cy="12" r="11" fill={FOREST_50} />
            <circle
              cx="12"
              cy="12"
              r="11"
              fill="none"
              stroke={FOREST}
              strokeWidth="0.6"
              opacity="0.3"
            />
            <path
              d="M6 16V8l6 8 6-8v8"
              fill="none"
              stroke={FOREST}
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
    },
  );
}
