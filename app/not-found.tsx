import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found",
  description: "The page you are looking for does not exist or has been moved.",
};

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-5 py-16 sm:px-7">
      <div className="hero-dots" aria-hidden />
      <div className="hero-blob" aria-hidden />

      <div className="relative max-w-[520px] text-center">
        <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-bg-elev px-3 py-1.5 font-mono text-[12px] tracking-[0.02em] text-fg-mute">
          <span className="font-medium tabular-nums text-fg">404</span>
          <span className="text-fg-faint">·</span>
          <span>Not found</span>
        </p>

        <h1
          className="m-0 mb-4 font-medium leading-[0.95] tracking-[-0.04em]"
          style={{ fontSize: "clamp(40px, 8vw, 72px)" }}
        >
          This page{" "}
          <span className="serif font-normal" style={{ color: "var(--accent)" }}>
            vanished
          </span>
        </h1>

        <p className="m-0 mb-10 text-fg-mute" style={{ fontSize: "clamp(15px, 1.8vw, 18px)" }}>
          The URL may be mistyped, or the page may have moved. Head back to the portfolio home.
        </p>

        <Link href="/" className="btn btn-primary">
          Back to home →
        </Link>
      </div>
    </div>
  );
}
