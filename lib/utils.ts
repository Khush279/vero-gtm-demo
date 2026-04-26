import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Linear/Gmail-style relative date.
 *  "just now" / "4m ago" / "Today 9:42a" / "Yesterday 4:14p" / "Mon 8 Apr" / "8 Apr 2024"
 */
export function smartDate(date: Date | string, now: Date = new Date()): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const diffMs = now.getTime() - d.getTime();
  const diffMin = Math.floor(diffMs / 60_000);
  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;

  const sameDay =
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate();
  const time = d
    .toLocaleString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })
    .replace(" AM", "a")
    .replace(" PM", "p");
  if (sameDay) return `Today ${time}`;

  const y = new Date(now);
  y.setDate(y.getDate() - 1);
  if (
    d.getFullYear() === y.getFullYear() &&
    d.getMonth() === y.getMonth() &&
    d.getDate() === y.getDate()
  ) {
    return `Yesterday ${time}`;
  }

  const oneWeek = 7 * 24 * 60 * 60 * 1000;
  if (diffMs >= 0 && diffMs < oneWeek) {
    return d
      .toLocaleString("en-US", { weekday: "short", hour: "numeric", minute: "2-digit", hour12: true })
      .replace(" AM", "a")
      .replace(" PM", "p");
  }

  const sameYear = d.getFullYear() === now.getFullYear();
  return d.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    ...(sameYear ? {} : { year: "numeric" }),
  });
}

export function truncate(text: string, max = 120): string {
  if (text.length <= max) return text;
  return text.slice(0, max).trimEnd() + "…";
}
