import { z } from "zod";

// Numeric test
export const numericTestSchema = z.object({
  a: z.number(),
  b: z.number().int(),
  c: z.number(),
  d: z.number().int(),
  e: z.number().int(),
  f: z.number().int(),
  g: z.number().int(),
  h: z.number().int(),
  i: z.number().int(),
  j: z.number().int(),
  k: z.number().int(),
  l: z.number().int(),
  m: z.number(),
  n: z.number(),
  o: z.number(),
  p: z.number(),
});
