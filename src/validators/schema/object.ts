import z from 'zod'
import {
  anyOfSchemaPropertyValidator,
  arraySchemaPropertyValidator,
  booleanSchemaPropertyValidator,
  integerSchemaPropertyValidator,
  numberSchemaPropertyValidator,
  refSchemaPropertyValidator,
  stringSchemaPropertyValidator,
} from '../schema-property'

// See https://typespec.io/docs/language-basics/models

export const objectSchemaValidator = z.object({
  type: z.literal('object'),
  required: z.array(z.string()).optional(),
  properties: z.record(
    z.union([
      anyOfSchemaPropertyValidator,
      arraySchemaPropertyValidator,
      booleanSchemaPropertyValidator,
      numberSchemaPropertyValidator,
      integerSchemaPropertyValidator,
      stringSchemaPropertyValidator,
      refSchemaPropertyValidator,
    ]),
  ),
  description: z.string().optional(),
})
