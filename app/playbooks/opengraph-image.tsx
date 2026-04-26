import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-image";

export const runtime = "edge";
export const contentType = OG_CONTENT_TYPE;
export const size = OG_SIZE;
export const alt = "Three playbooks. Reusable. · Vero GTM";

export default async function Image() {
  return renderOgImage({
    kicker: "JD: Build scalable GTM playbooks",
    title: "Three playbooks. Reusable.",
    subtitle: "Outbound · activation · expansion",
  });
}
