import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-image";

export const runtime = "edge";
export const contentType = OG_CONTENT_TYPE;
export const size = OG_SIZE;
export const alt = "The 90-day plan · Vero GTM";

export default async function Image() {
  return renderOgImage({
    kicker: "JD: Build Vero's GTM from scratch",
    title: "The 90-day plan",
    subtitle: "Days 1 to 90 · sequenced and instrumented",
  });
}
