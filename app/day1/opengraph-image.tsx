import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-image";

export const runtime = "edge";
export const contentType = OG_CONTENT_TYPE;
export const size = OG_SIZE;
export const alt = "Day 1, hour by hour · Vero GTM";

export default async function Image() {
  return renderOgImage({
    kicker: "JD: Day 1 deep ownership",
    title: "Day 1, hour by hour",
    subtitle: "What I ship in the first eight hours",
  });
}
