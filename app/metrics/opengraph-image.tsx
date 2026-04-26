import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-image";

export const runtime = "edge";
export const contentType = OG_CONTENT_TYPE;
export const size = OG_SIZE;
export const alt = "The dashboard · Vero GTM";

export default async function Image() {
  return renderOgImage({
    kicker: "How I measure the work",
    title: "The dashboard",
    subtitle: "Week 1 to Week 4 deltas",
  });
}
