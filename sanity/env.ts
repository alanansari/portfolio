export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-06-01";

export const dataset = assertValue(
  process.env.NEXT_PUBLIC_SANITY_DATASET,
  "Missing NEXT_PUBLIC_SANITY_DATASET",
);

export const projectId = assertValue(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  "Missing NEXT_PUBLIC_SANITY_PROJECT_ID",
);

/** When true, responses are served via Sanity's CDN (faster, but can lag after publish/unpublish). Default false for accurate published content. */
export const useCdn = process.env.NEXT_PUBLIC_SANITY_USE_CDN === "true";

function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    // Soft warn in dev; return empty string so local builds without Sanity still work
    if (process.env.NODE_ENV !== "production") {
      console.warn(`[sanity] ${errorMessage}`);
      return "" as T;
    }
    throw new Error(errorMessage);
  }
  return v;
}
