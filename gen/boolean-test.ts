import { z } from "zod";

// 論理値のテスト
export const booleanTestSchema = z.object({
  a: z.boolean(),
});
