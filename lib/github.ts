import type { GitHubStats } from "@/sanity/types";
import {
  ACTIVITY_GRID_ROWS,
  activityGridWeeksUtc,
  activityHistoryStartUtc,
  activityGridLenUtc,
  utcCalendarDay,
} from "@/lib/activity-grid";
import { fallbackGitHub } from "@/sanity/fallback";

const API = "https://api.github.com";
const GQL = "https://api.github.com/graphql";

const GRID_ROWS = ACTIVITY_GRID_ROWS;

export function emptyContribGrid(now = new Date()): number[] {
  return Array.from({ length: activityGridLenUtc(now) }, () => 0);
}

/**
 * ISO dates (YYYY-MM-DD) for each heatmap cell, in the same order as
 * `fetchGitHubContributionGrid` (row = weekday Sun→Sat, col = week oldest→newest).
 * Empty string marks a day after “today” in the current partial week.
 */
export function buildContributionGridDatesUtc(now = new Date(), gridWeeks?: number): string[] {
  const GRID_COLS = gridWeeks ?? activityGridWeeksUtc(now);
  const today = utcCalendarDay(now);
  const dow = today.getUTCDay();
  const sundayNewestWeek = new Date(today);
  sundayNewestWeek.setUTCDate(today.getUTCDate() - dow);
  const dates: string[] = [];
  for (let row = 0; row < GRID_ROWS; row++) {
    for (let col = 0; col < GRID_COLS; col++) {
      const d = new Date(sundayNewestWeek);
      d.setUTCDate(sundayNewestWeek.getUTCDate() + (col - (GRID_COLS - 1)) * 7 + row);
      if (d > today) dates.push("");
      else dates.push(d.toISOString().slice(0, 10));
    }
  }
  return dates;
}

export function intensityFromCount(n: number): number {
  if (n <= 0) return 0;
  if (n === 1) return 1;
  if (n <= 3) return 2;
  if (n <= 6) return 3;
  return 4;
}

