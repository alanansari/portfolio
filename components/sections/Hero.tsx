"use client";

import { motion } from "framer-motion";
import type { Profile } from "@/sanity/types";

type Props = { profile: Profile };

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] as const, delay },
});

export function Hero({ profile }: Props) {
  return (
    <section
      id="hero"
      className="relative flex min-h-[70vh] flex-col justify-center overflow-hidden px-5 py-16 sm:px-7 sm:py-20 md:min-h-[88vh] md:px-20 md:pb-[120px] md:pt-20"
    >
      <div className="hero-dots" aria-hidden />
      <div className="hero-blob" aria-hidden />

      <div className="relative max-w-[880px]">
        <motion.div
          {...fade(0)}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-bg-elev px-3 py-1.5 font-mono text-[12px] tracking-[0.02em] text-fg-mute"
        >
          <span className="h-[6px] w-[6px] rounded-full bg-emerald-500 pulse-dot" />
          <span>{profile.kicker}</span>
        </motion.div>

        <motion.h1
          {...fade(0)}
          className="m-0 mb-6 font-medium leading-[0.92] tracking-[-0.045em]"
          style={{ fontSize: "clamp(52px, 9vw, 140px)" }}
        >
          {(() => {
            const parts = profile.headline.trim().split(" ");
            const first = parts.shift() ?? "";
            const rest = parts.join(" ");
            return (
              <>
                {first}
                {rest ? (
                  <>
                    <br />
                    {rest}
                  </>
                ) : null}
                <span className="serif font-normal" style={{ color: "var(--accent)" }}>
                  {profile.headlineAccent}
                </span>
              </>
            );
          })()}
        </motion.h1>

        <motion.p
          {...fade(0.08)}
          className="m-0 mb-10 max-w-[560px] leading-normal text-fg-mute"
          style={{ fontSize: "clamp(16px, 2vw, 20px)" }}
        >
          {profile.tagline}
        </motion.p>

        <motion.div {...fade(0.16)} className="flex flex-wrap gap-2.5">
          <a href="#projects" className="btn btn-primary">
            View work →
          </a>
          <a href="#contact" className="btn btn-ghost">
            Get in touch
          </a>
        </motion.div>
      </div>

      <div className="pointer-events-none absolute bottom-10 left-20 right-20 hidden items-end justify-between font-mono text-[11px] tracking-[0.06em] text-fg-faint md:flex">
        <span>SCROLL TO EXPLORE ↓</span>
        <span>
          <b style={{ color: "var(--fg-mute)" }}>v2026.04</b>
        </span>
      </div>
    </section>
  );
}
