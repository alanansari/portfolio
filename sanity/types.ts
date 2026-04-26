export type Profile = {
  name: string;
  initial: string;
  location: string;
  role: string;
  availability: string;
  statusNote: string;
  kicker: string;
  headline: string; // first part
  headlineAccent: string; // accent / serif part
  tagline: string;
  aboutLede: string;
  aboutFacts: { key: string; value: string; accent?: string }[];
  currentlyBuilding: string;
  resumeUrl?: string;
};

export type Experience = {
  _id: string;
  role: string;
  company: string;
  companyUrl?: string;
  locationLine: string;
  period: string;
  order: number;
  points: string[];
  stack: string[];
};

export type SkillCategory = {
  _id: string;
  title: string;
  order: number;
  skills: string[];
};

export type VizKind = "buzrr" | "benefi" | "jsgamez" | "samriddhi" | "image";

export type Project = {
  _id: string;
  title: string;
  description: string;
  role: string;
  year: string;
  order: number;
  image?: { asset?: { _ref: string } };
  viz: VizKind;
  projectUrl?: string;
  tech: string[];
};

export type Social = {
  _id: string;
  label: string;
  platform: "github" | "linkedin" | "email" | "leetcode" | "custom";
  handle: string;
  url: string;
  order: number;
};

export type GitHubStats = {
  commits: number;
  repos: number;
  prsMerged: number;
  topLanguages: string[];
  contribs: number[]; // length matches lib/activity-grid heatmap for render time (≈8 months)
};

export type LeetCodeStats = {
  /** Peak weekly contest rating (max over attended contests); null if unrated or not returned by the API. */
  rating: number | null;
  /** Contest global ranking (worldwide); null if never attended or hidden. */
  globalRanking: number | null;
  totalSolved: number;
  easy: number;
  medium: number;
  hard: number;
};

/** Recent activity row shown in the Now section (GitHub + LeetCode APIs). */
export type ActivitySignal = {
  when: string;
  what: string;
  /** Short label from APIs (`gh`, `lc`). */
  tag: string;
  url?: string;
};

export type ActivityBlock = {
  githubContribs: number[];
  leetcodeContribs: number[];
  signals: ActivitySignal[];
};

export type Stats = {
  github: GitHubStats;
  leetcode: LeetCodeStats;
  activity: ActivityBlock;
  updatedAt: string;
};
