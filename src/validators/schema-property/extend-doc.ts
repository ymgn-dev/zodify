import z from 'zod'

export const extendDocSchemaPropertyValidator = z.object({
  // eslint-disable-next-line regexp/no-super-linear-backtracking
  description: z.string().regex(/.*\s*zod:\s+.*/),
})
