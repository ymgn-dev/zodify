import { z } from "zod";

export const aSampleSchema = z.object({
  a: z.array(z.string()).optional(),

  b: z.array(z.string()).default(["sample1", "sample2"]),

  c: z.array(z.string()).optional().default([]),
});

export const bSampleSchema = z.object({
  a: z.boolean().optional(),

  b: z.boolean().default(true),

  c: z.boolean().optional().default(false),
});

export const iSampleSchema = z.object({
  a: z.number().optional(),

  b: z.number().default(42),

  c: z
    .number()

    .optional()
    .default(3.14),
});

export const sSampleSchema = z.object({
  a: z.string().optional(),

  b: z.string().default("サンプル文字列"),

  c: z.string().optional().default("サンプル文字列"),
});
