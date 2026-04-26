import { promises as fs } from "fs";
import path from "path";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { PageHeader } from "@/components/page-header";
import { MetricsStrip } from "@/components/metrics-strip";
import { WEEK_1_METRICS } from "@/data/metrics-dashboard";

/**
 * /strategy — renders the 30/60/90 memo from data/strategy.md.
 * Server component. Worker A owns the memo content; this page is the
 * presentation layer. If the memo file isn't present yet, fall back to a
 * graceful placeholder so the route never 500s during the parallel build.
 */

async function loadStrategy(): Promise<string | null> {
  try {
    const filePath = path.join(process.cwd(), "data", "strategy.md");
    const raw = await fs.readFile(filePath, "utf8");
    return raw.trim().length > 0 ? raw : null;
  } catch {
    return null;
  }
}

export default async function StrategyPage() {
  const memo = await loadStrategy();

  return (
    <div className="space-y-10">
      <PageHeader
        kicker="JD: Foundational impact · build Vero's GTM from scratch"
        title={<>The 90-day plan.</>}
        subtitle="What I'd actually do, week by week."
      />

      <MetricsStrip
        caption="Week 1 dashboard mock — projected from current send volume and historical reply baselines"
        metrics={WEEK_1_METRICS}
      />

      <article className="memo max-w-3xl">
        {memo ? (
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ children }) => (
                <h1 className="mt-2 font-display text-[36px] font-light tracking-tightest text-foreground">
                  {children}
                </h1>
              ),
              h2: ({ children }) => (
                <h2 className="mt-10 font-display text-[24px] tracking-tight text-foreground">
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="mt-6 font-display text-[18px] tracking-tight text-foreground">
                  {children}
                </h3>
              ),
              p: ({ children }) => (
                <p className="mt-4 text-pretty font-serif text-[16.5px] leading-relaxed text-foreground/90">
                  {children}
                </p>
              ),
              ul: ({ children }) => (
                <ul className="mt-4 ml-6 list-none space-y-2 font-serif text-[16px] leading-relaxed text-foreground/90 marker:text-primary [&>li]:relative [&>li]:pl-5 [&>li]:before:absolute [&>li]:before:left-0 [&>li]:before:top-[0.7em] [&>li]:before:h-1 [&>li]:before:w-1 [&>li]:before:rounded-full [&>li]:before:bg-primary">
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol className="mt-4 ml-6 list-decimal space-y-2 font-serif text-[16px] leading-relaxed text-foreground/90 marker:text-primary marker:font-mono">
                  {children}
                </ol>
              ),
              li: ({ children }) => <li>{children}</li>,
              code: ({ children, className }) => {
                const isBlock = (className ?? "").includes("language-");
                if (isBlock) {
                  return (
                    <code className="block whitespace-pre-wrap rounded-md bg-muted/60 p-3 font-mono text-[12.5px] text-foreground">
                      {children}
                    </code>
                  );
                }
                return (
                  <code className="rounded bg-muted/60 px-1 py-0.5 font-mono text-[12.5px] text-foreground">
                    {children}
                  </code>
                );
              },
              pre: ({ children }) => (
                <pre className="mt-4 overflow-x-auto rounded-md bg-muted/60 p-4 font-mono text-[12.5px] leading-relaxed text-foreground">
                  {children}
                </pre>
              ),
              blockquote: ({ children }) => (
                <blockquote className="mt-4 border-l-2 border-primary/50 pl-4 font-serif text-[16px] italic text-foreground/80">
                  {children}
                </blockquote>
              ),
              a: ({ href, children }) => (
                <a
                  href={href}
                  className="text-primary underline underline-offset-4 decoration-primary/40 hover:decoration-primary"
                  target={href?.startsWith("http") ? "_blank" : undefined}
                  rel={href?.startsWith("http") ? "noreferrer" : undefined}
                >
                  {children}
                </a>
              ),
              hr: () => <hr className="my-10 border-border" />,
              strong: ({ children }) => (
                <strong className="font-medium text-foreground">{children}</strong>
              ),
              em: ({ children }) => (
                <em className="font-display-italic">{children}</em>
              ),
              table: ({ children }) => (
                <div className="mt-6 overflow-hidden rounded-md border border-border">
                  <table className="w-full text-[13px]">{children}</table>
                </div>
              ),
              thead: ({ children }) => (
                <thead className="bg-muted/40 text-left font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
                  {children}
                </thead>
              ),
              th: ({ children }) => (
                <th className="px-4 py-3 font-normal">{children}</th>
              ),
              td: ({ children }) => (
                <td className="border-t border-border px-4 py-3 text-foreground/90">
                  {children}
                </td>
              ),
            }}
          >
            {memo}
          </ReactMarkdown>
        ) : (
          <Placeholder />
        )}
      </article>
    </div>
  );
}

function Placeholder() {
  return (
    <div className="space-y-6 rounded-lg border border-dashed border-border bg-muted/30 p-8">
      <div className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-muted-foreground">
        Memo pending
      </div>
      <p className="font-serif text-[16px] leading-relaxed text-foreground/80">
        The 30/60/90 memo lives at <code className="rounded bg-muted px-1 font-mono text-[12.5px]">data/strategy.md</code>{" "}
        and renders here. It&apos;s being drafted in a parallel work-stream and will
        appear in this slot when committed.
      </p>
      <p className="font-serif text-[15px] leading-relaxed text-muted-foreground">
        The memo covers: where Vero is today, why family practice in Ontario is the
        wedge for the next 5,000 customers, the real competitive read on Tali, and a
        week-by-week plan for the first 90 days.
      </p>
    </div>
  );
}
