"use client";

/**
 * /demo-script cockpit. Sticky mono timer at the top, current beat in a large
 * card below, next three beats in a muted preview column, full beat list in a
 * sidebar. Timer advances beats by their startSec/endSec windows. Pause locks
 * the active beat to whatever you stepped to. Keyboard: Space play/pause,
 * arrow keys step beats, R reset. Em-dash-free copy.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import type { DemoBeat } from "@/data/demo-script";

type Props = {
  beats: DemoBeat[];
  totalSec: number;
};

function formatClock(sec: number): string {
  const clamped = Math.max(0, Math.floor(sec));
  const m = Math.floor(clamped / 60);
  const s = clamped % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
  if (target.isContentEditable) return true;
  return false;
}

export function DemoScriptCockpit({ beats, totalSec }: Props) {
  const [elapsedSec, setElapsedSec] = useState(0);
  const [running, setRunning] = useState(false);
  // When the user manually steps with arrow keys or sidebar click, we lock
  // the active beat index until they hit play again.
  const [pinnedIndex, setPinnedIndex] = useState<number | null>(null);
  const tickRef = useRef<number | null>(null);
  const lastStampRef = useRef<number | null>(null);

  // Animation tick. We avoid setInterval drift by integrating from rAF
  // timestamps so the clock stays accurate even when the tab is backgrounded.
  useEffect(() => {
    if (!running) {
      lastStampRef.current = null;
      if (tickRef.current !== null) {
        cancelAnimationFrame(tickRef.current);
        tickRef.current = null;
      }
      return;
    }
    function loop(stamp: number) {
      const last = lastStampRef.current;
      if (last !== null) {
        const deltaSec = (stamp - last) / 1000;
        setElapsedSec((prev) => {
          const next = prev + deltaSec;
          if (next >= totalSec) {
            setRunning(false);
            return totalSec;
          }
          return next;
        });
      }
      lastStampRef.current = stamp;
      tickRef.current = requestAnimationFrame(loop);
    }
    tickRef.current = requestAnimationFrame(loop);
    return () => {
      if (tickRef.current !== null) cancelAnimationFrame(tickRef.current);
    };
  }, [running, totalSec]);

  const liveIndex = useMemo(() => {
    for (let i = 0; i < beats.length; i++) {
      const b = beats[i];
      if (elapsedSec < b.endSec) return i;
    }
    return beats.length - 1;
  }, [beats, elapsedSec]);

  const activeIndex = pinnedIndex ?? liveIndex;
  const active = beats[activeIndex];
  const done = elapsedSec >= totalSec;

  const play = useCallback(() => {
    if (done) return;
    // Resuming after a manual step jumps the clock to the pinned beat start
    // so the next beat fires on time.
    if (pinnedIndex !== null) {
      setElapsedSec(beats[pinnedIndex].startSec);
      setPinnedIndex(null);
    }
    setRunning(true);
  }, [beats, done, pinnedIndex]);

  const pause = useCallback(() => setRunning(false), []);
  const toggle = useCallback(() => {
    if (running) pause();
    else play();
  }, [pause, play, running]);

  const reset = useCallback(() => {
    setRunning(false);
    setElapsedSec(0);
    setPinnedIndex(null);
  }, []);

  const stepTo = useCallback(
    (idx: number) => {
      const clamped = Math.max(0, Math.min(beats.length - 1, idx));
      setPinnedIndex(clamped);
      setRunning(false);
      setElapsedSec(beats[clamped].startSec);
    },
    [beats],
  );

  const next = useCallback(() => stepTo(activeIndex + 1), [activeIndex, stepTo]);
  const prev = useCallback(() => stepTo(activeIndex - 1), [activeIndex, stepTo]);

  // Keyboard: Space play/pause, arrows step, R reset.
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (isTypingTarget(e.target)) return;
      if (e.key === " ") {
        e.preventDefault();
        toggle();
        return;
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        next();
        return;
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        prev();
        return;
      }
      if (e.key.toLowerCase() === "r") {
        e.preventDefault();
        reset();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [next, prev, reset, toggle]);

  const upcoming = beats.slice(activeIndex + 1, activeIndex + 4);
  const progressPct = Math.min(100, (elapsedSec / totalSec) * 100);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
      <div className="space-y-6">
        <StickyTimer
          elapsedSec={elapsedSec}
          totalSec={totalSec}
          running={running}
          done={done}
          progressPct={progressPct}
          onToggle={toggle}
          onReset={reset}
          onPrev={prev}
          onNext={next}
          activeIndex={activeIndex}
          totalBeats={beats.length}
        />

        {done ? <DoneCallout /> : null}

        <CurrentBeatCard beat={active} index={activeIndex} total={beats.length} />

        {upcoming.length > 0 ? (
          <div className="space-y-3">
            <div className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-muted-foreground">
              Next up
            </div>
            <div className="grid gap-3">
              {upcoming.map((b, i) => (
                <NextBeatRow
                  key={b.id}
                  beat={b}
                  index={activeIndex + 1 + i}
                  onJump={() => stepTo(activeIndex + 1 + i)}
                />
              ))}
            </div>
          </div>
        ) : null}

        <KeyboardHints />
      </div>

      <BeatSidebar
        beats={beats}
        activeIndex={activeIndex}
        liveIndex={liveIndex}
        onJump={stepTo}
      />
    </div>
  );
}

function StickyTimer({
  elapsedSec,
  totalSec,
  running,
  done,
  progressPct,
  onToggle,
  onReset,
  onPrev,
  onNext,
  activeIndex,
  totalBeats,
}: {
  elapsedSec: number;
  totalSec: number;
  running: boolean;
  done: boolean;
  progressPct: number;
  onToggle: () => void;
  onReset: () => void;
  onPrev: () => void;
  onNext: () => void;
  activeIndex: number;
  totalBeats: number;
}) {
  return (
    <div className="sticky top-2 z-30 rounded-lg border border-border bg-card/95 p-4 shadow-md backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-baseline gap-2 tabular-nums">
          <span
            className={cn(
              "font-mono text-[42px] font-medium leading-none tracking-tight",
              done ? "text-ochre-500" : "text-foreground",
            )}
          >
            {formatClock(elapsedSec)}
          </span>
          <span className="font-mono text-[14px] text-muted-foreground">
            / {formatClock(totalSec)}
          </span>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={onPrev}
            className="inline-flex h-9 items-center justify-center rounded-md border border-border bg-background px-3 font-mono text-[11px] uppercase tracking-[0.18em] text-foreground transition-colors hover:bg-muted"
            aria-label="Previous beat"
          >
            Prev
          </button>
          <button
            type="button"
            onClick={onToggle}
            className={cn(
              "inline-flex h-9 items-center justify-center rounded-md px-4 font-mono text-[11px] uppercase tracking-[0.18em] transition-opacity",
              done
                ? "bg-muted text-muted-foreground"
                : "bg-primary text-primary-foreground hover:opacity-90",
            )}
            disabled={done}
          >
            {running ? "Pause" : "Play"}
          </button>
          <button
            type="button"
            onClick={onNext}
            className="inline-flex h-9 items-center justify-center rounded-md border border-border bg-background px-3 font-mono text-[11px] uppercase tracking-[0.18em] text-foreground transition-colors hover:bg-muted"
            aria-label="Next beat"
          >
            Next
          </button>
          <button
            type="button"
            onClick={onReset}
            className="inline-flex h-9 items-center justify-center rounded-md border border-border bg-background px-3 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-3">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full bg-forest-500 transition-[width] duration-150"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <span className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-muted-foreground">
          Beat {activeIndex + 1} / {totalBeats}
        </span>
      </div>
    </div>
  );
}

function CurrentBeatCard({
  beat,
  index,
  total,
}: {
  beat: DemoBeat;
  index: number;
  total: number;
}) {
  return (
    <article className="rounded-lg border border-border bg-card p-6 shadow-md md:p-8">
      <div className="flex flex-wrap items-center gap-3">
        <SurfaceChip surface={beat.surface} />
        <span className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-muted-foreground">
          {formatClock(beat.startSec)} to {formatClock(beat.endSec)} · beat{" "}
          {index + 1} of {total}
        </span>
        <a
          href={beat.surface}
          target="_blank"
          rel="noreferrer"
          className="ml-auto inline-flex h-8 items-center gap-1.5 rounded-md border border-border bg-background px-3 font-mono text-[10.5px] uppercase tracking-[0.18em] text-foreground transition-colors hover:bg-muted"
        >
          Open in new tab
          <ExternalIcon />
        </a>
      </div>

      <h2 className="mt-4 font-display-italic text-[34px] font-light leading-[1.05] tracking-tightest text-foreground md:text-[42px]">
        {beat.beatLabel}
      </h2>

      <div className="mt-6 space-y-1">
        <div className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-muted-foreground">
          What to show
        </div>
        <p className="font-mono text-[12.5px] leading-[1.7] text-foreground/85">
          {beat.whatToShow}
        </p>
      </div>

      <div className="mt-6 space-y-2">
        <div className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-muted-foreground">
          What to say
        </div>
        <p className="font-serif text-[20px] leading-[1.5] text-foreground md:text-[22px]">
          {beat.whatToSay}
        </p>
      </div>

      {beat.callout ? (
        <div className="mt-6 rounded-md border border-ochre-300/60 bg-ochre-50 p-4">
          <div className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-ochre-700">
            Fallback / aside
          </div>
          <p className="mt-1 text-[13.5px] leading-relaxed text-ochre-900">
            {beat.callout}
          </p>
        </div>
      ) : null}

      {beat.bringBackTo ? (
        <div className="mt-4 font-mono text-[11px] text-muted-foreground">
          After detour, bring them back to{" "}
          <span className="text-foreground">{beat.bringBackTo}</span>.
        </div>
      ) : null}
    </article>
  );
}

function NextBeatRow({
  beat,
  index,
  onJump,
}: {
  beat: DemoBeat;
  index: number;
  onJump: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onJump}
      className="flex items-center gap-4 rounded-md border border-border/60 bg-muted/40 px-4 py-3 text-left transition-colors hover:bg-muted/70"
    >
      <span className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-muted-foreground">
        {formatClock(beat.startSec)}
      </span>
      <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-forest-700">
        {beat.surface}
      </span>
      <span className="truncate font-display text-[15px] tracking-tight text-foreground/80">
        {beat.beatLabel}
      </span>
      <span className="ml-auto font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground/70">
        #{index + 1}
      </span>
    </button>
  );
}

function BeatSidebar({
  beats,
  activeIndex,
  liveIndex,
  onJump,
}: {
  beats: DemoBeat[];
  activeIndex: number;
  liveIndex: number;
  onJump: (idx: number) => void;
}) {
  return (
    <aside className="hidden lg:block">
      <div className="sticky top-2">
        <div className="mb-3 font-mono text-[10.5px] uppercase tracking-[0.22em] text-muted-foreground">
          All beats
        </div>
        <ol className="space-y-1 rounded-lg border border-border bg-card p-2">
          {beats.map((b, i) => {
            const isActive = i === activeIndex;
            const isLive = i === liveIndex;
            return (
              <li key={b.id}>
                <button
                  type="button"
                  onClick={() => onJump(i)}
                  className={cn(
                    "group flex w-full items-baseline gap-3 rounded-md px-2 py-1.5 text-left transition-colors",
                    isActive
                      ? "bg-primary/10 text-foreground"
                      : "hover:bg-muted/60",
                  )}
                >
                  <span
                    className={cn(
                      "font-mono text-[10.5px] tabular-nums",
                      isActive ? "text-primary" : "text-muted-foreground",
                    )}
                  >
                    {formatClock(b.startSec)}
                  </span>
                  <span
                    className={cn(
                      "truncate font-display text-[14px] tracking-tight",
                      isActive ? "text-foreground" : "text-foreground/70",
                    )}
                  >
                    {b.beatLabel}
                  </span>
                  {isLive && !isActive ? (
                    <span className="ml-auto h-1.5 w-1.5 rounded-full bg-forest-500" />
                  ) : null}
                </button>
              </li>
            );
          })}
        </ol>
      </div>
    </aside>
  );
}

function SurfaceChip({ surface }: { surface: string }) {
  return (
    <span className="inline-flex items-center rounded-md bg-forest-700 px-2.5 py-1 font-mono text-[10.5px] uppercase tracking-[0.18em] text-forest-50">
      {surface}
    </span>
  );
}

function DoneCallout() {
  return (
    <div className="rounded-lg border border-ochre-300/60 bg-ochre-50 p-5">
      <div className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-ochre-700">
        Done
      </div>
      <p className="mt-1 font-display text-[24px] tracking-tight text-ochre-900">
        Timer hit the close. Stop talking, ask the question.
      </p>
    </div>
  );
}

function KeyboardHints() {
  return (
    <div className="flex flex-wrap items-center gap-4 rounded-md border border-border/60 bg-muted/30 px-4 py-3 font-mono text-[11px] text-muted-foreground">
      <span>
        <kbd className="rounded border border-border bg-background px-1.5 py-0.5 text-foreground">
          Space
        </kbd>{" "}
        play / pause
      </span>
      <span>
        <kbd className="rounded border border-border bg-background px-1.5 py-0.5 text-foreground">
          {"→"}
        </kbd>{" "}
        next beat
      </span>
      <span>
        <kbd className="rounded border border-border bg-background px-1.5 py-0.5 text-foreground">
          {"←"}
        </kbd>{" "}
        prev beat
      </span>
      <span>
        <kbd className="rounded border border-border bg-background px-1.5 py-0.5 text-foreground">
          R
        </kbd>{" "}
        reset
      </span>
    </div>
  );
}

function ExternalIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      width={11}
      height={11}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M6 3H3v10h10V10M10 3h3v3M13 3L7.5 8.5" />
    </svg>
  );
}
