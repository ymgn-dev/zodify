import type z from 'zod'
import type {
  arraySchemaValidator,
  enumNumberSchemaValidator,
  enumStringSchemaValidator,
  objectSchemaValidator,
} from '../validators/schema'

export type SchemaDataType = 'string' | 'number' | 'integer' | 'object' | 'array' | 'boolean'

export type ArraySchema = z.infer<typeof arraySchemaValidator>
export type EnumStringSchema = z.infer<typeof enumStringSchemaValidator>
export type EnumNumberSchema = z.infer<typeof enumNumberSchemaValidator>
export type ObjectSchema = z.infer<typeof objectSchemaValidator>

export type AnySchema =
  | ArraySchema
  | EnumNumberSchema
  | EnumStringSchema
  | ObjectSchema
