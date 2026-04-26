import type { Social } from "@/sanity/types";

/** GitHub login from profile URL, e.g. https://github.com/alanansari */
export function parseGitHubLoginFromUrl(url: string | undefined): string | null {
  if (!url) return null;
  try {
    const u = new URL(url);
    if (!u.hostname.replace(/^www\./, "").endsWith("github.com")) return null;
    const parts = u.pathname.split("/").filter(Boolean);
    const login = parts[0];
    if (!login || login === "orgs" || login === "settings") return null;
    return decodeURIComponent(login);
  } catch {
    return null;
  }
}

/** LeetCode username from profile URL (supports /u/slug and legacy /slug). */
export function parseLeetCodeUsernameFromUrl(url: string | undefined): string | null {
  if (!url) return null;
  try {
    const u = new URL(url);
    if (!u.hostname.replace(/^www\./, "").endsWith("leetcode.com")) return null;
    const parts = u.pathname.split("/").filter(Boolean);
    const reserved = new Set([
      "problems",
      "discuss",
      "contest",
      "accounts",
      "graphql",
      "api",
      "explore",
      "studyplan",
    ]);
    if (parts[0] === "u" && parts[1]) return decodeURIComponent(parts[1]);
    if (parts[0] === "profile" && parts[1]) return decodeURIComponent(parts[1]);
    if (parts[0] && !reserved.has(parts[0])) return decodeURIComponent(parts[0]);
  } catch {
    /* ignore */
  }
  return null;
}

export function resolveApiHandles(socials: Social[]): {
  githubLogin: string;
  leetcodeUsername: string;
} {
  const ghSocial = socials.find((s) => s.platform === "github");
  const lcSocial = socials.find((s) => s.platform === "leetcode");
  return {
    githubLogin:
      parseGitHubLoginFromUrl(ghSocial?.url) ??
      process.env.GITHUB_USERNAME ??
      "alanansari",
    leetcodeUsername:
      parseLeetCodeUsernameFromUrl(lcSocial?.url) ??
      process.env.LEETCODE_USERNAME ??
      "Alan",
  };
}
