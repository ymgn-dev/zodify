import { z } from "zod";

// Boolean test
export const booleanTestSchema = z.object({
  a: z.boolean(),
});
