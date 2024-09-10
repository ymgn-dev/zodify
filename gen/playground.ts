import { z } from "zod";

export const sampleSchema = z.object({
  a: z.string().date(),

  b: z.string().time(),

  c: z.string().datetime(),

  d: z.string().duration(),

  e: z.string().url(),

  f: z.string().email(),

  g: z.string().uuid(),

  h: z.string().cuid(),

  i: z.string().ip(),
});
