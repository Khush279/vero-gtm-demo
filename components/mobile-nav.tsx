"use client";

/**
 * Mobile-only hamburger nav. Renders a button that opens a full-screen
 * overlay sheet listing every route. Hidden at md+ via the parent's
 * md:hidden wrapper — desktop keeps the inline link bar in TopNav.
 *
 * Route list is duplicated from TopNav on purpose: the two surfaces
 * change for different reasons (mobile gets reordered for thumb reach,
 * desktop stays alphabetical-ish), and a shared constant would couple
 * them in a way that bites later.
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

// Mobile nav mirrors the desktop top-nav: seven primary surfaces, then a
// link to /map for the rest. Long lists in a mobile sheet are unscannable;
// the map page is the index.
const NAV = [
  { href: "/", label: "Home" },
  { href: "/tour", label: "Tour" },
  { href: "/pipeline", label: "Pipeline" },
  { href: "/case-study", label: "Case study" },
  { href: "/strategy", label: "Strategy" },
  { href: "/vs-tali", label: "vs Tali" },
  { href: "/map", label: "All surfaces" },
];

export function MobileNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Lock body scroll while the sheet is open so the underlying page
  // doesn't scroll behind the overlay on iOS Safari.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Close on Escape for keyboard users.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="print-hide md:hidden">
      <button
        type="button"
        aria-label="Open menu"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className="inline-flex h-10 w-10 items-center justify-center rounded-md text-foreground transition-colors hover:bg-muted/50"
      >
        <svg
          width={20}
          height={20}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M3 6h18M3 12h18M3 18h18" />
        </svg>
      </button>

      {/* Overlay sheet */}
      <div
        className={cn(
          "fixed inset-0 z-50 bg-background/95 backdrop-blur-md transition-opacity duration-200",
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
        )}
        aria-hidden={!open}
      >
        <div
          className={cn(
            "absolute inset-y-0 right-0 flex w-full max-w-sm flex-col border-l border-border/60 bg-background shadow-xl transition-transform duration-200 ease-out",
            open ? "translate-x-0" : "translate-x-full",
          )}
          role="dialog"
          aria-modal="true"
          aria-label="Navigation"
        >
          <div className="flex h-14 items-center justify-between border-b border-border/60 px-6">
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              Menu
            </span>
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-md text-foreground transition-colors hover:bg-muted/50"
            >
              <svg
                width={20}
                height={20}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>

          <nav className="flex flex-col gap-1 px-4 py-4">
            {NAV.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname?.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "rounded-md px-4 py-3 text-[15px] transition-colors",
                    active
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground hover:bg-muted/50",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
}

export default MobileNav;
