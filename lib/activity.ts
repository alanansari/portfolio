import { padContribArray } from "@/lib/activity-grid";
import { fallbackStats } from "@/sanity/fallback";
import type { ActivityBlock, ActivitySignal, LeetCodeStats, Social, Stats } from "@/sanity/types";
import {
  buildContributionGridDatesUtc,
  emptyContribGrid,
  fetchGitHubContributionGrid,
  fetchGitHubStatsMaybe,
  fetchGitHubSignalEvents,
} from "@/lib/github";
import {
  buildLeetCodeIntensityGrid,
  fetchLeetCodeSignalSubmissions,
  fetchLeetCodeStatsMaybe,
  fetchLeetCodeSubmissionCalendarMap,
} from "@/lib/leetcode";
import { resolveApiHandles } from "@/lib/handles";

/** Live GitHub + LeetCode fetches merged into `Stats` on the server. */
export type ActivityBundle = ActivityBlock & {
  githubContributionsTotal?: number;
  githubLive?: { repos: number; prsMerged: number; topLanguages: string[] };
  leetcodeLive?: LeetCodeStats;
};

function formatRelativeTime(atMs: number, now = Date.now()): string {
  const sec = Math.max(0, Math.floor((now - atMs) / 1000));
  if (sec < 60) return "just now";
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ago`;
  const h = Math.floor(min / 60);
  if (h < 48) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 14) return `${d}d ago`;
  const w = Math.floor(d / 7);
  if (w < 8) return `${w}w ago`;
  const mo = Math.floor(d / 30);
  return `${mo}mo ago`;
}

function mergeSignalsFixed(
  gh: { atMs: number; title: string; url?: string }[],
  lc: { atMs: number; title: string; url?: string }[],
  limit = 8,
): ActivitySignal[] {
  type Row = ActivitySignal & { atMs: number };
  const rows: Row[] = [
    ...gh.map((e) => ({
      atMs: e.atMs,
      when: formatRelativeTime(e.atMs),
      what: e.title,
      tag: "gh" as const,
      url: e.url,
    })),
    ...lc.map((e) => ({
      atMs: e.atMs,
      when: formatRelativeTime(e.atMs),
      what: e.title,
      tag: "lc" as const,
      url: e.url,
    })),
  ];
  rows.sort((a, b) => b.atMs - a.atMs);
  return rows.slice(0, limit).map(({ atMs: _a, ...rest }) => rest);
}

export async function fetchActivityBundle(socials: Social[]): Promise<ActivityBundle> {
  const { githubLogin, leetcodeUsername } = resolveApiHandles(socials);
  const now = new Date();
  const zeros = emptyContribGrid(now);

  const settled = await Promise.allSettled([
    fetchGitHubContributionGrid(githubLogin, now),
    fetchLeetCodeSubmissionCalendarMap(leetcodeUsername),
    fetchGitHubSignalEvents(githubLogin),
    fetchLeetCodeSignalSubmissions(leetcodeUsername),
    fetchLeetCodeStatsMaybe(leetcodeUsername),
    fetchGitHubStatsMaybe(githubLogin),
  ]);

  const ghGrid = settled[0].status === "fulfilled" ? settled[0].value : null;
  const lcMap =
    settled[1].status === "fulfilled" ? settled[1].value : new Map<string, number>();
  const ghEv = settled[2].status === "fulfilled" ? settled[2].value : [];
  const lcSub = settled[3].status === "fulfilled" ? settled[3].value : [];
  const lcProfile = settled[4].status === "fulfilled" ? settled[4].value : null;
  const ghProfile = settled[5].status === "fulfilled" ? settled[5].value : null;

  if (process.env.NODE_ENV === "development") {
    const labels = [
      "githubGrid",
      "leetcodeCalendar",
      "githubSignals",
      "leetcodeSignals",
      "leetcodeProfile",
      "githubProfile",
    ] as const;
    for (let i = 0; i < settled.length; i++) {
      const r = settled[i];
      if (r.status === "rejected") {
        console.warn(`[portfolio/activity] ${labels[i]} failed:`, r.reason);
      }
    }
  }

  const dates = ghGrid?.dates ?? buildContributionGridDatesUtc(now);
  const githubContribs = ghGrid?.grid ?? zeros;
  const leetcodeContribs = buildLeetCodeIntensityGrid(dates, lcMap);

  const signals = mergeSignalsFixed(ghEv, lcSub, 8);

  const githubContributionsTotal = ghGrid?.contributionsTotal;

  return {
    githubContribs,
    leetcodeContribs,
    signals,
    ...(githubContributionsTotal != null ? { githubContributionsTotal } : {}),
    ...(ghProfile
      ? {
          githubLive: {
            repos: ghProfile.repos,
            prsMerged: ghProfile.prsMerged,
            topLanguages: ghProfile.topLanguages,
          },
        }
      : {}),
    ...(lcProfile ? { leetcodeLive: lcProfile } : {}),
  };
}

/** Build homepage stats from GitHub + LeetCode APIs; fallbacks fill gaps when a fetch fails. */
export async function getLiveStats(socials: Social[]): Promise<Stats> {
  const live = await fetchActivityBundle(socials);
  return {
    ...mergeStatsWithLiveActivity(fallbackStats, live),
    updatedAt: new Date().toISOString(),
  };
}

function mergeStatsWithLiveActivity(stats: Stats, live: ActivityBundle): Stats {
  const githubContribs = padContribArray(live.githubContribs);
  const leetcodeContribs = padContribArray(live.leetcodeContribs);
  return {
    ...stats,
    github: {
      ...stats.github,
      contribs: githubContribs,
      ...(live.githubLive
        ? {
            repos: live.githubLive.repos,
            prsMerged: live.githubLive.prsMerged,
            topLanguages: live.githubLive.topLanguages,
          }
        : {}),
      ...(live.githubContributionsTotal != null
        ? { commits: live.githubContributionsTotal }
        : {}),
    },
    leetcode: live.leetcodeLive ? { ...stats.leetcode, ...live.leetcodeLive } : stats.leetcode,
    activity: {
      githubContribs,
      leetcodeContribs,
      signals: live.signals,
    },
  };
}
