import { startOfDay, subDays, subMonths } from "date-fns";

export function parseCreatedAfter(range: string | undefined): string | null {
  if (!range || range === "all") return null;
  const now = new Date();
  if (range === "today") return startOfDay(now).toISOString();
  if (range === "week") return startOfDay(subDays(now, 7)).toISOString();
  if (range === "month") return startOfDay(subMonths(now, 1)).toISOString();
  return null;
}
