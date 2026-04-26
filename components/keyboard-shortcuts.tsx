"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { NAV_PREFIX_MAP, SHORTCUTS, type Shortcut } from "@/lib/shortcuts";

const G_PREFIX_TIMEOUT_MS = 1000;

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
  if (target.isContentEditable) return true;
  return false;
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="inline-flex items-center justify-center min-w-[1.5rem] h-6 px-1.5 rounded border border-border bg-muted/40 font-mono text-[11px]">
      {children}
    </kbd>
  );
}

function ComboKeys({ keys }: { keys: string[] }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      {keys.map((k, i) => (
        <span key={`${k}-${i}`} className="inline-flex items-center gap-1.5">
          <Kbd>{k}</Kbd>
          {i < keys.length - 1 ? (
            <span className="font-sans text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
              then
            </span>
          ) : null}
        </span>
      ))}
    </span>
  );
}

function Section({
  title,
  items,
}: {
  title: string;
  items: Shortcut[];
}) {
  if (items.length === 0) return null;
  return (
    <div className="space-y-2">
      <div className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-muted-foreground">
        {title}
      </div>
      <ul className="divide-y divide-border/50 rounded-md border border-border/60 bg-background/40">
        {items.map((s) => (
          <li
            key={s.combo}
            className="flex items-center justify-between gap-4 px-3 py-2"
          >
            <span className="font-sans text-[13px] text-foreground">
              {s.label}
            </span>
            <ComboKeys keys={s.keys} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export function KeyboardShortcuts() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const gPressedAtRef = useRef<number | null>(null);

  const close = useCallback(() => setOpen(false), []);
  const toggle = useCallback(() => setOpen((v) => !v), []);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      // Escape always closes (even with modifiers) when overlay is open.
      if (e.key === "Escape") {
        if (open) {
          e.preventDefault();
          close();
        }
        return;
      }

      // Ignore when modifier keys are held.
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      // Ignore when user is typing.
      if (isTypingTarget(e.target)) return;

      // `?` toggles the overlay.
      if (e.key === "?") {
        e.preventDefault();
        toggle();
        gPressedAtRef.current = null;
        return;
      }

      // Don't capture nav shortcuts while overlay is open (other than ? / Esc above).
      if (open) return;

      const key = e.key.toLowerCase();

      // Two-step `g` + letter navigation.
      const now = Date.now();
      const lastG = gPressedAtRef.current;
      if (lastG !== null && now - lastG <= G_PREFIX_TIMEOUT_MS) {
        const href = NAV_PREFIX_MAP[key];
        gPressedAtRef.current = null;
        if (href) {
          e.preventDefault();
          router.push(href);
        }
        return;
      }

      if (key === "g") {
        gPressedAtRef.current = now;
        return;
      }

      // Any other key resets the prefix.
      gPressedAtRef.current = null;
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, close, toggle, router]);

  if (!open) return null;

  const navItems = SHORTCUTS.filter((s) => s.group === "navigation");
  const generalItems = SHORTCUTS.filter((s) => s.group === "general");

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Keyboard shortcuts"
      className={cn(
        "fixed inset-0 z-[100] flex items-center justify-center",
        "bg-background/80 backdrop-blur-md",
      )}
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div
        className={cn(
          "relative w-full max-w-md rounded-lg border border-border/70",
          "bg-background shadow-2xl",
          "mx-4 p-6",
        )}
      >
        <button
          type="button"
          onClick={close}
          aria-label="Close"
          className="absolute right-3 top-3 inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted/60 hover:text-foreground"
        >
          <svg
            viewBox="0 0 24 24"
            width={14}
            height={14}
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>

        <div className="mb-5">
          <div className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-muted-foreground">
            Quick reference
          </div>
          <h2 className="mt-1 font-display text-[22px] tracking-tight text-foreground">
            Keyboard shortcuts
          </h2>
        </div>

        <div className="space-y-5">
          <Section title="Navigation" items={navItems} />
          <Section title="General" items={generalItems} />
        </div>

        <p className="mt-5 font-sans text-[12px] text-muted-foreground">
          Press <span className="font-mono">?</span> again to close.
        </p>
      </div>
    </div>
  );
}

export default KeyboardShortcuts;
