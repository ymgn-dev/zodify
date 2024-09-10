import type z from 'zod'
import type {
  arraySchemaPropertyValidator,
  booleanSchemaPropertyValidator,
  integerSchemaPropertyFormatValidator,
  integerSchemaPropertyValidator,
  numberSchemaPropertyFormatValidator,
  numberSchemaPropertyValidator,
  refSchemaPropertyValidator,
  stringSchemaPropertyFormatValidator,
  stringSchemaPropertyValidator,
} from '../validators/schema-property'

export type ArraySchemaProperty = z.infer<typeof arraySchemaPropertyValidator>
export type BooleanSchemaProperty = z.infer<typeof booleanSchemaPropertyValidator>
export type NumberSchemaProperty = z.infer<typeof numberSchemaPropertyValidator>
export type IntegerSchemaProperty = z.infer<typeof integerSchemaPropertyValidator>
export type StringSchemaProperty = z.infer<typeof stringSchemaPropertyValidator>
export type RefSchemaProperty = z.infer<typeof refSchemaPropertyValidator>

export type StringSchemaPropertyFormat = z.infer<typeof stringSchemaPropertyFormatValidator>
export type NumberSchemaPropertyFormat = z.infer<typeof numberSchemaPropertyFormatValidator>
export type IntegerSchemaPropertyFormat = z.infer<typeof integerSchemaPropertyFormatValidator>
export type AnySchemaPropertyFormat = StringSchemaPropertyFormat | NumberSchemaPropertyFormat | IntegerSchemaPropertyFormat
