import { z } from 'zod'

// https://swagger.io/docs/specification/data-models/data-types/

const dataTypeSchema = z.union([
  z.literal('string'),
  z.literal('number'),
  z.literal('integer'),
  z.literal('boolean'),
  z.literal('array'),
  z.literal('object'),
])

const stringFormatSchema = z.union([
  z.literal('date'),
  z.literal('date-time'),
  z.literal('password'),
  z.literal('uuid'),
  z.literal('email'),
  z.literal('uri'),
  z.literal('ipv4'),
  z.literal('ipv6'),
])

const numberFormatSchema = z.union([
  z.literal('float'),
  z.literal('double'),
  z.literal('int8'),
  z.literal('int16'),
  z.literal('int32'),
  z.literal('int64'),
])

const propertySchema = z.object({
  type: dataTypeSchema,
  format: z.union([stringFormatSchema, numberFormatSchema]).optional(),
  minLength: z.number().optional(),
  maxLength: z.number().optional(),
  minimum: z.number().optional(),
  maximum: z.number().optional(),
  items: z.object({ $ref: z.string() }).optional(),
  minItems: z.number().optional(),
  maxItems: z.number().optional(),
  default: z.union([z.string(), z.number(), z.boolean()]).optional(),
})

export const componentSchema = z.object({
  type: dataTypeSchema,
  required: z.array(z.string()).optional(),
  minItems: z.number().optional(),
  maxItems: z.number().optional(),
  items: z.object({ $ref: z.string() }).optional(),
  properties: z.record(propertySchema).optional(),
  enum: z.array(z.union([z.string(), z.number()])).optional(),
})

export type DataType = z.infer<typeof dataTypeSchema>
export type Format = z.infer<typeof stringFormatSchema | typeof numberFormatSchema>
export type StringFormat = z.infer<typeof stringFormatSchema>
export type NumberFormat = z.infer<typeof numberFormatSchema>
export type Property = z.infer<typeof propertySchema>
export type Component = z.infer<typeof componentSchema>

export type RefCount = {
  [K in keyof Record<string, Component>]: number
}
