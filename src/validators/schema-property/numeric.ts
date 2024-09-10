import z from 'zod'

// See https://typespec.io/docs/language-basics/built-in-types#numeric-types

export const numberSchemaPropertyFormatValidator = z.union([
  z.literal('float'),
  z.literal('double'),
  z.literal('decimal'),
  z.literal('decimal128'),
]).optional()

export const numberSchemaPropertyValidator = z.object({
  type: z.literal('number'),
  format: numberSchemaPropertyFormatValidator,
  minimum: z.number().optional(),
  maximum: z.number().optional(),
  exclusiveMinimum: z.boolean().optional(),
  exclusiveMaximum: z.boolean().optional(),
  description: z.string().optional(),
  default: z.number().optional(),
})

export const integerSchemaPropertyFormatValidator = z.union([
  z.literal('int64'),
  z.literal('int32'),
  z.literal('int16'),
  z.literal('int8'),
  z.literal('uint64'),
  z.literal('uint32'),
  z.literal('uint16'),
  z.literal('uint8'),
]).optional()

export const integerSchemaPropertyValidator = z.object({
  type: z.literal('integer'),
  format: integerSchemaPropertyFormatValidator,
  minimum: z.number().optional(),
  maximum: z.number().optional(),
  exclusiveMinimum: z.boolean().optional(),
  exclusiveMaximum: z.boolean().optional(),
  description: z.string().optional(),
  default: z.number().int().optional(),
})
