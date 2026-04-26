import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-image";

export const runtime = "edge";
export const contentType = OG_CONTENT_TYPE;
export const size = OG_SIZE;
export const alt = "What does Vero save your clinic? · Vero GTM";

export default async function Image() {
  return renderOgImage({
    kicker: "Type in your numbers · see the math",
    title: "What does Vero save your clinic?",
    subtitle: "Live ROI math",
  });
}
