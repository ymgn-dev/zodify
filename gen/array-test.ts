import { z } from "zod";

// 配列のテスト
export const arrayTestSchema = z.object({
  a: z.array(z.string()),
});
