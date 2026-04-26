import { MetadataRoute } from "next";

const BASE = "https://vero-gtm-demo.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "/",
    "/pipeline",
    "/lead/lead_0042",
    "/automations",
    "/enterprise",
    "/analytics",
    "/metrics",
    "/strategy",
    "/sources",
    "/resources",
    "/experiments",
    "/playbooks",
    "/day1",
    "/case-study",
    "/vs-tali",
    "/vs-dax",
    "/vs-suki",
    "/calculator",
    "/objections",
    "/timeline",
    "/interview-prep",
    "/weekly-digest",
    "/prompt-debugger",
    "/demo-script",
    "/channel-mix",
    "/onboarding-plan",
    "/vs-summary",
    "/chat",
    "/qa-summary",
    "/press-release",
    "/contracts",
    "/board-deck",
    "/docs",
  ];
  const lastMod = new Date();
  return routes.map((path) => ({
    url: `${BASE}${path}`,
    lastModified: lastMod,
    changeFrequency: "weekly",
    priority: path === "/" ? 1.0 : 0.7,
  }));
}
