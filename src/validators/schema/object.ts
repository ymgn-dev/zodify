import z from 'zod'
import {
  arraySchemaPropertyValidator,
  booleanSchemaPropertyValidator,
  integerSchemaPropertyValidator,
  numberSchemaPropertyValidator,
  oneOfAnyOfSchemaPropertyValidator,
  refSchemaPropertyValidator,
  stringSchemaPropertyValidator,
} from '../schema-property'

// See https://typespec.io/docs/language-basics/models

export const objectSchemaValidator = z.object({
  type: z.literal('object'),
  required: z.array(z.string()).optional(),
  properties: z.record(
    z.union([
      arraySchemaPropertyValidator,
      booleanSchemaPropertyValidator,
      numberSchemaPropertyValidator,
      oneOfAnyOfSchemaPropertyValidator,
      integerSchemaPropertyValidator,
      stringSchemaPropertyValidator,
      refSchemaPropertyValidator,
    ]),
  ),
  description: z.string().optional(),
})
