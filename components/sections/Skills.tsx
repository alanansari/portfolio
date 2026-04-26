import { Reveal } from "@/components/ui/Reveal";
import { SectionHead } from "@/components/ui/SectionHead";
import { Chip } from "@/components/ui/Chip";
import type { SkillCategory } from "@/sanity/types";

type Props = { items: SkillCategory[] };

export function Skills({ items }: Props) {
  return (
    <section
      id="skills"
      className="relative border-b border-hairline px-5 py-16 sm:px-7 sm:py-20 md:px-20 md:py-[120px]"
    >
      <SectionHead number="04 / SKILLS" title="Tools I reach for" />

      <div className="grid auto-rows-fr grid-cols-[repeat(auto-fit,minmax(220px,1fr))] items-stretch gap-4">
        {items.map((cat, i) => (
          <Reveal key={cat._id} delay={i * 0.05} className="flex min-h-0">
            <div className="flex h-full min-h-0 w-full flex-col rounded-md border border-border bg-bg-elev p-5 transition-all duration-300 ease-soft hover:-translate-y-0.5 hover:border-(--border-strong)">
              <h5 className="m-0 mb-3.5 flex shrink-0 items-center gap-2 font-mono text-[11px] font-medium uppercase tracking-widest text-fg-faint">
                <span className="h-1 w-1 rounded-full" style={{ background: "var(--accent)" }} />
                {cat.title}
              </h5>
              <div className="flex min-h-0 flex-1 flex-wrap content-start gap-1.5">
                {cat.skills.map((s) => (
                  <Chip key={s}>{s}</Chip>
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
