import { z } from "zod";

export const dataSetListSchema = z.object({
  total: z.string().optional(),
  apis: z.array(Schema).optional(),
});
