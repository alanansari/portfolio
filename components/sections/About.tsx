import { Reveal } from "@/components/ui/Reveal";
import { SectionHead } from "@/components/ui/SectionHead";
import type { Profile } from "@/sanity/types";

type Props = { profile: Profile };

// Splits the about-lede around the first sentence so we can color the
// lead clause while dimming the rest (matches the prototype).
function splitLede(lede: string) {
  const idx = lede.indexOf(". ");
  if (idx === -1) return { head: lede, tail: "" };
  return { head: lede.slice(0, idx + 1), tail: lede.slice(idx + 2) };
}

export function About({ profile }: Props) {
  const { head, tail } = splitLede(profile.aboutLede);
  const aboutFacts = profile.aboutFacts ?? [];
  return (
    <section
      id="about"
      className="relative border-b border-hairline px-5 py-16 sm:px-7 sm:py-20 md:px-20 md:py-[120px]"
    >
      <SectionHead number="01 / ABOUT" title="Who I am" />

      <div className="grid gap-8 md:grid-cols-2 md:gap-12">
        <Reveal>
          <p
            className="m-0 font-normal leading-[1.35] tracking-[-0.015em] text-fg"
            style={{ fontSize: "clamp(20px, 2.4vw, 28px)" }}
          >
            {head.split(" ").map((w, i) =>
              w.toLowerCase() === "javascript" || w.toLowerCase() === "javascript," ? (
                <span key={i} className="serif" style={{ color: "var(--accent)" }}>
                  {w}{" "}
                </span>
              ) : (
                <span key={i}>{w} </span>
              ),
            )}
            {tail ? <span className="text-fg-mute">{tail}</span> : null}
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="flex flex-col">
            {aboutFacts.map((f, i) => (
              <div
                key={i}
                className={`grid grid-cols-[100px_1fr] gap-4 border-t border-hairline py-3.5 text-sm ${
                  i === aboutFacts.length - 1 ? "border-b" : ""
                }`}
              >
                <div className="pt-0.5 font-mono text-[11px] uppercase tracking-[0.06em] text-fg-faint">
                  {f.key}
                </div>
                <div className="text-fg">
                  {f.value}
                  {f.accent ? (
                    <span className="ml-1" style={{ color: "var(--accent)" }}>
                      {" "}
                      {f.accent}
                    </span>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
