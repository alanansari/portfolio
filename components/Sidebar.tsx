"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { GitHubIcon, LinkedInIcon, MailIcon } from "./ui/icons";
import type { Profile } from "@/sanity/types";
import { cn } from "@/lib/cn";

type Props = { profile: Profile };

// Sidebar section IDs mirror the handoff's index block.
const NAV_SECTIONS = [
  { id: "hero", label: "Overview", num: "00" },
  { id: "about", label: "About", num: "01" },
  { id: "now", label: "Now", num: "02" },
  { id: "experience", label: "Experience", num: "03" },
  { id: "skills", label: "Skills", num: "04" },
  { id: "projects", label: "Projects", num: "05" },
  { id: "contact", label: "Contact", num: "06" },
];

type SidebarContentProps = {
  profile: Profile;
  active: string;
  onNavIntent?: () => void;
  layout: "column" | "drawer";
};

function SidebarContent({ profile, active, onNavIntent, layout }: SidebarContentProps) {
  const isColumn = layout === "column";

  return (
    <div
      className={cn(
        "flex min-h-0 flex-col bg-bg-elev text-[13px]",
        isColumn && "h-full border-hairline border-b lg:border-b-0 lg:border-r lg:bg-bg-elev",
        !isColumn && "h-full",
        isColumn && "px-6 py-5 lg:h-full lg:flex-1 lg:px-7 lg:py-8",
        !isColumn && "px-6 py-6",
      )}
    >
      {/* Head */}
      <div className="mb-9 flex items-center gap-2.5">
        <div className="grid h-8 w-8 place-items-center rounded-lg bg-fg text-[13px] font-semibold tracking-[-0.02em] text-bg transition-all duration-300 ease-soft hover:-rotate-[4deg] hover:bg-accent hover:text-white">
          {profile.initial}
        </div>
        <div>
          <div className="font-medium tracking-[-0.01em]">{profile.name}</div>
          <div className="font-mono text-[11px] tracking-[0.04em] text-fg-mute">
            {profile.location}
          </div>
        </div>
      </div>

      {/* Status */}
      <div className="-mx-2.5 mb-7 flex items-center gap-2 rounded-lg bg-bg-sunk px-2.5 py-2 text-[12px] text-fg-mute">
        <span className="relative inline-block h-[7px] w-[7px] shrink-0 rounded-full bg-emerald-500 shadow-[0_0_0_3px_rgba(16,185,129,0.2)] pulse-dot" />
        <span>
          {profile.availability} <b style={{ color: "var(--fg)" }}>{profile.statusNote}</b>
        </span>
      </div>

      {/* Nav */}
      <nav className="flex min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto">
        <div className="px-2.5 pb-1 pt-3 font-mono text-[10px] uppercase tracking-[0.14em] text-fg-faint">
          Index
        </div>
        {NAV_SECTIONS.map((s) => {
          const isActive = active === s.id;
          return (
            <a
              key={s.id}
              href={`#${s.id}`}
              onClick={onNavIntent}
              className={cn(
                "relative flex items-center gap-2.5 rounded-md px-2.5 py-[7px] text-fg-mute transition-all duration-200 ease-soft",
                "hover:bg-bg-sunk hover:text-fg",
                isActive && "bg-bg-sunk text-fg",
              )}
            >
              <span
                className={cn(
                  "shrink-0 rounded-full bg-(--border-strong) transition-all duration-200 ease-soft",
                  isActive ? "h-[5px] w-[5px] bg-accent" : "h-1 w-1",
                )}
                style={isActive ? { background: "var(--accent)" } : undefined}
              />
              <span>{s.label}</span>
              <span className="ml-auto font-mono text-[10px] text-fg-faint">{s.num}</span>
            </a>
          );
        })}

        <div className="mt-4 px-2.5 pb-1 pt-3 font-mono text-[10px] uppercase tracking-[0.14em] text-fg-faint">
          External
        </div>
        <a
          href="https://github.com/alanansari"
          target="_blank"
          rel="noreferrer"
          onClick={onNavIntent}
          className="flex items-center gap-2.5 rounded-md px-2.5 py-[7px] text-fg-mute transition-all duration-200 ease-soft hover:bg-bg-sunk hover:text-fg"
        >
          <span className="h-1 w-1 shrink-0 rounded-full bg-(--border-strong)" />
          <span>GitHub</span>
          <span className="ml-auto font-mono text-[10px] text-fg-faint">↗</span>
        </a>
        <a
          href="https://linkedin.com/in/alanansari"
          target="_blank"
          rel="noreferrer"
          onClick={onNavIntent}
          className="flex items-center gap-2.5 rounded-md px-2.5 py-[7px] text-fg-mute transition-all duration-200 ease-soft hover:bg-bg-sunk hover:text-fg"
        >
          <span className="h-1 w-1 shrink-0 rounded-full bg-(--border-strong)" />
          <span>LinkedIn</span>
          <span className="ml-auto font-mono text-[10px] text-fg-faint">↗</span>
        </a>
        <Link
          href={profile.resumeUrl || "#"}
          target="_blank"
          rel="noreferrer"
          onClick={onNavIntent}
          className="flex items-center gap-2.5 rounded-md px-2.5 py-[7px] text-fg-mute transition-all duration-200 ease-soft hover:bg-bg-sunk hover:text-fg"
        >
          <span className="h-1 w-1 shrink-0 rounded-full bg-(--border-strong)" />
          <span>Resume.pdf</span>
          <span className="ml-auto font-mono text-[10px] text-fg-faint">↗</span>
        </Link>
      </nav>

      {/* Foot */}
      <div className="mt-auto flex shrink-0 items-center justify-center gap-2 border-t border-hairline pt-5">
        <div className="flex gap-1">
          <a
            href="https://github.com/alanansari"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            onClick={onNavIntent}
            className="grid h-7 w-7 place-items-center rounded-md text-fg-mute transition-all duration-200 ease-soft hover:bg-bg-sunk hover:text-fg"
          >
            <GitHubIcon />
          </a>
          <a
            href="https://linkedin.com/in/alanansari"
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
            onClick={onNavIntent}
            className="grid h-7 w-7 place-items-center rounded-md text-fg-mute transition-all duration-200 ease-soft hover:bg-bg-sunk hover:text-fg"
          >
            <LinkedInIcon />
          </a>
          <a
            href="mailto:ansarialan31@gmail.com"
            aria-label="Email"
            onClick={onNavIntent}
            className="grid h-7 w-7 place-items-center rounded-md text-fg-mute transition-all duration-200 ease-soft hover:bg-bg-sunk hover:text-fg"
          >
            <MailIcon />
          </a>
        </div>
      </div>
    </div>
  );
}

