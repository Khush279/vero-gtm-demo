export type Shortcut = {
  combo: string; // human-readable (e.g. "g o", "?", "Esc")
  keys: string[]; // tokenized keys for rendering (e.g. ["g", "o"])
  label: string;
  href?: string; // for nav shortcuts
  group: "navigation" | "general";
};

export const SHORTCUTS: Shortcut[] = [
  { combo: "g o", keys: ["g", "o"], label: "Overview", href: "/", group: "navigation" },
  { combo: "g p", keys: ["g", "p"], label: "Pipeline", href: "/pipeline", group: "navigation" },
  { combo: "g d", keys: ["g", "d"], label: "Day 1", href: "/day1", group: "navigation" },
  { combo: "g e", keys: ["g", "e"], label: "Experiments", href: "/experiments", group: "navigation" },
  { combo: "g b", keys: ["g", "b"], label: "Playbooks", href: "/playbooks", group: "navigation" },
  { combo: "g a", keys: ["g", "a"], label: "Automations", href: "/automations", group: "navigation" },
  { combo: "g n", keys: ["g", "n"], label: "Enterprise", href: "/enterprise", group: "navigation" },
  { combo: "g y", keys: ["g", "y"], label: "Analytics", href: "/analytics", group: "navigation" },
  { combo: "g s", keys: ["g", "s"], label: "Strategy", href: "/strategy", group: "navigation" },
  { combo: "g r", keys: ["g", "r"], label: "Sources", href: "/sources", group: "navigation" },
  { combo: "g m", keys: ["g", "m"], label: "Metrics", href: "/metrics", group: "navigation" },
  { combo: "?", keys: ["?"], label: "Toggle this overlay", group: "general" },
  { combo: "Esc", keys: ["Esc"], label: "Close overlay", group: "general" },
];

// Map of second-key (after `g`) to destination href.
export const NAV_PREFIX_MAP: Record<string, string> = SHORTCUTS.filter(
  (s) => s.group === "navigation" && s.combo.startsWith("g ") && s.href,
).reduce<Record<string, string>>((acc, s) => {
  const second = s.combo.split(" ")[1];
  if (second && s.href) acc[second] = s.href;
  return acc;
}, {});
