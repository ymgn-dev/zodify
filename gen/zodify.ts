import { z } from 'zod'

export const directionSchema = z.enum(['north', 'east', 'south', 'west'])

export const dogSchema = z.object({
  address: z.string().default('wild'),
})

export const fooSchema = z.enum(['1', '10', '100', '1000'])

export const petSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(4).max(8),
  createdat: z.string().default('hello'),
  age: z.string().min(0).max(130),
})
