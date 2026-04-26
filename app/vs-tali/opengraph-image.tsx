import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-image";

export const runtime = "edge";
export const contentType = OG_CONTENT_TYPE;
export const size = OG_SIZE;
export const alt = "Vero vs Tali AI · Vero GTM";

export default async function Image() {
  return renderOgImage({
    kicker: "Side-by-side · honest read",
    title: "Vero vs Tali AI",
    subtitle: "Updated April 2026 · 15-row comparison",
  });
}
