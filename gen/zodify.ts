import { z } from 'zod'

export const addressSchema = z.object({
  street: z.string(),
  city: z.string(),
  state: z.string(),
  zip: z.string(),
})

export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  birthday: z.string().datetime(),
  address: addressSchema.optional(),
})
