/**
 * Three pure-SVG chart primitives for the weekly digest. Server-safe, no JS,
 * no chart library, no dependencies beyond lib/series for deterministic
 * trends. Each chart is sized ~200x100 with a small legend below so it
 * reads as one block in the digest layout.
 *
 * All colors come from the Tailwind palette (forest + ochre + muted) so the
 * charts sit inside the editorial mood of the rest of the site.
 */

import { Sparkline } from "@/components/sparkline";
import { generateTrend } from "@/lib/series";

const FOREST_700 = "#234738";
const FOREST_500 = "#3d7457";
const FOREST_300 = "#8eb89a";
const OCHRE_500 = "#bf801f";

/* ------------------------------------------------------------------ */
/*  Bar chart: reply rate by city                                      */
/* ------------------------------------------------------------------ */

export type BarDatum = { label: string; value: number };

export const REPLY_RATE_BY_CITY: BarDatum[] = [
  { label: "Toronto", value: 7.2 },
  { label: "Ottawa", value: 6.1 },
  { label: "Mississauga", value: 5.4 },
  { label: "Hamilton", value: 3.9 },
  { label: "London", value: 3.4 },
];

export function BarChart({
  data = REPLY_RATE_BY_CITY,
  width = 220,
  height = 110,
  caption = "Reply rate by city · %",
}: {
  data?: BarDatum[];
  width?: number;
  height?: number;
  caption?: string;
}) {
  const padX = 6;
  const padTop = 10;
  const padBottom = 18; // room for x-axis labels
  const innerW = width - padX * 2;
  const innerH = height - padTop - padBottom;
  const max = Math.max(...data.map((d) => d.value), 1);
  const slotW = innerW / data.length;
  const barW = Math.max(8, slotW * 0.6);

  return (
    <figure className="space-y-2">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width={width}
        height={height}
        role="img"
        aria-label={caption}
        className="block"
      >
        {/* axis baseline */}
        <line
          x1={padX}
          x2={width - padX}
          y1={padTop + innerH}
          y2={padTop + innerH}
          stroke="hsl(var(--border))"
          strokeWidth={1}
        />
        {data.map((d, i) => {
          const h = (d.value / max) * innerH;
          const x = padX + slotW * i + (slotW - barW) / 2;
          const y = padTop + innerH - h;
          // Top 2 cities get the deeper forest tone, the rest read as muted.
          const sorted = [...data].sort((a, b) => b.value - a.value);
          const rank = sorted.findIndex((s) => s.label === d.label);
          const fill = rank < 2 ? FOREST_700 : rank < 4 ? FOREST_500 : OCHRE_500;
          return (
            <g key={d.label}>
              <rect
                x={x}
                y={y}
                width={barW}
                height={h}
                fill={fill}
                rx={1.5}
              />
              <text
                x={x + barW / 2}
                y={y - 3}
                fontSize={8}
                textAnchor="middle"
                fill="hsl(var(--foreground))"
                fontFamily="var(--font-sans)"
                style={{ fontVariantNumeric: "tabular-nums" }}
              >
                {d.value.toFixed(1)}
              </text>
              <text
                x={x + barW / 2}
                y={padTop + innerH + 11}
                fontSize={8}
                textAnchor="middle"
                fill="hsl(var(--muted-foreground))"
                fontFamily="var(--font-sans)"
              >
                {d.label}
              </text>
            </g>
          );
        })}
      </svg>
      <figcaption className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
        {caption}
      </figcaption>
    </figure>
  );
}

/* ------------------------------------------------------------------ */
/*  Donut chart: channel mix                                           */
/* ------------------------------------------------------------------ */

export type DonutDatum = { label: string; value: number; color: string };

export const CHANNEL_MIX: DonutDatum[] = [
  { label: "Email", value: 58, color: FOREST_700 },
  { label: "LinkedIn", value: 22, color: FOREST_500 },
  { label: "Referral", value: 12, color: FOREST_300 },
  { label: "Inbound", value: 8, color: OCHRE_500 },
];

