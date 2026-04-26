"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Reveal } from "@/components/ui/Reveal";
import { Chip } from "@/components/ui/Chip";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "@/components/ui/icons";
import { urlFor } from "@/sanity/client";
import type { Project, VizKind } from "@/sanity/types";

type Props = { items: Project[] };

export function Projects({ items }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const stepSize = () => {
    const card = wrapRef.current?.querySelector<HTMLElement>(".proj-card");
    return card ? card.offsetWidth + 20 : 460;
  };

  const sync = useCallback(() => {
    const el = wrapRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 8);
    setCanNext(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
  }, []);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    sync();
    el.addEventListener("scroll", sync, { passive: true });
    return () => el.removeEventListener("scroll", sync);
  }, [sync]);

  const scroll = (dir: -1 | 1) => {
    wrapRef.current?.scrollBy({ left: dir * stepSize(), behavior: "smooth" });
  };

  return (
    <section
      id="projects"
      className="relative border-b border-hairline px-5 py-16 sm:px-7 sm:py-20 md:px-20 md:py-[120px]"
    >
      <div className="mb-8 flex items-end justify-between gap-5">
        <Reveal className="flex-1">
          <div className="flex items-baseline gap-4">
            <span className="font-mono text-[11px] uppercase tracking-widest text-fg-faint">05 / PROJECTS</span>
            <span className="text-[13px] font-medium text-fg">Things I&apos;ve built</span>
            <span className="h-px flex-1 bg-hairline" />
          </div>
        </Reveal>
        <Reveal delay={0.08}>
          <div className="flex gap-1.5">
            <button
              type="button"
              aria-label="previous"
              disabled={!canPrev}
              onClick={() => scroll(-1)}
              className="grid h-[38px] w-[38px] place-items-center rounded-full border border-border bg-bg-elev text-fg-mute transition-all duration-200 ease-soft hover:enabled:border-fg hover:enabled:text-fg hover:enabled:scale-105 disabled:cursor-not-allowed disabled:opacity-35"
            >
              <ChevronLeft />
            </button>
            <button
              type="button"
              aria-label="next"
              disabled={!canNext}
              onClick={() => scroll(1)}
              className="grid h-[38px] w-[38px] place-items-center rounded-full border border-border bg-bg-elev text-fg-mute transition-all duration-200 ease-soft hover:enabled:border-fg hover:enabled:text-fg hover:enabled:scale-105 disabled:cursor-not-allowed disabled:opacity-35"
            >
              <ChevronRight />
            </button>
          </div>
        </Reveal>
      </div>

      <div
        ref={wrapRef}
        className="no-scrollbar -mx-5 overflow-x-auto overflow-y-visible px-5 py-5 sm:-mx-7 sm:px-7 md:-mx-20 md:px-20"
        style={{ scrollSnapType: "x mandatory", scrollPaddingLeft: 20 }}
      >
        <div className="grid w-fit grid-flow-col auto-cols-[320px] items-stretch gap-5 sm:auto-cols-[440px]">
          {items.map((p) => (
            <Reveal key={p._id} className="flex min-h-0 w-full flex-col">
              <ProjectCard project={p} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const content = (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="proj-card flex min-h-0 w-full min-w-0 flex-1 flex-col overflow-hidden rounded-lg border border-border bg-bg-elev transition-all duration-300 ease-soft hover:border-(--border-strong) hover:shadow-glow"
      style={{ scrollSnapAlign: "start" }}
    >
      <div className="relative aspect-16/10 overflow-hidden border-b border-hairline bg-bg-sunk">
        <Viz kind={project.viz} image={project.image} title={project.title} />
        <span
          className="absolute left-3.5 top-3.5 rounded-md border border-border bg-bg px-2.5 py-1 font-mono text-[10px] tracking-[0.08em] text-fg-mute"
        >
          {project.year}
        </span>
        <span
          className="arrow absolute right-3.5 top-3.5 grid h-8 w-8 place-items-center rounded-full border border-border bg-bg text-fg-mute transition-all duration-300 ease-soft"
          style={{ transform: "rotate(-45deg)" }}
        >
          <ArrowUpRight />
        </span>
      </div>
      <div className="flex min-h-0 flex-1 flex-col gap-2.5 p-5 sm:p-[22px]">
        <div className="flex shrink-0 items-baseline justify-between">
          <h3 className="m-0 text-[19px] font-medium tracking-[-0.015em]">{project.title}</h3>
          <span className="font-mono text-[10px] tracking-[0.08em] text-fg-faint">
            {project.role}
          </span>
        </div>
        <p className="m-0 min-h-0 flex-1 text-[13.5px] leading-normal text-fg-mute">{project.description}</p>
        <div className="flex shrink-0 flex-wrap gap-1.5">
          {project.tech.map((t) => (
            <Chip key={t}>{t}</Chip>
          ))}
        </div>
      </div>
    </motion.article>
  );

  if (project.projectUrl) {
    return (
      <a href={project.projectUrl} target="_blank" rel="noreferrer" className="flex min-h-0 w-full flex-1 flex-col">
        {content}
      </a>
    );
  }
  return content;
}

function Viz({
  kind,
  image,
  title,
}: {
  kind: VizKind;
  image?: Project["image"];
  title: string;
}) {
  if (kind === "image" && image?.asset) {
    let src: string | null = null;
    try {
      src = urlFor(image).width(880).height(550).fit("crop").url();
    } catch {
      src = null;
    }
    if (src) {
      return <Image src={src} alt={title} fill sizes="(min-width: 640px) 440px, 320px" />;
    }
  }

  if (kind === "buzrr") {
    return (
      <div className="viz-buzrr absolute inset-0">
        <div className="bolt">Bz.</div>
        <div className="players">
          {[40, 70, 55, 85, 60, 90, 45, 75].map((h, i) => (
            <div key={i} className="bar" style={{ height: `${h}%` }} />
          ))}
        </div>
      </div>
    );
  }

  if (kind === "benefi") {
    return (
      <div className="viz-benefi absolute inset-0">
        <div className="dollar serif">$</div>
        <svg className="chart-line" viewBox="0 0 200 80" preserveAspectRatio="none">
          <path
            d="M0 70 L30 55 L55 60 L85 35 L115 42 L145 20 L180 25 L200 10"
            fill="none"
            stroke="var(--accent)"
            strokeWidth={1.5}
          />
          <path
            d="M0 70 L30 55 L55 60 L85 35 L115 42 L145 20 L180 25 L200 10 L200 80 L0 80 Z"
            fill="var(--accent-soft)"
          />
        </svg>
        <div className="pct">DONATIONS · +142% YoY</div>
      </div>
    );
  }

  if (kind === "jsgamez") {
    const cells: { ch: string; on: boolean }[] = [
      { ch: "⏣", on: false }, { ch: "×", on: true }, { ch: "○", on: false }, { ch: "×", on: false }, { ch: "○", on: false }, { ch: "◆", on: true },
      { ch: "♞", on: true }, { ch: "·", on: false }, { ch: "·", on: false }, { ch: "↑", on: true }, { ch: "·", on: false }, { ch: "·", on: false },
      { ch: "↓", on: false }, { ch: "●", on: true }, { ch: "·", on: false }, { ch: "·", on: false }, { ch: "▲", on: true }, { ch: "·", on: false },
      { ch: "·", on: false }, { ch: "·", on: false }, { ch: "♚", on: true }, { ch: "·", on: false }, { ch: "·", on: false }, { ch: "◁", on: false },
    ];
    return (
      <div className="viz-jsgamez absolute inset-0">
        {cells.map((c, i) => (
          <div key={i} className={`cell ${c.on ? "on" : ""}`}>
            {c.ch}
          </div>
        ))}
      </div>
    );
  }

  // samriddhi fallback
  return (
    <div className="viz-samriddhi absolute inset-0">
      <div className="heart">{"&"}</div>
    </div>
  );
}
