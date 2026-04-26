import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-image";

export const runtime = "edge";
export const contentType = OG_CONTENT_TYPE;
export const size = OG_SIZE;
export const alt = "Cold to closed in 28 days · Vero GTM";

export default async function Image() {
  return renderOgImage({
    kicker: "Case study · one clinic, end to end",
    title: "Cold to closed in 28 days",
    subtitle: "Dr. Yasmin Raza · Family Medicine · Mississauga",
  });
}
