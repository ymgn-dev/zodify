import z from 'zod'

// See https://typespec.io/docs/language-basics/models

export const enumStringSchemaValidator = z.object({
  type: z.literal('string'),
  enum: z.array(z.string()),
  description: z.string().optional(),
})

export const enumNumberSchemaValidator = z.object({
  type: z.literal('number'),
  enum: z.array(z.number()),
  description: z.string().optional(),
})
