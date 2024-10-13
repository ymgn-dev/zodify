import z from 'zod'

// See https://typespec.io/docs/language-basics/built-in-types#numeric-types

export const oneOfAnyOfSchemaPropertyValidator = z.object({
  type: z.union([z.literal('anyOf'), z.literal('oneOf')]).optional().default('anyOf'),
  anyOf: z.array(z.any()).optional(),
  oneOf: z.array(z.any()).optional(),
  description: z.string().optional(),
  default: z.any().array().optional(),
}).refine(
  data => (data.anyOf?.length ?? 0) > 0 || (data.oneOf?.length ?? 0) > 0,
  {
    message: 'Either \'anyOf\' or \'oneOf\' must have at least one element',
  },
)
