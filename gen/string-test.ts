import { z } from "zod";

// String test
export const stringTestSchema = z.object({
  a: z.string(),
  b: z.string().date(),
  c: z.string().time(),
  d: z.string().datetime(),
  e: z.string().datetime(),
  f: z.string().duration(),
  g: z.string().url(),
});
