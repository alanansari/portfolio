/** Weekday rows in the heatmap (Sun→Sat). */
export const ACTIVITY_GRID_ROWS = 7;

/** Rolling activity window in calendar months (heatmap columns + API date range). */
export const ACTIVITY_HISTORY_MONTHS = 8;

export function utcCalendarDay(now: Date): Date {
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
}

/** Sunday 00:00 UTC of the week that contains `d` (GitHub contribution calendar convention). */
export function sundayOfWeekContainingUtc(d: Date): Date {
  const x = utcCalendarDay(d);
  const dow = x.getUTCDay();
  x.setUTCDate(x.getUTCDate() - dow);
  return x;
}

/**
 * Oldest UTC date included in the heatmap: first day of the month `monthsBack`
 * before the current calendar day. Using the 1st ensures the full starting month
 * (e.g. all of August) stays inside an ~8‑month strip.
 */
export function activityHistoryStartUtc(
  now: Date,
  monthsBack = ACTIVITY_HISTORY_MONTHS,
): Date {
  const x = utcCalendarDay(now);
  x.setUTCMonth(x.getUTCMonth() - monthsBack);
  x.setUTCDate(1);
  return x;
}

/** Week columns from history start through the current week (inclusive). */
export function activityGridWeeksUtc(now = new Date()): number {
  const today = utcCalendarDay(now);
  const sunNew = sundayOfWeekContainingUtc(today);
  const hist = activityHistoryStartUtc(now);
  const sunOld = sundayOfWeekContainingUtc(hist);
  const diffDays = Math.round((sunNew.getTime() - sunOld.getTime()) / 86400000);
  const weeks = Math.floor(diffDays / 7) + 1;
  return Math.max(1, weeks);
}

export function activityGridLenUtc(now = new Date()): number {
  return activityGridWeeksUtc(now) * ACTIVITY_GRID_ROWS;
}

/** Pad / trim so CSS always gets exactly one value per heatmap cell for `now`'s grid size. */
export function padContribArray(arr: number[] | undefined, now = new Date()): number[] {
  const target = activityGridLenUtc(now);
  const out = [...(arr ?? [])];
  while (out.length < target) out.push(0);
  return out.slice(0, target);
}
