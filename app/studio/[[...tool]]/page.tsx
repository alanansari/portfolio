/**
 * Sanity Studio embedded at /studio.
 * This file must be a Client Component: the Sanity config (plugins, router)
 * is not serializable and cannot be passed from a Server Component into
 * `next-sanity`'s `NextStudio`.
 */
"use client";

import { NextStudio } from "next-sanity/studio";
import config from "@/sanity.config";

export default function StudioPage() {
  return <NextStudio config={config} />;
}
