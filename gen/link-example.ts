import { z } from "zod";

export const userSchema = z.object({
  username: z.string().optional(),

  uuid: z.string().optional(),
});

export const repositorySchema = z.object({
  slug: z.string().optional(),

  owner: userSchema.optional(),
});

export const pullrequestSchema = z.object({
  id: z.number().optional(),

  title: z.string().optional(),

  repository: repositorySchema.optional(),

  author: userSchema.optional(),
});
