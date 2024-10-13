import z from 'zod'

// See https://typespec.io/docs/language-basics/built-in-types#numeric-types

export const allOfSchemaPropertyValidator = z.object({
  type: z.literal('allOf').optional().default('allOf'),
  allOf: z.array(z.object({ $ref: z.string() })).min(1),
  description: z.string().optional(),
})