function CloseGlyph() {
  return (
    <span aria-hidden className="relative block h-3.5 w-3.5">
      <span className="absolute left-1/2 top-1/2 block h-0.5 w-4 -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-full bg-current" />
      <span className="absolute left-1/2 top-1/2 block h-0.5 w-4 -translate-x-1/2 -translate-y-1/2 -rotate-45 rounded-full bg-current" />
    </span>
  );
}

const drawerEase = [0.22, 1, 0.36, 1] as const;
const drawerFade = { duration: 0.28, ease: drawerEase };

export function Sidebar({ profile }: Props) {
  const [active, setActive] = useState<string>("hero");
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const close = useCallback(() => setOpen(false), []);
  const bodyOverflowPrev = useRef<string | null>(null);

  // Scroll-spy: choose the section with the largest visible height in the viewport.
  // Scope queries to <main> so stray duplicate ids (extensions, etc.) cannot steal
  // getElementById. A single "probe line" + early break can skip Now/Experience if
  // layout or scroll origin ever makes tops non-monotonic vs. what the user sees.
  useEffect(() => {
    let ticking = false;

    const computeActive = () => {
      const root = document.querySelector("main");
      const vh = window.innerHeight || 1;
      if (!root) {
        setActive((prev) => (prev === NAV_SECTIONS[0]?.id ? prev : (NAV_SECTIONS[0]?.id ?? "hero")));
        ticking = false;
        return;
      }

      let bestId = NAV_SECTIONS[0]?.id ?? "hero";
      let bestVis = -1;

      for (const s of NAV_SECTIONS) {
        const el = root.querySelector(`#${CSS.escape(s.id)}`);
        if (!el) continue;
        const r = el.getBoundingClientRect();
        const visible = Math.max(0, Math.min(r.bottom, vh) - Math.max(r.top, 0));
        if (visible > bestVis) {
          bestVis = visible;
          bestId = s.id;
        }
      }

      // Rare: no intersection (e.g. mid layout). Fall back to "last section whose top
      // crossed ~1/3 viewport" using the same <main>-scoped nodes.
      if (bestVis <= 0) {
        const probeY = vh * 0.35;
        let id = NAV_SECTIONS[0]?.id ?? "hero";
        for (const s of NAV_SECTIONS) {
          const el = root.querySelector(`#${CSS.escape(s.id)}`);
          if (!el) continue;
          if (el.getBoundingClientRect().top <= probeY) id = s.id;
          else break;
        }
        bestId = id;
      }

      setActive((prev) => (prev === bestId ? prev : bestId));
      ticking = false;
    };

    const schedule = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(computeActive);
      }
    };

    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    document.addEventListener("scroll", schedule, { passive: true, capture: true });
    window.addEventListener("resize", schedule);
    const vv = window.visualViewport;
    vv?.addEventListener("scroll", schedule, { passive: true });
    vv?.addEventListener("resize", schedule);

    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(schedule) : null;
    const mainEl = document.querySelector("main");
    if (mainEl) ro?.observe(mainEl);
    else ro?.observe(document.documentElement);

    return () => {
      window.removeEventListener("scroll", schedule);
      document.removeEventListener("scroll", schedule, true);
      window.removeEventListener("resize", schedule);
      vv?.removeEventListener("scroll", schedule);
      vv?.removeEventListener("resize", schedule);
      ro?.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    if (bodyOverflowPrev.current === null) {
      bodyOverflowPrev.current = document.body.style.overflow;
    }
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  useEffect(() => {
    return () => {
      if (bodyOverflowPrev.current !== null) {
        document.body.style.overflow = bodyOverflowPrev.current;
        bodyOverflowPrev.current = null;
      }
    };
  }, []);

  const onDrawerExitComplete = useCallback(() => {
    if (bodyOverflowPrev.current !== null) {
      document.body.style.overflow = bodyOverflowPrev.current;
      bodyOverflowPrev.current = null;
    }
  }, []);

  return (
    <div
      className={cn(
        "max-lg:pointer-events-none max-lg:h-0 max-lg:min-h-0 max-lg:overflow-visible",
        "lg:pointer-events-auto lg:min-h-screen",
      )}
    >
      {/* Mobile + tablet: menu trigger (fixed; outside collapsed grid row) */}
      <div className="pointer-events-auto lg:hidden">
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          aria-label={open ? "Close navigation menu" : "Open navigation menu"}
          onClick={() => setOpen((v) => !v)}
          className={cn(
            "fixed left-4 top-4 z-60 grid h-10 w-10 place-items-center rounded-full bg-fg text-[15px] font-semibold tracking-[-0.02em] text-bg shadow-md",
            "transition-all duration-300 ease-soft hover:-rotate-[4deg] hover:bg-accent hover:text-white",
            "focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-accent-ring",
          )}
        >
          {profile.initial}
        </button>

        <AnimatePresence onExitComplete={onDrawerExitComplete}>
          {open ? (
            <>
              <motion.button
                key="nav-backdrop"
                type="button"
                aria-label="Close menu"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={drawerFade}
                className="fixed inset-0 z-45 bg-[oklch(0.12_0.02_280/0.55)] backdrop-blur-[2px] dark:bg-[oklch(0.05_0.02_280/0.65)]"
                onClick={close}
              />
              <motion.div
                key="nav-panel"
                id={panelId}
                role="dialog"
                aria-modal="true"
                aria-label="Site navigation"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={drawerFade}
                className={cn(
                  "fixed z-50 flex flex-col bg-bg-elev shadow-lg",
                  "max-md:inset-0 max-md:w-full",
                  "md:bottom-0 md:left-0 md:top-0 md:w-[min(280px,calc(100vw-3rem))] md:max-w-[85vw] md:shadow-xl",
                )}
              >
                {/* Mobile: top bar + close */}
                <div className="flex h-14 shrink-0 items-center justify-end border-b border-hairline px-3 md:hidden">
                  <button
                    type="button"
                    onClick={close}
                    className="grid h-9 w-9 place-items-center rounded-md text-fg-mute transition-colors hover:bg-bg-sunk hover:text-fg"
                    aria-label="Close menu"
                  >
                    <span className="sr-only">Close</span>
                    <CloseGlyph />
                  </button>
                </div>
                {/* Tablet: slim header + close */}
                <div className="hidden h-12 shrink-0 items-center justify-end border-b border-hairline px-2 md:flex lg:hidden">
                  <button
                    type="button"
                    onClick={close}
                    className="grid h-9 w-9 place-items-center rounded-md text-fg-mute transition-colors hover:bg-bg-sunk hover:text-fg"
                    aria-label="Close menu"
                  >
                    <span className="sr-only">Close</span>
                    <CloseGlyph />
                  </button>
                </div>

                <div
                  className={cn(
                    "flex min-h-0 flex-1 flex-col overflow-hidden",
                    "max-md:min-h-[calc(100dvh-3.5rem)]",
                    "md:min-h-0 md:flex-1",
                  )}
                >
                  <SidebarContent profile={profile} active={active} onNavIntent={close} layout="drawer" />
                </div>
              </motion.div>
            </>
          ) : null}
        </AnimatePresence>
      </div>

      {/* Desktop: in-flow rail */}
      <aside className="sticky top-0 hidden h-screen w-full min-w-0 flex-col overflow-hidden lg:flex">
        <SidebarContent profile={profile} active={active} layout="column" />
      </aside>
    </div>
  );
}
