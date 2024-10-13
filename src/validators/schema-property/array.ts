import z from 'zod'

// See https://typespec.io/docs/language-basics/built-in-types#numeric-types

export const arraySchemaPropertyValidator = z.object({
  type: z.literal('array'),
  items: z.object({
    $ref: z.string().optional(),
    type: z.union([
      z.literal('string'),
      z.literal('number'),
      z.literal('integer'),
      z.literal('boolean'),
    ]).optional(),
    format: z.string().optional(),
  }),
  minItems: z.number().int().optional(),
  maxItems: z.number().int().optional(),
  description: z.string().optional(),
  default: z.any().array().optional(),
})
