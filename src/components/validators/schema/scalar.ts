import z from 'zod'

// See https://typespec.io/docs/language-basics/scalars

export const scalarSchemaValidator = z.object({
  type: z.literal('string'),
  enum: z.array(z.string()),
  description: z.string().optional(),
})
