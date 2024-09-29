import { z } from "zod";

export const otherModelSchema = z.object({
  id: z.string().uuid(),
});

// Array test
export const sampleSchema = z.object({
  a: z.array(z.string()).optional(),
  b: z.array(z.string()).default(["sample1", "sample2"]),
  c: z.array(z.string()).optional().default([]),
  d: z.array(z.number().int()).default([4, 8, 32]),
  e: z.array(otherModelSchema).default([]),
});
