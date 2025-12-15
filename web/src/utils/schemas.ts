import { z } from "zod";

export const PicksSchema = z.record(
  z.string().regex(/^\d+$/).transform(Number),
  z.number().int().positive()
);

export const WeekSchema = z
  .number()
  .int({ error: "Week must be a whole number." })
  .positive({ error: "Week must be a positive number." })
  .min(1, { error: "Week cannot be less than 1." })
  .max(18, { error: "Week cannot be greater than 18." });

import { z } from "zod";

export const LeagueIdSchema = z.preprocess(
  (val) => {
    const processed = typeof val === "string" ? parseFloat(val) : val;
    return processed;
  },
  z
    .number({
      error: "League ID must be a valid number string.",
    })
    .int({ error: "League ID must be a whole number." })
    .positive({ error: "League ID must be a positive number." })
);
