import { z } from "zod";

export const ingestSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("note"),
    title: z.string().trim().min(1, "Title is required"),
    content: z.string().trim().min(1, "Content is required")
  }),

  z.object({
    type: z.literal("url"),
    url: z.string().url("Valid URL is required")
  })
]);