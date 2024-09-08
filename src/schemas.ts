import { z } from 'zod'

// https://swagger.io/docs/specification/data-models/data-types/

const dataTypeLiteralSchema = z.union([
  z.literal('string'),
  z.literal('number'),
  z.literal('integer'),
  z.literal('boolean'),
  z.literal('array'),
  z.literal('object'),
])

const formatSchema = z.union([
  z.literal('float'),
  z.literal('double'),
  z.literal('int8'),
  z.literal('int16'),
  z.literal('int32'),
  z.literal('int64'),
  z.literal('date'),
  z.literal('date-time'),
  z.literal('password'),
  z.literal('byte'),
  z.literal('binary'),

  // custom formats
  z.literal('uuid'),
  z.literal('email'),
  z.literal('uri'),
  z.literal('ipv4'),
  z.literal('ipv6'),
])

export const componentSchema = z.object({
  type: dataTypeLiteralSchema,
  required: z.array(z.string()).optional(),
  maxItems: z.number().optional(),
  items: z.object({ $ref: z.string() }).optional(),
  properties: z.record(z.object({
    type: dataTypeLiteralSchema,
    format: formatSchema.optional(),
    minLength: z.number().optional(),
    maxLength: z.number().optional(),
    minimum: z.number().optional(),
    maximum: z.number().optional(),
  })).optional(),
  enum: z.array(z.union([z.string(), z.number()])).optional(),
})

export type DataTypeLiteral = z.infer<typeof dataTypeLiteralSchema>
export type Format = z.infer<typeof formatSchema>
export type Component = z.infer<typeof componentSchema>
