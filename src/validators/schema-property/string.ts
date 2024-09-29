import z from 'zod'

// See https://typespec.io/docs/language-basics/built-in-types#numeric-types

export const stringSchemaPropertyFormatValidator = z.union([
  // Date and time types
  z.literal('date'),
  z.literal('date-time'),
  z.literal('duration'),
  z.literal('time'),

  // Other core types
  z.literal('byte'),

  // String types
  z.literal('uri'),

  // Custom types
  z.literal('email'),
  z.literal('uuid'),
  z.literal('cuid'),
  z.literal('ip'),
]).optional()

export const stringSchemaPropertyValidator = z.object({
  type: z.literal('string'),
  minLength: z.number().int().optional(),
  maxLength: z.number().int().optional(),
  format: stringSchemaPropertyFormatValidator,
  description: z.string().optional(),
  default: z.string().optional(),
})
