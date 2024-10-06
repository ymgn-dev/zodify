import z from 'zod'

// See https://typespec.io/docs/language-basics/built-in-types#numeric-types

export const booleanSchemaPropertyValidator = z.object({
  type: z.literal('boolean'),
  description: z.string().optional(),
  default: z.boolean().optional(),
})
