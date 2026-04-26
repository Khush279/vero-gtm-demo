/**
 * Pure-SVG inline sparkline. No client JS, no chart library — the component
 * computes a path and renders it once. Renders happily on the server.
 *
 * The path is normalized to fit `width × height` with a 2px inner padding so
 * the stroke and end dot don't get clipped. Optional fill paints a softly
 * tinted polygon down to the baseline.
 */

import { cn } from "@/lib/utils";

export type SparklineProps = {
  /** Ordered chronologically. First entry plots leftmost, last plots rightmost. */
  values: number[];
  /** Outer SVG width in CSS pixels. */
  width?: number;
  /** Outer SVG height in CSS pixels. */
  height?: number;
  /** Stroke color — any CSS color or `currentColor`. */
  strokeColor?: string;
  /** Optional fill color for the area under the line. Rendered at 0.15 opacity. */
  fillColor?: string;
  /** Render a small circle at the last point. Default true. */
  showEndDot?: boolean;
  /** Accessible label. When omitted, the SVG is marked `aria-hidden`. */
  ariaLabel?: string;
  /** Optional className passthrough. */
  className?: string;
};

const PADDING = 2;
const STROKE_WIDTH = 1.5;
const END_DOT_RADIUS = 2.5;

export function Sparkline({
  values,
  width = 80,
  height = 24,
  strokeColor = "currentColor",
  fillColor,
  showEndDot = true,
  ariaLabel,
  className,
}: SparklineProps) {
  // Defensive: nothing to draw with 0 or 1 points (no line possible).
  if (!values || values.length < 2) {
    return null;
  }

  const innerW = Math.max(1, width - PADDING * 2);
  const innerH = Math.max(1, height - PADDING * 2);

  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1; // avoid /0 on a flat series

  const points = values.map((v, i) => {
    const x = PADDING + (i / (values.length - 1)) * innerW;
    // Invert Y: higher value → lower y in SVG space.
    const y = PADDING + (1 - (v - min) / span) * innerH;
    return { x, y };
  });

  const linePath = points
    .map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(2)},${p.y.toFixed(2)}`)
    .join(" ");

  // Area path: line + down to baseline + back to start, closed.
  const baselineY = height - PADDING;
  const areaPath = fillColor
    ? `${linePath} L${points[points.length - 1].x.toFixed(2)},${baselineY.toFixed(2)} L${points[0].x.toFixed(2)},${baselineY.toFixed(2)} Z`
    : null;

  const last = points[points.length - 1];
  const a11y = ariaLabel
    ? { role: "img" as const, "aria-label": ariaLabel }
    : { "aria-hidden": true as const };

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={cn("inline-block align-middle", className)}
      {...a11y}
    >
      {areaPath ? (
        <path d={areaPath} fill={fillColor} fillOpacity={0.15} stroke="none" />
      ) : null}
      <path
        d={linePath}
        fill="none"
        stroke={strokeColor}
        strokeWidth={STROKE_WIDTH}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {showEndDot ? (
        <circle cx={last.x} cy={last.y} r={END_DOT_RADIUS} fill={strokeColor} />
      ) : null}
    </svg>
  );
}

export default Sparkline;
