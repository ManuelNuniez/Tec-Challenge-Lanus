import { z } from "zod";
import { MovementType } from "@/generated/prisma/enums";

export const SEARCH_MAX_LENGTH = 50;

// A search param can arrive repeated (?q=a&q=b); keep the first one.
function firstValue(value: unknown) {
  return Array.isArray(value) ? value[0] : value;
}

// Search and filter come from the URL, so anything can arrive. A value that
// doesn't fit is dropped (empty search, every type) instead of failing the page.
const movementFiltersSchema = z.object({
  q: z.preprocess(
    firstValue,
    z
      .string()
      .catch("")
      .transform((q) => q.trim().slice(0, SEARCH_MAX_LENGTH).trim()),
  ),
  type: z.preprocess(firstValue, z.enum(MovementType).optional().catch(undefined)),
});

export type MovementFilters = z.output<typeof movementFiltersSchema>;

export function parseMovementFilters(
  searchParams: Record<string, string | string[] | undefined>,
): MovementFilters {
  return movementFiltersSchema.parse(searchParams);
}
