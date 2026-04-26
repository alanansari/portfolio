import { client } from "@/sanity/client";
import {
  experienceQuery,
  profileQuery,
  projectsQuery,
  skillsQuery,
  socialsQuery,
} from "@/sanity/queries";
import {
  fallbackExperience,
  fallbackProfile,
  fallbackProjects,
  fallbackSkills,
  fallbackSocials,
} from "@/sanity/fallback";
import type { Experience, Profile, Project, SkillCategory, Social } from "@/sanity/types";

// Returns Sanity content when configured, otherwise falls back to the static
// design content so the site renders out-of-the-box.

const hasSanity = () =>
  !!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID &&
  !!process.env.NEXT_PUBLIC_SANITY_DATASET;

/** Skip Next.js Data Cache so publish/unpublish reflects on the next request (not a stale GROQ snapshot). */
const sanityFetchInit = { next: { revalidate: 0 } } as const;

export async function getProfile(): Promise<Profile> {
  if (!hasSanity()) return fallbackProfile;
  try {
    const p = await client.fetch<Profile | null>(profileQuery, {}, sanityFetchInit);
    return p ?? fallbackProfile;
  } catch {
    return fallbackProfile;
  }
}

export async function getExperience(): Promise<Experience[]> {
  if (!hasSanity()) return fallbackExperience;
  try {
    const d = await client.fetch<Experience[]>(experienceQuery, {}, sanityFetchInit);
    return d.length ? d : fallbackExperience;
  } catch {
    return fallbackExperience;
  }
}

export async function getSkills(): Promise<SkillCategory[]> {
  if (!hasSanity()) return fallbackSkills;
  try {
    const d = await client.fetch<SkillCategory[]>(skillsQuery, {}, sanityFetchInit);
    return d.length ? d : fallbackSkills;
  } catch {
    return fallbackSkills;
  }
}

export async function getProjects(): Promise<Project[]> {
  if (!hasSanity()) return fallbackProjects;
  try {
    const d = await client.fetch<Project[]>(projectsQuery, {}, sanityFetchInit);
    return d.length ? d : fallbackProjects;
  } catch {
    return fallbackProjects;
  }
}

export async function getSocials(): Promise<Social[]> {
  if (!hasSanity()) return fallbackSocials;
  try {
    const d = await client.fetch<Social[]>(socialsQuery, {}, sanityFetchInit);
    return d.length ? d : fallbackSocials;
  } catch {
    return fallbackSocials;
  }
}
