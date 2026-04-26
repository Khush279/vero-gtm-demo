/**
 * Search bar for /faq. Server component. Renders a plain form that submits
 * via GET so the filter is URL-driven and works with no client JS. The /faq
 * page reads `searchParams.q` and filters the master FAQ accordingly.
 *
 * The form action is "/faq" so submitting from anywhere lands the user on
 * the FAQ index. Pressing enter, hitting submit, or clearing the field all
 * round-trip through the server.
 */
export function FaqSearchBar({ defaultValue }: { defaultValue?: string }) {
  return (
    <form
      action="/faq"
      method="get"
      role="search"
      aria-label="Filter the FAQ"
      className="flex w-full flex-col gap-3 rounded-lg border border-border/60 bg-card p-4 sm:flex-row sm:items-center"
    >
      <label
        htmlFor="faq-q"
        className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-muted-foreground sm:shrink-0"
      >
        Search
      </label>
      <input
        id="faq-q"
        name="q"
        type="search"
        defaultValue={defaultValue ?? ""}
        placeholder="pricing, PIPEDA, Epic, trial, switching..."
        autoComplete="off"
        className="flex-1 rounded-md border border-border/70 bg-background px-3 py-2 text-[14px] text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-forest-500/40"
      />
      <div className="flex items-center gap-2 sm:shrink-0">
        <button
          type="submit"
          className="rounded-md border border-border/70 bg-foreground px-4 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-background transition-colors hover:bg-foreground/90"
        >
          Filter
        </button>
        {defaultValue ? (
          <a
            href="/faq"
            className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground underline decoration-dotted underline-offset-4 hover:text-foreground"
          >
            Clear
          </a>
        ) : null}
      </div>
    </form>
  );
}
