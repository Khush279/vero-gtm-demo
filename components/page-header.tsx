/**
 * Editorial page header. Mono small-caps kicker (the JD bullet this surface
 * answers), display title, muted subtitle. Used on every page so the demo
 * reads as one product.
 */
export function PageHeader({
  kicker,
  title,
  subtitle,
  rightSlot,
}: {
  kicker: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  rightSlot?: React.ReactNode;
}) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-6">
      <div className="space-y-2">
        <div className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-muted-foreground">
          {kicker}
        </div>
        <h1 className="font-display text-[32px] font-light leading-[1.05] tracking-tightest text-foreground md:text-[40px]">
          {title}
        </h1>
        {subtitle ? (
          <p className="max-w-xl text-pretty text-[14px] leading-relaxed text-muted-foreground">
            {subtitle}
          </p>
        ) : null}
      </div>
      {rightSlot}
    </header>
  );
}
