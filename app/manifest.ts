import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Vero GTM",
    short_name: "Vero GTM",
    description: "Founding GTM Engineer interview demo for Vero (veroscribe.com).",
    start_url: "/",
    display: "minimal-ui",
    background_color: "#fbf8f1",
    theme_color: "#234738",
    icons: [{ src: "/icon", sizes: "32x32", type: "image/png" }],
  };
}
