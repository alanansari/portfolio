import { Reveal } from "@/components/ui/Reveal";
import { SectionHead } from "@/components/ui/SectionHead";
import { GitHubIcon, LeetCodeIcon } from "@/components/ui/icons";
import { ACTIVITY_GRID_ROWS, activityGridWeeksUtc } from "@/lib/activity-grid";
import { buildContributionGridDatesUtc } from "@/lib/github";
import { resolveApiHandles } from "@/lib/handles";
import type { Profile, Social, Stats } from "@/sanity/types";

type Props = { profile: Profile; stats: Stats; socials: Social[] };

export function Now({ profile, stats, socials }: Props) {
  const { githubLogin, leetcodeUsername } = resolveApiHandles(socials);
  const { activity } = stats;
  const gh = activity.githubContribs;
  const lc = activity.leetcodeContribs;
  const activityWeeks = activityGridWeeksUtc();

  return (
    <section
      id="now"
      className="relative border-b border-hairline px-5 py-16 sm:px-7 sm:py-20 md:px-20 md:py-[120px]"
      style={{ background: "var(--bg-sunk)" }}
    >
      <SectionHead number="02 / NOW" title="What I'm building right now" />

      <Reveal>
        <div
          className="mb-6 flex max-w-[780px] items-center gap-3 rounded-[10px] border px-4 py-3.5 text-[13px] leading-[1.45] text-fg"
          style={{ background: "var(--accent-soft)", borderColor: "var(--accent-ring)" }}
        >
          <span
            className="h-2.5 w-2.5 shrink-0 rounded-full pulse-dot"
            style={{ background: "var(--accent)", boxShadow: "0 0 0 4px var(--accent-soft)" }}
          />
          <span>{profile.currentlyBuilding}</span>
        </div>
      </Reveal>

      <div className="flex flex-col gap-6 2xl:flex-row">
        <Reveal className="2xl:w-1/2">
          <div className="min-w-0 rounded-lg border border-border bg-bg p-6 transition-all duration-300 ease-soft hover:border-(--border-strong) hover:shadow-md">
            <h4 className="m-0 mb-1.5 flex items-center gap-2.5 text-[15px] font-medium tracking-[-0.01em]">
              <span className="grid h-5 w-5 place-items-center text-fg-mute">
                <GitHubIcon width={18} height={18} />
              </span>
              Activity graph
            </h4>
            <div className="mb-4 font-mono text-[12px] text-fg-mute">
              @{githubLogin} · {leetcodeUsername} · weekly columns, Sun→Sat rows · last 8 months (live)
            </div>
            <div
              className="contrib-heatmap-scroll"
              style={{
                ["--activity-weeks" as string]: String(activityWeeks),
                ["--activity-rows" as string]: String(ACTIVITY_GRID_ROWS),
              }}
            >
              <div
                className="contrib-combo"
                style={{
                  aspectRatio: `${activityWeeks} / ${ACTIVITY_GRID_ROWS}`,
                }}
                aria-label="Combined GitHub contributions and LeetCode submissions by day. Each column is one week (left older, right newer); rows are Sunday through Saturday. When both platforms have activity the same day, the cell is split diagonally: top-left is GitHub, bottom-right is LeetCode."
              >
                {gh.map((g, i) => (
                  <ActivityCell key={i} gh={g} lc={lc[i] ?? 0} />
                ))}
              </div>
              <ActivityMonthTicks weeks={activityWeeks} />
            </div>
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[10px] uppercase tracking-[0.08em] text-fg-faint">
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-sm bg-accent/45" />
                GitHub
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span
                  className="h-2 w-2 rounded-sm"
                  style={{ background: "oklch(0.62 0.15 var(--lc-heat-h))" }}
                />
                LeetCode
              </span>
              <span className="max-w-[260px] text-[9px] normal-case leading-snug tracking-normal text-fg-mute/85">
                One day per square; Both active → diagonal (GitHub top-left, LeetCode
                bottom-right).
              </span>
            </div>
            <div className="mt-4 min-w-0 space-y-4 border-t border-hairline pt-4">
              <div className="min-w-0">
                <div className="mb-2 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.08em] text-fg-faint">
                  <GitHubIcon width={14} height={14} />
                  GitHub
                </div>
                <div className="grid min-w-0 grid-cols-3 gap-3 sm:gap-5">
                  <Stat n={stats.github.commits} l="Contributions" />
                  <Stat n={stats.github.repos} l="Repos" />
                  <Stat n={stats.github.prsMerged} l="PRs merged" />
                </div>
              </div>
              <div className="min-w-0 border-t border-hairline pt-4">
                <div className="mb-2 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.08em] text-fg-faint">
                  <LeetCodeIcon width={14} height={14} />
                  LeetCode
                </div>
                <div className="grid min-w-0 grid-cols-3 gap-3 sm:gap-5">
                  <Stat n={formatLcNumber(stats.leetcode.rating)} l="Peak rating" />
                  <Stat n={stats.leetcode.totalSolved} l="Solved" />
                  <Stat n={formatLcNumber(stats.leetcode.globalRanking)} l="Global rank" />
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.08} className="2xl:w-1/2">
          <div className="rounded-lg border border-border bg-bg p-6 transition-all duration-300 ease-soft hover:border-(--border-strong) hover:shadow-md">
            <h4 className="m-0 mb-1.5 flex items-center gap-2.5 text-[15px] font-medium tracking-[-0.01em]">
              <span className="flex items-center gap-1 text-fg-mute">
                <GitHubIcon width={16} height={16} />
                <LeetCodeIcon width={16} height={16} />
              </span>
              Recent signals
            </h4>
            <div className="mb-5 font-mono text-[12px] text-fg-mute">GitHub · LeetCode</div>
            <div className="flex flex-col">
              {activity.signals.length === 0 ? (
                <p className="m-0 py-2 text-[13px] text-fg-mute">No recent public activity yet.</p>
              ) : (
                activity.signals.map((a, i) => (
                  <div
                    key={`${a.tag}-${i}-${a.when}`}
                    className={`grid grid-cols-[70px_1fr_auto] items-center gap-3.5 py-3 text-[13px] ${
                      i === 0 ? "" : "border-t border-hairline"
                    }`}
                  >
                    <span className="font-mono text-[11px] tracking-[0.02em] text-fg-faint">{a.when}</span>
                    <span>
                      {a.url ? (
                        <a
                          href={a.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-fg transition-colors hover:text-accent"
                        >
                          {renderWhat(a.what)}
                        </a>
                      ) : (
                        renderWhat(a.what)
                      )}
                    </span>
                    <span className="chip" style={{ fontSize: 10 }}>
                      {a.tag}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function formatLcNumber(n: number | null): string {
  if (n == null) return "—";
  return n.toLocaleString();
}

/** Month labels under the heatmap, aligned to week columns (UTC, row = Sundays). */
function ActivityMonthTicks({ weeks }: { weeks: number }) {
  const row0 = buildContributionGridDatesUtc(new Date(), weeks).slice(0, weeks);
  const labels = row0.map((iso, c) => {
    if (!iso) return "";
    const ym = iso.slice(0, 7);
    const prevYm = c > 0 && row0[c - 1] ? row0[c - 1]!.slice(0, 7) : "";
    if (c > 0 && ym === prevYm) return "";
    const [y, m] = iso.split("-").map(Number);
    return new Date(Date.UTC(y, m - 1, 1)).toLocaleString("en-US", {
      month: "short",
      timeZone: "UTC",
    });
  });

  return (
    <div className="contrib-month-ticks" aria-hidden>
      {labels.map((label, i) => (
        <span key={i}>{label}</span>
      ))}
    </div>
  );
}

function ActivityCell({ gh, lc }: { gh: number; lc: number }) {
  if (gh <= 0 && lc <= 0) {
    return <div className="sq-combo sq-combo--empty" />;
  }
  if (gh > 0 && lc <= 0) {
    return <div className={`sq-combo sq-combo--gh l${gh}`} />;
  }
  if (gh <= 0 && lc > 0) {
    return <div className={`sq-combo sq-combo--lc l${lc}`} />;
  }
  return (
    <div className="sq-combo sq-combo--both">
      <span className={`sq-gh l${gh}`} />
      <span className={`sq-lc l${lc}`} />
    </div>
  );
}

function renderWhat(what: string) {
  const m = what.match(/^([^—\-]+)[—\-]\s*(.+)$/);
  if (!m) return <b className="font-medium">{what}</b>;
  return (
    <>
      <b className="font-medium">{m[1].trim()}</b>{" "}
      <span className="text-fg-mute">— {m[2].trim()}</span>
    </>
  );
}

function Stat({ n, l }: { n: number | string; l: string }) {
  return (
    <div className="min-w-0 text-left">
      <div className="wrap-break-words text-[clamp(15px,4.5vw,22px)] font-medium leading-tight tracking-[-0.02em] tabular-nums">
        {typeof n === "number" ? n.toLocaleString() : n}
      </div>
      <div className="mt-1 font-mono text-[9px] uppercase leading-snug tracking-[0.06em] text-fg-faint sm:text-[10px] sm:tracking-widest">
        {l}
      </div>
    </div>
  );
}
