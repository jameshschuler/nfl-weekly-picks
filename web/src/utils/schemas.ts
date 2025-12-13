import { z } from "zod";

export const PickValueSchema = z.union([
  z.number().int().positive(),
  z.literal(null),
]);

export const PicksSchema = z.record(
  z.string().regex(/^\d+$/).transform(Number),
  PickValueSchema
);

export const WeekSchema = z
  .number()
  .int({ message: "Week must be a whole number." })
  .min(1, { message: "Week cannot be less than 1." })
  .max(18, { message: "Week cannot be greater than 18." });
