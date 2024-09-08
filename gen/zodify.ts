import { z } from 'zod'

export const petSchema = z.object({
  id: z.string(),
  name: z.string(),
  tag: z.string(),
})

export const dogSchema = z.object({
  address: z.string().default('wild'),
})

export const errorSchema = z.object({
  code: z.string(),
  message: z.string(),
})
