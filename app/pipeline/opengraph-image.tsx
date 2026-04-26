import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-image";

export const runtime = "edge";
export const contentType = OG_CONTENT_TYPE;
export const size = OG_SIZE;
export const alt = "The pipeline · Vero GTM";

export default async function Image() {
  return renderOgImage({
    kicker: "JD: Architect and own the CRM",
    title: "The pipeline",
    subtitle: "500 Ontario FPs across 8 stages",
  });
}
