import { z } from 'zod'

export const petSchema = z.object({
  id: z.string(),
  name: z.string(),
  tag: z.string(),
})

export const errorSchema = z.object({
  code: z.string(),
  message: z.string(),
})

export const petsSchema = z.array(petSchema).max(100)