function graphqlHeaders(): HeadersInit | null {
  const token = process.env.GITHUB_TOKEN;
  if (!token) return null;
  return { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
}

type ContribDay = { date: string; contributionCount: number };
type ContribWeek = { contributionDays: ContribDay[] };

/** Grid aligned to `activity-grid` window; optional sum of raw GitHub contribution counts in that same window. */
export type GitHubContributionGrid = {
  grid: number[];
  dates: string[];
  contributionsTotal?: number;
};

/** Last N×7 cells (row = weekday, col = week), plus parallel ISO dates for LeetCode alignment (GraphQL). */
async function fetchGitHubContributionGridGraphql(
  login: string,
  now = new Date(),
): Promise<GitHubContributionGrid | null> {
  const headers = graphqlHeaders();
  if (!headers) return null;
  const to = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 23, 59, 59, 999),
  );
  const from = new Date(activityHistoryStartUtc(now));
  from.setUTCDate(from.getUTCDate() - 28);
  const query = `query($login:String!,$from:DateTime!,$to:DateTime!){
    user(login:$login) {
      contributionsCollection(from:$from,to:$to) {
        contributionCalendar {
          weeks { contributionDays { date contributionCount } }
        }
      }
    }
  }`;
  try {
    const res = await fetch(GQL, {
      method: "POST",
      headers,
      body: JSON.stringify({
        query,
        variables: { login, from: from.toISOString(), to: to.toISOString() },
      }),
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    const body = (await res.json()) as {
      data?: { user?: { contributionsCollection?: { contributionCalendar?: { weeks?: ContribWeek[] } } } };
      errors?: { message: string }[];
    };
    if (body.errors?.length) return null;
    const weeks = body.data?.user?.contributionsCollection?.contributionCalendar?.weeks;
    if (!weeks?.length) return null;
    const countsByDate = new Map<string, number>();
    for (const w of weeks) {
      for (const day of w.contributionDays ?? []) {
        if (!day?.date) continue;
        countsByDate.set(day.date, (countsByDate.get(day.date) ?? 0) + day.contributionCount);
      }
    }
    const canonicalDates = buildContributionGridDatesUtc(now);
    let contributionsTotal = 0;
    const grid: number[] = [];
    for (const d of canonicalDates) {
      if (!d) {
        grid.push(0);
        continue;
      }
      const c = countsByDate.get(d) ?? 0;
      contributionsTotal += c;
      grid.push(intensityFromCount(c));
    }
    return { grid, dates: canonicalDates, contributionsTotal };
  } catch {
    return null;
  }
}

function utcDateKeyFromCreatedAt(createdAt: string): string | null {
  const t = Date.parse(createdAt);
  if (!Number.isFinite(t)) return null;
  return new Date(t).toISOString().slice(0, 10);
}

/** Approximate per-day activity from public events (no official contribution calendar). */
function bumpContributionCountsFromEvent(ev: Record<string, unknown>, counts: Map<string, number>): void {
  const createdAt = ev.created_at as string | undefined;
  const dayKey = createdAt ? utcDateKeyFromCreatedAt(createdAt) : null;
  if (!dayKey) return;
  const type = ev.type as string | undefined;
  const payload = (ev.payload ?? {}) as Record<string, unknown>;
  let delta = 0;
  if (type === "PushEvent") {
    const size = typeof payload.size === "number" ? payload.size : 1;
    delta = Math.max(1, Math.min(size, 25));
  } else if (
    type === "PullRequestEvent" ||
    type === "IssuesEvent" ||
    type === "CreateEvent" ||
    type === "ForkEvent" ||
    type === "ReleaseEvent" ||
    type === "WatchEvent" ||
    type === "PublicEvent" ||
    type === "DeleteEvent"
  ) {
    delta = 1;
  } else {
    return;
  }
  counts.set(dayKey, (counts.get(dayKey) ?? 0) + delta);
}

/**
 * When GraphQL contribution calendar is unavailable, derive intensities from
 * `/users/{login}/events/public` (aligned to the same grid dates as the UI).
 */
function sumContributionsForGridDates(dates: string[], counts: Map<string, number>): number {
  let sum = 0;
  for (const d of dates) {
    if (d) sum += counts.get(d) ?? 0;
  }
  return sum;
}

export async function fetchGitHubContributionGridFromPublicEvents(
  login: string,
  now = new Date(),
): Promise<GitHubContributionGrid | null> {
  const dates = buildContributionGridDatesUtc(now);
  const validDates = dates.filter(Boolean);
  const gridStartMs = validDates.length
    ? Date.parse([...validDates].sort()[0] + "T00:00:00.000Z")
    : 0;
  const counts = new Map<string, number>();
  const maxPages = process.env.GITHUB_TOKEN ? 8 : 2;

  try {
    for (let page = 1; page <= maxPages; page++) {
      const res = await fetch(
        `${API}/users/${encodeURIComponent(login)}/events/public?per_page=100&page=${page}`,
        { headers: authHeaders(), next: { revalidate: 300 } },
      );
      if (!res.ok) {
        if (page === 1 && process.env.NODE_ENV === "development") {
          console.warn(
            `[portfolio/activity] GitHub public events HTTP ${res.status} for @${login}. ` +
              `Set GITHUB_TOKEN (see .env.example) and confirm the GitHub login matches your profile.`,
          );
        }
        return page === 1
          ? null
          : {
              grid: buildIntensityGridFromCounts(dates, counts),
              dates,
              contributionsTotal: sumContributionsForGridDates(dates, counts),
            };
      }
      const events = (await res.json()) as Record<string, unknown>[];
      if (!Array.isArray(events) || events.length === 0) break;

      for (const ev of events) {
        bumpContributionCountsFromEvent(ev, counts);
      }

      const oldestInPage = events[events.length - 1]?.created_at as string | undefined;
      const oldestMs = oldestInPage ? Date.parse(oldestInPage) : NaN;
      if (Number.isFinite(oldestMs) && oldestMs < gridStartMs) break;
      if (events.length < 100) break;
    }

    return {
      grid: buildIntensityGridFromCounts(dates, counts),
      dates,
      contributionsTotal: sumContributionsForGridDates(dates, counts),
    };
  } catch {
    return null;
  }
}

function buildIntensityGridFromCounts(dates: string[], counts: Map<string, number>): number[] {
  return dates.map((d) => (!d ? 0 : intensityFromCount(counts.get(d) ?? 0)));
}

/**
 * Prefers the official contribution calendar (requires GITHUB_TOKEN); otherwise uses public events.
 */
export async function fetchGitHubContributionGrid(
  login: string,
  now = new Date(),
): Promise<GitHubContributionGrid | null> {
  const gql = await fetchGitHubContributionGridGraphql(login, now);
  if (gql) return gql;

  if (!process.env.GITHUB_TOKEN && process.env.NODE_ENV === "development") {
    console.warn(
      "[portfolio/activity] GITHUB_TOKEN is not set — GitHub heatmap uses public events only " +
        "(approximate). Add a PAT with read:user for the same calendar as on github.com.",
    );
  }

  const fromEvents = await fetchGitHubContributionGridFromPublicEvents(login, now);
  if (fromEvents) return fromEvents;

  if (process.env.NODE_ENV === "development") {
    console.warn(
      "[portfolio/activity] GitHub heatmap unavailable. Fix: (1) Add GITHUB_TOKEN to .env.local " +
        "(classic PAT: read:user, or fine-grained with user read). (2) Match GitHub social URL or " +
        "GITHUB_USERNAME to the account. (3) Ensure the token is not expired; GraphQL must resolve user(login).",
    );
  }

  return null;
}

export type GitHubSignalEvent = { atMs: number; title: string; url?: string };

export async function fetchGitHubSignalEvents(login: string): Promise<GitHubSignalEvent[]> {
  try {
    const res = await fetch(`${API}/users/${encodeURIComponent(login)}/events/public?per_page=14`, {
      headers: authHeaders(),
      next: { revalidate: 60 * 60 },
    });
    if (!res.ok) return [];
    const events = (await res.json()) as Record<string, unknown>[];
    const out: GitHubSignalEvent[] = [];
    for (const ev of events) {
      const parsed = mapGithubEvent(ev);
      if (parsed) out.push(parsed);
    }
    return out;
  } catch {
    return [];
  }
}

function mapGithubEvent(ev: Record<string, unknown>): GitHubSignalEvent | null {
  const type = ev.type as string | undefined;
  const createdAt = ev.created_at as string | undefined;
  const repo = (ev.repo as { name?: string } | undefined)?.name ?? "?";
  const atMs = createdAt ? Date.parse(createdAt) : NaN;
  if (!Number.isFinite(atMs)) return null;
  const payload = (ev.payload ?? {}) as Record<string, unknown>;

  if (type === "PushEvent") {
    const size = typeof payload.size === "number" ? payload.size : 0;
    const ref = typeof payload.ref === "string" ? payload.ref.split("/").pop() : "";
    const bit =
      size > 1 ? `${size} commits` : ref ? `commit on ${ref}` : "commit";
    return { atMs, title: `Pushed — ${bit} · ${repo}` };
  }
  if (type === "PullRequestEvent") {
    const pr = payload.pull_request as { title?: string; html_url?: string } | undefined;
    const action = (payload.action as string) ?? "";
    if (!pr?.title) return null;
    const prefix =
      action === "opened" ? "Opened PR" : action === "closed" ? "Closed PR" : "PR · " + action;
    return { atMs, title: `${prefix} — ${pr.title}`, url: pr.html_url };
  }
  if (type === "IssuesEvent") {
    const issue = payload.issue as { title?: string; html_url?: string } | undefined;
    const action = (payload.action as string) ?? "";
    if (!issue?.title) return null;
    return {
      atMs,
      title: `Issue ${action} — ${issue.title}`,
      url: issue.html_url,
    };
  }
  if (type === "WatchEvent") {
    if (payload.action !== "started") return null;
    return { atMs, title: `Starred — ${repo}`, url: `https://github.com/${repo}` };
  }
  if (type === "CreateEvent") {
    const refType = typeof payload.ref_type === "string" ? payload.ref_type : "";
    const ref = typeof payload.ref === "string" ? payload.ref : "";
    if (refType === "repository") return { atMs, title: `Created repo — ${repo}` };
    if (ref) return { atMs, title: `Created ${refType || "ref"} — ${ref} · ${repo}` };
    return { atMs, title: `Created — ${repo}` };
  }
  if (type === "ForkEvent") {
    const fork = payload.forkee as { full_name?: string; html_url?: string } | undefined;
    if (!fork?.full_name) return null;
    return { atMs, title: `Forked — ${repo} → ${fork.full_name}`, url: fork.html_url };
  }
  if (type === "ReleaseEvent") {
    const rel = payload.release as { name?: string; html_url?: string } | undefined;
    if (!rel?.name) return null;
    return { atMs, title: `Release — ${rel.name} · ${repo}`, url: rel.html_url };
  }
  return null;
}

type Repo = {
  name: string;
  stargazers_count: number;
  language: string | null;
  fork: boolean;
};

function authHeaders(): HeadersInit {
  const token = process.env.GITHUB_TOKEN;
  const base: HeadersInit = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  return token ? { ...base, Authorization: `Bearer ${token}` } : base;
}

// Compresses repos into a language histogram.
export async function fetchGitHubStatsMaybe(
  username = process.env.GITHUB_USERNAME ?? "alanansari",
): Promise<GitHubStats | null> {
  try {
    const [reposRes, searchPrRes, userRes] = await Promise.all([
      fetch(`${API}/users/${username}/repos?per_page=100&sort=updated`, {
        headers: authHeaders(),
        next: { revalidate: 60 * 60 },
      }),
      fetch(
        `${API}/search/issues?q=${encodeURIComponent(
          `author:${username} type:pr is:merged`,
        )}`,
        { headers: authHeaders(), next: { revalidate: 60 * 60 } },
      ),
      fetch(`${API}/users/${username}`, {
        headers: authHeaders(),
        next: { revalidate: 60 * 60 },
      }),
    ]);

    if (!reposRes.ok || !userRes.ok) throw new Error("github fetch failed");

    const repos = (await reposRes.json()) as Repo[];
    const user = (await userRes.json()) as { public_repos: number };
    const pr = searchPrRes.ok
      ? ((await searchPrRes.json()) as { total_count?: number })
      : { total_count: 0 };

    const langs: Record<string, number> = {};
    let stars = 0;
    for (const r of repos) {
      if (r.fork) continue;
      if (r.language) langs[r.language] = (langs[r.language] || 0) + 1;
      stars += r.stargazers_count;
    }
    const topLanguages = Object.entries(langs)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([l]) => l);

    const grid = await fetchGitHubContributionGrid(username, new Date());
    const fromGrid = grid?.contributionsTotal;
    // Prefer summed contribution counts for the same window as the heatmap; otherwise a coarse estimate.
    const commits =
      typeof fromGrid === "number" && fromGrid >= 0 ? fromGrid : Math.max(stars * 6, 100);

    return {
      commits,
      repos: user.public_repos ?? repos.length,
      prsMerged: pr.total_count ?? 0,
      topLanguages,
      contribs: grid?.grid ?? emptyContribGrid(),
    };
  } catch {
    return null;
  }
}

export async function fetchGitHubStats(
  username = process.env.GITHUB_USERNAME ?? "alanansari",
): Promise<GitHubStats> {
  return (await fetchGitHubStatsMaybe(username)) ?? fallbackGitHub;
}
