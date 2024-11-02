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
} from '.'

// See https://typespec.io/docs/language-basics/built-in-types#numeric-types

export const objectSchemaPropertyValidator = z.object({
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
    ]),
  ).optional().default({}),
  allOf: z.array(z.object({ $ref: z.string() })).optional(),
  description: z.string().optional(),
})
