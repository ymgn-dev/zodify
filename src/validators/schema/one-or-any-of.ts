import z from 'zod'

// See https://typespec.io/docs/language-basics/models

export const oneOrAnyOfSchemaValidator = z.object({
  type: z.union([z.literal('anyOf'), z.literal('oneOf')]).optional().default('anyOf'),
  anyOf: z.array(z.any()).optional(),
  oneOf: z.array(z.any()).optional(),
  description: z.string().optional(),
})
