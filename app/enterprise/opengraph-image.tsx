import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-image";

export const runtime = "edge";
export const contentType = OG_CONTENT_TYPE;
export const size = OG_SIZE;
export const alt = "The institution lane · Vero GTM";

export default async function Image() {
  return renderOgImage({
    kicker: "JD: Enterprise deals · RFPs",
    title: "The institution lane",
    subtitle: "Hospitals, FHTs, and regional health authorities",
  });
}
