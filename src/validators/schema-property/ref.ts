import z from 'zod'

// See https://typespec.io/docs/language-basics/built-in-types#numeric-types

export const refSchemaPropertyValidator = z.object({
  type: z.literal('ref').optional().default('ref'),
  $ref: z.string().min(1),
  minItems: z.number().optional(),
  maxItems: z.number().optional(),
  description: z.string().optional(),
  default: z.any().optional(),
})
