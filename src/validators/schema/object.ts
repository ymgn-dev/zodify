import z from 'zod'
import {
  allOfSchemaPropertyValidator,
  arraySchemaPropertyValidator,
  booleanSchemaPropertyValidator,
  integerSchemaPropertyValidator,
  numberSchemaPropertyValidator,
  oneOfAnyOfSchemaPropertyValidator,
  refSchemaPropertyValidator,
  stringSchemaPropertyValidator,
} from '../schema-property'
import {
  objectSchemaPropertyValidator,
} from '../schema-property/object'

// See https://typespec.io/docs/language-basics/models

export const objectSchemaValidator = z.object({
  type: z.literal('object'),
  required: z.array(z.string()).optional(),
  properties: z.record(
    z.union([
      allOfSchemaPropertyValidator,
      arraySchemaPropertyValidator,
      booleanSchemaPropertyValidator,
      numberSchemaPropertyValidator,
      oneOfAnyOfSchemaPropertyValidator,
      integerSchemaPropertyValidator,
      stringSchemaPropertyValidator,
      refSchemaPropertyValidator,
      objectSchemaPropertyValidator,
    ]),
  ).optional().default({}),
  allOf: z.array(z.object({ $ref: z.string() })).optional(),
  description: z.string().optional(),
})
