import type { Metadata } from "next";
import { sans, serif } from "@/lib/fonts";
import { TopNav } from "@/components/top-nav";
import { KeyboardShortcuts } from "@/components/keyboard-shortcuts";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://vero-gtm-demo.vercel.app"),
  title: {
    default: "Vero GTM · Khush Agarwala",
    template: "%s · Vero GTM",
  },
  description:
    "Founding GTM Engineer interview demo for Vero (veroscribe.com). 10 surfaces. 500 real Ontario family physicians. Built in 48 hours.",
  openGraph: {
    title: "Vero GTM · Khush Agarwala",
    description:
      "Founding GTM Engineer interview demo for Vero. 10 surfaces. Built in 48 hours.",
    type: "website",
    url: "https://vero-gtm-demo.vercel.app",
  },
  twitter: { card: "summary_large_image", title: "Vero GTM · Khush Agarwala" },
  robots: { index: false, follow: false },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${sans.variable} ${serif.variable} min-h-screen bg-background font-sans text-foreground antialiased`}
      >
        <KeyboardShortcuts />
        <TopNav />
        <main className="mx-auto w-full max-w-7xl px-6 py-8 md:px-10 md:py-12">
          {children}
        </main>
        <footer className="mx-auto w-full max-w-7xl px-6 pb-10 pt-16 text-[11.5px] text-muted-foreground md:px-10">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-border/60 pt-6">
            <span className="font-mono uppercase tracking-[0.18em]">
              Vero GTM demo · Khush Agarwala · 48-hour build
            </span>
            <span className="text-muted-foreground/50">·</span>
            <a
              href="https://github.com/khushagarwala/vero-gtm-demo"
              target="_blank"
              rel="noreferrer"
              className="hover:text-foreground"
            >
              source
            </a>
            <span className="text-muted-foreground/50">·</span>
            <a href="/strategy" className="hover:text-foreground">
              strategy memo
            </a>
            <span className="ml-auto text-muted-foreground/60">
              data: CPSO public register · drafts: not sent
            </span>
          </div>
        </footer>
      </body>
    </html>
  );
}
