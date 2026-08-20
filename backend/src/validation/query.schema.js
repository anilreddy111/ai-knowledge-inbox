import { z } from "zod";

export const querySchema = z.object({
  question: z
    .string()
    .trim()
    .min(1, "Question is required")
});