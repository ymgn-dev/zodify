import z from 'zod'

// See https://typespec.io/docs/language-basics/built-in-types#numeric-types

export const oneOfAnyOfSchemaPropertyValidator = z.object({
  type: z.union([z.literal('anyOf'), z.literal('oneOf')]).optional().default('anyOf'),
  anyOf: z.array(z.any()).min(1),
  description: z.string().optional(),
  default: z.any().array().optional(),
})
