import z from 'zod'

// See https://typespec.io/docs/language-basics/built-in-types#numeric-types

export const anyOfSchemaPropertyValidator = z.object({
  type: z.literal('anyOf').optional().default('anyOf'),
  anyOf: z.array(z.any()).min(1),
  description: z.string().optional(),
  default: z.any().array().optional(),
})
