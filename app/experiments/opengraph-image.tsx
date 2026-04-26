import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-image";

export const runtime = "edge";
export const contentType = OG_CONTENT_TYPE;
export const size = OG_SIZE;
export const alt = "5 experiments. Week one. · Vero GTM";

export default async function Image() {
  return renderOgImage({
    kicker: "JD: Ship · measure · refine",
    title: "5 experiments. Week one.",
    subtitle: "Hypotheses, instruments, and kill criteria",
  });
}