export function DonutChart({
  data = CHANNEL_MIX,
  size = 110,
  caption = "Channel mix · % of demos booked",
}: {
  data?: DonutDatum[];
  size?: number;
  caption?: string;
}) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 4;
  const innerR = r * 0.62;

  // Build wedge paths via the polar-to-cartesian + arc trick.
  let acc = 0;
  const wedges = data.map((d) => {
    const startAngle = (acc / total) * Math.PI * 2 - Math.PI / 2;
    acc += d.value;
    const endAngle = (acc / total) * Math.PI * 2 - Math.PI / 2;
    const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;

    const x1 = cx + Math.cos(startAngle) * r;
    const y1 = cy + Math.sin(startAngle) * r;
    const x2 = cx + Math.cos(endAngle) * r;
    const y2 = cy + Math.sin(endAngle) * r;
    const ix1 = cx + Math.cos(endAngle) * innerR;
    const iy1 = cy + Math.sin(endAngle) * innerR;
    const ix2 = cx + Math.cos(startAngle) * innerR;
    const iy2 = cy + Math.sin(startAngle) * innerR;

    const path = [
      `M${x1.toFixed(2)},${y1.toFixed(2)}`,
      `A${r},${r} 0 ${largeArc} 1 ${x2.toFixed(2)},${y2.toFixed(2)}`,
      `L${ix1.toFixed(2)},${iy1.toFixed(2)}`,
      `A${innerR},${innerR} 0 ${largeArc} 0 ${ix2.toFixed(2)},${iy2.toFixed(2)}`,
      "Z",
    ].join(" ");

    return { path, color: d.color, label: d.label, value: d.value };
  });

  return (
    <figure className="flex flex-col gap-2">
      <div className="flex items-center gap-3">
        <svg
          viewBox={`0 0 ${size} ${size}`}
          width={size}
          height={size}
          role="img"
          aria-label={caption}
          className="block shrink-0"
        >
          {wedges.map((w) => (
            <path key={w.label} d={w.path} fill={w.color} />
          ))}
          <text
            x={cx}
            y={cy - 2}
            textAnchor="middle"
            fontSize={9}
            fill="hsl(var(--muted-foreground))"
            fontFamily="var(--font-sans)"
          >
            mix
          </text>
          <text
            x={cx}
            y={cy + 9}
            textAnchor="middle"
            fontSize={11}
            fill="hsl(var(--foreground))"
            fontFamily="var(--font-serif)"
            style={{ fontVariantNumeric: "tabular-nums" }}
          >
            {total}%
          </text>
        </svg>
        <ul className="space-y-1 text-[11px] text-foreground/85">
          {data.map((d) => (
            <li key={d.label} className="flex items-center gap-2">
              <span
                aria-hidden
                className="inline-block h-2 w-2 rounded-sm"
                style={{ background: d.color }}
              />
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                {d.label}
              </span>
              <span className="tabular-nums text-foreground">{d.value}%</span>
            </li>
          ))}
        </ul>
      </div>
      <figcaption className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
        {caption}
      </figcaption>
    </figure>
  );
}

/* ------------------------------------------------------------------ */
/*  Trend line chart: 4-week ARR added                                  */
/* ------------------------------------------------------------------ */

export const ARR_TREND = generateTrend(2160, 11520, 4, 0.08, "arr-added-4wk");

export function TrendLineChart({
  values = ARR_TREND,
  width = 220,
  height = 110,
  caption = "ARR added · 4-week trend",
  weekLabels = ["W1", "W2", "W3", "W4"],
}: {
  values?: number[];
  width?: number;
  height?: number;
  caption?: string;
  weekLabels?: string[];
}) {
  const padX = 8;
  const padTop = 14;
  const padBottom = 18;
  const innerW = width - padX * 2;
  const innerH = height - padTop - padBottom;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;

  const points = values.map((v, i) => {
    const x = padX + (i / (values.length - 1)) * innerW;
    const y = padTop + (1 - (v - min) / span) * innerH;
    return { x, y, v };
  });

  const linePath = points
    .map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(2)},${p.y.toFixed(2)}`)
    .join(" ");
  const baselineY = padTop + innerH;
  const areaPath = `${linePath} L${points[points.length - 1].x.toFixed(2)},${baselineY} L${points[0].x.toFixed(2)},${baselineY} Z`;

  // Show only the start and end values inline so the chart stays uncluttered.
  const fmt = (n: number) =>
    n >= 1000 ? `$${(n / 1000).toFixed(1)}k` : `$${Math.round(n)}`;

  return (
    <figure className="space-y-2">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width={width}
        height={height}
        role="img"
        aria-label={caption}
        className="block"
      >
        {/* faint grid baseline */}
        <line
          x1={padX}
          x2={width - padX}
          y1={baselineY}
          y2={baselineY}
          stroke="hsl(var(--border))"
          strokeWidth={1}
        />
        <path d={areaPath} fill={FOREST_500} fillOpacity={0.16} />
        <path
          d={linePath}
          fill="none"
          stroke={FOREST_700}
          strokeWidth={1.6}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {points.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={i === points.length - 1 ? 3 : 2}
            fill={FOREST_700}
          />
        ))}
        {/* end-point label */}
        <text
          x={points[points.length - 1].x}
          y={Math.max(10, points[points.length - 1].y - 6)}
          fontSize={9}
          textAnchor="end"
          fill="hsl(var(--foreground))"
          fontFamily="var(--font-sans)"
          style={{ fontVariantNumeric: "tabular-nums" }}
        >
          {fmt(values[values.length - 1])}
        </text>
        <text
          x={points[0].x}
          y={Math.max(10, points[0].y - 6)}
          fontSize={9}
          textAnchor="start"
          fill="hsl(var(--muted-foreground))"
          fontFamily="var(--font-sans)"
          style={{ fontVariantNumeric: "tabular-nums" }}
        >
          {fmt(values[0])}
        </text>
        {/* x-axis week labels */}
        {points.map((p, i) => (
          <text
            key={`lbl-${i}`}
            x={p.x}
            y={baselineY + 11}
            fontSize={8}
            textAnchor="middle"
            fill="hsl(var(--muted-foreground))"
            fontFamily="var(--font-sans)"
          >
            {weekLabels[i] ?? `W${i + 1}`}
          </text>
        ))}
      </svg>
      <div className="flex items-center justify-between gap-3">
        <figcaption className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
          {caption}
        </figcaption>
        <Sparkline
          values={values}
          width={56}
          height={14}
          strokeColor={FOREST_700}
          fillColor={FOREST_500}
          ariaLabel="ARR added sparkline"
        />
      </div>
    </figure>
  );
}
