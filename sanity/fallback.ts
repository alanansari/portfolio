import type {
  ActivitySignal,
  Experience,
  GitHubStats,
  LeetCodeStats,
  Profile,
  Project,
  SkillCategory,
  Social,
  Stats,
} from "./types";
import { activityGridLenUtc } from "../lib/activity-grid";

function emptyContribGrid(): number[] {
  return Array.from({ length: activityGridLenUtc() }, () => 0);
}

// The app falls back to this data when Sanity isn't configured yet, so the
// portfolio still renders locally with the designed content.

export const fallbackProfile: Profile = {
  name: "Alan Ansari",
  initial: "A",
  location: "NOIDA · IN",
  role: "FullStack Developer",
  availability: "Open to new work · Remote",
  statusNote: "",
  kicker: "Based in India · Working globally",
  headline: "Alan Ansari",
  headlineAccent: ".",
  tagline:
    "Full-stack developer building fast, thoughtful web interfaces. Currently architecting the frontend at Benefi.",
  aboutLede:
    "I write javascript for a living, and care a lot about how interfaces feel. Two years in, I've shipped fintech MVPs, search backends, and multiplayer quiz platforms - all with an eye on the thing that actually ships.",
  aboutFacts: [
    { key: "BASED", value: "NOIDA, Uttar Pradesh -", accent: "IN" },
    { key: "ROLE", value: "SDE (Web) · Benefi Global · ", accent: "remote" },
    { key: "EDUCATION", value: "B. Tech CS · ", accent: "2025 Grad" },
    { key: "Favorite stack", value: "Next.js, Tailwind, Prisma" },
    { key: "ALSO", value: "Loves pop culture" },
  ],
  currentlyBuilding:
    "Shipping robust donation flows at Benefi and re-architecting Buzrr for scale, speed, and security, while growing every day through problem-solving",
  resumeUrl: "http://devalan.in/resume",
};

export const fallbackExperience: Experience[] = [
  {
    _id: "x1",
    role: "SDE (Web)",
    company: "Benefi Global Corp",
    locationLine: "US · Remote",
    period: "Mar 2025 — Present",
    order: 0,
    points: [
      "Architected & developed the frontend codebase for Benefi's fintech MVP — a donation platform enabling donors to give to charities, including via bank, card, crypto and stock donations.",
      "Implemented secure authentication workflows and integrated TanStack Query for performant and scalable data-fetching.",
      "Partnered with PMs and designers to ship a sleek, responsive and pixel-perfect UI aligned with business requirements.",
    ],
    stack: ["Next.js", "SCSS", "JavaScript", "Tanstack Query", "Stripe", "Plaid"],
  },
  {
    _id: "x2",
    role: "Full-Stack Developer · Intern",
    company: "MathonGo",
    locationLine: "Bengaluru · Remote",
    period: "May 2023 — Jan 2024",
    order: 1,
    points: [
      "Built customer-facing interfaces with Next.js + TailwindCSS.",
      "Integrated Typesense, an open-source search engine, into the backend.",
      "Developed REST APIs in Node + Express and made responses 70% faster using Redis caching.",
    ],
    stack: ["Node.js", "Express ", "Redis ", "Typesense", "Next.js", "TailwindCSS"],
  },
];

export const fallbackSkills: SkillCategory[] = [
  { _id: "s1", title: "LANGUAGES", order: 0, skills: ["TypeScript", "JavaScript", "C / C++", "HTML ", "SCSS"] },
  { _id: "s2", title: "FRAMEWORKS", order: 1, skills: ["Next.js", "Node.js", "Express", "TailwindCSS", "Docker"] },
  {
    _id: "s3",
    title: "LIBRARIES",
    order: 2,
    skills: ["React", "Redux Toolkit ", "TanStack Query", "Mongoose", "Prisma", "shadcn/ui", "MUI"],
  },
  { _id: "s4", title: "DATABASES", order: 3, skills: ["MongoDB", "PostgreSQL", "Redis"] },
  { _id: "s5", title: "DEV TOOLS", order: 4, skills: ["Cursor", "Claude", "Git", "Postman"] },
];

export const fallbackProjects: Project[] = [
  {
    _id: "p1",
    title: "Buzrr",
    description:
      "Buzrr is a real-time multiplayer quiz platform where users compete in fast-paced knowledge battles. (Like Kahoot)",
    role: "Side project",
    year: "2025",
    order: 0,
    viz: "buzrr",
    projectUrl: "https://buzrr.in",
    image: {
      asset: { _ref: "image-27fa1fba95de666cb8466501ed3f275349e048c6-1586x992-png" },
    },
    tech: ["Next.js", "TailwindCSS", "Tanstack Query", "NestJS", "TypeScript", "NextAuth"],
  },
  {
    _id: "p3",
    title: "jsGamez",
    description:
      "An arcade style collection of multiple classic retro games (Snake and Breakout).",
    role: "Side project",
    year: "2023",
    order: 2,
    viz: "jsgamez",
    projectUrl: "https://alanansari.github.io/jsGamez/",
    image: {
      asset: { _ref: "image-42e2d71cabd669f14806dba73a78d6468178eed6-1536x1024-png" },
    },
    tech: ["HTML", "CSS", "Vanilla JS"],
  },
];

export const fallbackSocials: Social[] = [
  { _id: "so1", label: "Email", platform: "email", handle: "ansarialan31@gmail.com", url: "mailto:ansarialan31@gmail.com", order: 0 },
  { _id: "so2", label: "LinkedIn", platform: "linkedin", handle: "alanansari", url: "https://www.linkedin.com/in/alanansari/", order: 1 },
  { _id: "so3", label: "Github", platform: "github", handle: "@alanansari", url: "https://github.com/alanansari", order: 2 },
  {
    _id: "so4",
    label: "Leetcode",
    platform: "leetcode",
    handle: "_Alan_",
    url: "https://leetcode.com/u/_Alan_/",
    order: 3,
  },
];

export const fallbackGitHub: GitHubStats = {
  commits: 41,
  repos: 39,
  prsMerged: 139,
  topLanguages: ["JavaScript", "TypeScript", "C++", "CSS", "HTML"],
  contribs: emptyContribGrid(),
};

export const fallbackLeetCode: LeetCodeStats = {
  rating: 1698,
  globalRanking: 119_273,
  totalSolved: 349,
  easy: 138,
  medium: 199,
  hard: 12,
};

export const fallbackActivity = {
  githubContribs: emptyContribGrid(),
  leetcodeContribs: emptyContribGrid(),
  signals: [] as ActivitySignal[],
};

export const fallbackStats: Stats = {
  github: fallbackGitHub,
  leetcode: fallbackLeetCode,
  activity: fallbackActivity,
  updatedAt: new Date().toISOString(),
};
