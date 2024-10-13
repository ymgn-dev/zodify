import type z from 'zod'
import type {
  allOfSchemaPropertyValidator,
  arraySchemaPropertyValidator,
  booleanSchemaPropertyValidator,
  extendDocSchemaPropertyValidator,
  integerSchemaPropertyFormatValidator,
  integerSchemaPropertyValidator,
  numberSchemaPropertyFormatValidator,
  numberSchemaPropertyValidator,
  oneOfAnyOfSchemaPropertyValidator,
  refSchemaPropertyValidator,
  stringSchemaPropertyFormatValidator,
  stringSchemaPropertyValidator,
} from '../validators/schema-property'

export type AllOfSchemaProperty = z.infer<typeof allOfSchemaPropertyValidator>
export type ArraySchemaProperty = z.infer<typeof arraySchemaPropertyValidator>
export type BooleanSchemaProperty = z.infer<typeof booleanSchemaPropertyValidator>
export type ExtendDocSchemaProperty = z.infer<typeof extendDocSchemaPropertyValidator>
export type NumberSchemaProperty = z.infer<typeof numberSchemaPropertyValidator>
export type IntegerSchemaProperty = z.infer<typeof integerSchemaPropertyValidator>
export type OneOrAnyOfSchemaProperty = z.infer<typeof oneOfAnyOfSchemaPropertyValidator>
export type StringSchemaProperty = z.infer<typeof stringSchemaPropertyValidator>
export type RefSchemaProperty = z.infer<typeof refSchemaPropertyValidator>

export type StringSchemaPropertyFormat = z.infer<typeof stringSchemaPropertyFormatValidator>
export type NumberSchemaPropertyFormat = z.infer<typeof numberSchemaPropertyFormatValidator>
export type IntegerSchemaPropertyFormat = z.infer<typeof integerSchemaPropertyFormatValidator>
export type AnySchemaPropertyFormat = StringSchemaPropertyFormat | NumberSchemaPropertyFormat | IntegerSchemaPropertyFormat
