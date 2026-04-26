"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { MobileNav } from "@/components/mobile-nav";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/pipeline", label: "Pipeline" },
  { href: "/case-study", label: "Case study" },
  { href: "/day1", label: "Day 1" },
  { href: "/timeline", label: "Timeline" },
  { href: "/experiments", label: "Experiments" },
  { href: "/playbooks", label: "Playbooks" },
  { href: "/automations", label: "Automations" },
  { href: "/prompt-debugger", label: "Prompts" },
  { href: "/enterprise", label: "Enterprise" },
  { href: "/vs-tali", label: "vs Tali" },
  { href: "/vs-dax", label: "vs DAX" },
  { href: "/vs-suki", label: "vs Suki" },
  { href: "/calculator", label: "Calculator" },
  { href: "/objections", label: "Objections" },
  { href: "/analytics", label: "Analytics" },
  { href: "/metrics", label: "Metrics" },
  { href: "/weekly-digest", label: "Digest" },
  { href: "/strategy", label: "Strategy" },
  { href: "/interview-prep", label: "Q&A" },
  { href: "/sources", label: "Sources" },
  { href: "/resources", label: "Resources" },
];

export function TopNav() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between px-6 md:px-10">
        <Link href="/" className="flex items-center gap-2.5">
          <span aria-hidden className="relative inline-flex h-6 w-6 items-center justify-center">
            <svg viewBox="0 0 24 24" width={24} height={24} className="text-primary">
              <circle cx="12" cy="12" r="11" className="fill-primary/10" />
              <path
                d="M6 16V8l6 8 6-8v8"
                className="fill-none stroke-primary"
                strokeWidth={1.6}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <div className="leading-none">
            <div className="font-display text-[17px] tracking-tight text-foreground">
              Vero GTM
            </div>
            <div className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.22em] text-muted-foreground">
              Khush Agarwala · interview demo
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname?.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-md px-3 py-1.5 text-[13px] transition-colors",
                  active
                    ? "bg-secondary text-secondary-foreground"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <MobileNav />
      </div>
    </header>
  );
}

export default TopNav;
