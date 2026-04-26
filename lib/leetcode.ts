import type { LeetCodeStats } from "@/sanity/types";
import { fallbackLeetCode } from "@/sanity/fallback";
import { intensityFromCount } from "@/lib/github";

// LeetCode doesn't have a public REST API, but they expose a GraphQL
// endpoint that the site itself uses. This query returns solve counts and
// weekly contest rating and global contest rank for a user.
const GQL = "https://leetcode.com/graphql";

const lcHeaders: HeadersInit = {
  "Content-Type": "application/json",
  Referer: "https://leetcode.com/",
  Origin: "https://leetcode.com",
};

const QUERY = `query getUserProfile($username: String!) {
  matchedUser(username: $username) {
    submitStatsGlobal { acSubmissionNum { difficulty count } }
  }
  userContestRanking(username: $username) {
    rating
    globalRanking
  }
  userContestRankingHistory(username: $username) {
    rating
    attended
  }
}`;

/** Highest contest rating from weekly history (`attended` only); falls back to current rating. */
function peakContestRating(
  history: { rating?: number; attended?: boolean }[] | null | undefined,
  currentRating: number | null,
): number | null {
  const attended = (history ?? [])
    .filter((h) => h.attended === true && h.rating != null && Number.isFinite(Number(h.rating)))
    .map((h) => Number(h.rating));
  const fromHistory = attended.length ? Math.max(...attended) : null;
  const cur =
    currentRating != null && Number.isFinite(currentRating) ? currentRating : null;
  const peak = fromHistory != null ? (cur != null ? Math.max(fromHistory, cur) : fromHistory) : cur;
  return peak != null ? Math.round(peak) : null;
}

const CALENDAR_QUERY = `query cal($username: String!) {
  matchedUser(username: $username) { submissionCalendar }
}`;

const RECENT_QUERY = `query recent($username: String!) {
  recentSubmissionList(username: $username limit: 24) {
    title statusDisplay timestamp lang titleSlug
  }
}`;

/** submissionCalendar JSON uses unix-day keys (seconds) → counts. */
export function parseSubmissionCalendarJson(jsonStr: string): Map<string, number> {
  const map = new Map<string, number>();
  try {
    const raw = JSON.parse(jsonStr) as Record<string, number>;
    for (const [k, v] of Object.entries(raw)) {
      const sec = Number(k);
      if (!Number.isFinite(sec)) continue;
      const key = new Date(sec * 1000).toISOString().slice(0, 10);
      map.set(key, (map.get(key) ?? 0) + (typeof v === "number" ? v : 0));
    }
  } catch {
    /* ignore */
  }
  return map;
}

export async function fetchLeetCodeSubmissionCalendarMap(
  username: string,
): Promise<Map<string, number>> {
  try {
    const res = await fetch(GQL, {
      method: "POST",
      headers: lcHeaders,
      body: JSON.stringify({ query: CALENDAR_QUERY, variables: { username } }),
      next: { revalidate: 300 },
    });
    if (!res.ok) return new Map();
    const json = (await res.json()) as {
      data?: { matchedUser?: { submissionCalendar?: string } };
    };
    const raw = json.data?.matchedUser?.submissionCalendar;
    if (!raw) return new Map();
    return parseSubmissionCalendarJson(raw);
  } catch {
    return new Map();
  }
}

/** Align LeetCode submission counts to the same ISO dates as the GitHub grid. */
export function buildLeetCodeIntensityGrid(
  datesIso: string[],
  byDate: Map<string, number>,
): number[] {
  return datesIso.map((d) => {
    if (!d) return 0;
    const c = byDate.get(d) ?? 0;
    return intensityFromCount(c);
  });
}

export type LeetCodeSignalSubmission = { atMs: number; title: string; url?: string };

export async function fetchLeetCodeSignalSubmissions(
  username: string,
): Promise<LeetCodeSignalSubmission[]> {
  try {
    const res = await fetch(GQL, {
      method: "POST",
      headers: lcHeaders,
      body: JSON.stringify({ query: RECENT_QUERY, variables: { username } }),
      next: { revalidate: 60 * 60 },
    });
    if (!res.ok) return [];
    const json = (await res.json()) as {
      data?: {
        recentSubmissionList?: {
          title: string;
          statusDisplay: string;
          timestamp: string;
          titleSlug: string;
        }[];
      };
    };
    const list = json.data?.recentSubmissionList ?? [];
    const rows: (LeetCodeSignalSubmission & { slug: string })[] = [];
    for (const s of list) {
      if (s.statusDisplay !== "Accepted") continue;
      const atMs = Number(s.timestamp) * 1000;
      if (!Number.isFinite(atMs)) continue;
      rows.push({
        atMs,
        title: `Solved — ${s.title}`,
        url: `https://leetcode.com/problems/${s.titleSlug}/`,
        slug: s.titleSlug,
      });
    }
    rows.sort((a, b) => b.atMs - a.atMs);
    const seenSlug = new Set<string>();
    const out: LeetCodeSignalSubmission[] = [];
    for (const r of rows) {
      if (seenSlug.has(r.slug)) continue;
      seenSlug.add(r.slug);
      const { slug: _s, ...rest } = r;
      out.push(rest);
    }
    return out;
  } catch {
    return [];
  }
}

/** Live profile stats, or `null` if the user is missing or the request fails. */
export async function fetchLeetCodeStatsMaybe(username: string): Promise<LeetCodeStats | null> {
  try {
    const res = await fetch(GQL, {
      method: "POST",
      headers: lcHeaders,
      body: JSON.stringify({ query: QUERY, variables: { username } }),
      next: { revalidate: 60 * 60 },
    });
    if (!res.ok) return null;
    const json = (await res.json()) as {
      data?: {
        matchedUser?: {
          submitStatsGlobal?: {
            acSubmissionNum?: { difficulty: string; count: number }[];
          };
        };
        userContestRanking?: { rating?: number; globalRanking?: number } | null;
        userContestRankingHistory?: { rating?: number; attended?: boolean }[];
      };
    };
    const u = json.data?.matchedUser;
    if (!u) return null;
    const buckets = Object.fromEntries(
      (u.submitStatsGlobal?.acSubmissionNum ?? []).map((b) => [
        b.difficulty.toLowerCase(),
        b.count,
      ]),
    ) as Record<string, number>;
    const contest = json.data?.userContestRanking;
    const rawCurrent = contest?.rating;
    const currentRating =
      rawCurrent != null && Number.isFinite(rawCurrent) ? rawCurrent : null;
    const rating = peakContestRating(json.data?.userContestRankingHistory, currentRating);
    const rawRank = contest?.globalRanking;
    const globalRanking =
      rawRank != null && Number.isFinite(rawRank) ? Math.round(rawRank) : null;
    return {
      rating,
      globalRanking,
      totalSolved: buckets.all ?? fallbackLeetCode.totalSolved,
      easy: buckets.easy ?? 0,
      medium: buckets.medium ?? 0,
      hard: buckets.hard ?? 0,
    };
  } catch {
    return null;
  }
}

export async function fetchLeetCodeStats(
  username = process.env.LEETCODE_USERNAME ?? "Alan",
): Promise<LeetCodeStats> {
  return (await fetchLeetCodeStatsMaybe(username)) ?? fallbackLeetCode;
}
