import { z } from "zod";

export const petSchema = z.object({
  id: z.number(),

  name: z.string(),

  tag: z.string().optional(),
});

export const errorSchema = z.object({
  code: z.number(),

  message: z.string(),
});

export const petsSchema = z.array(petSchema).max(100);
