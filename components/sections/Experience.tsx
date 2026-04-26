import { Reveal } from "@/components/ui/Reveal";
import { SectionHead } from "@/components/ui/SectionHead";
import { Chip } from "@/components/ui/Chip";
import type { Experience as ExpT } from "@/sanity/types";

type Props = { items: ExpT[] };

export function Experience({ items }: Props) {
  return (
    <section
      id="experience"
      className="relative border-b border-hairline px-5 py-16 sm:px-7 sm:py-20 md:px-20 md:py-[120px]"
    >
      <SectionHead number="03 / EXPERIENCE" title="Where I've worked" />

      <div className="relative pl-7">
        <div
          className="absolute left-[7px] top-2 bottom-2 w-px"
          style={{ background: "var(--border)" }}
        />
        {items.map((it, i) => (
          <Reveal key={it._id} delay={i * 0.08}>
            <TimelineItem item={it} highlight={i === 0} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function TimelineItem({ item, highlight }: { item: ExpT; highlight?: boolean }) {
  return (
    <div className="relative grid grid-cols-1 items-start gap-4 pb-11 md:grid-cols-[1fr_auto] md:gap-6 group">
      <span
        className="absolute -left-7 top-1.5 h-[15px] w-[15px] rounded-full border-2 transition-all duration-300 ease-soft group-hover:border-(--accent)! group-hover:bg-(--accent)!"
        style={{
          background: highlight ? "var(--accent)" : "var(--bg)",
          borderColor: highlight ? "var(--accent)" : "var(--border-strong)",
          boxShadow: highlight ? "0 0 0 4px var(--accent-soft)" : undefined,
        }}
      />
      <div>
        <h3 className="m-0 mb-1 text-[17px] font-medium tracking-[-0.01em]">{item.role}</h3>
        <div className="mb-3.5 flex flex-wrap items-center gap-2 text-sm text-fg-mute">
          <b className="font-medium text-fg">{item.company}</b>
          <span
            className="h-[3px] w-[3px] rounded-full"
            style={{ background: "var(--border-strong)" }}
          />
          <span>{item.locationLine}</span>
        </div>
        <ul className="m-0 mb-3.5 max-w-[640px] list-none p-0 text-[13.5px] leading-[1.55] text-fg-mute">
          {item.points.map((p, i) => (
            <li key={i} className="mb-2 flex gap-2.5">
              <span className="shrink-0 text-fg-faint">—</span>
              <span>{p}</span>
            </li>
          ))}
        </ul>
        <div className="flex flex-wrap gap-1.5">
          {item.stack.map((s) => (
            <Chip key={s}>{s}</Chip>
          ))}
        </div>
      </div>
      <div className="whitespace-nowrap pt-1 font-mono text-[11px] tracking-[0.04em] text-fg-faint">
        {item.period}
      </div>
    </div>
  );
}
