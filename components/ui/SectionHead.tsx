import { Reveal } from "./Reveal";

type Props = { number: string; title: string };

export function SectionHead({ number, title }: Props) {
  return (
    <Reveal>
      <div className="mb-12 flex items-baseline gap-4">
        <span className="font-mono text-[11px] tracking-[0.1em] text-fg-faint">{number}</span>
        <span className="text-[13px] font-medium text-fg">{title}</span>
        <span className="h-px flex-1 bg-hairline" />
      </div>
    </Reveal>
  );
}
