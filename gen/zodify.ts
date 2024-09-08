import { z } from 'zod'

export const categorySchema = z.object({
  id: z.string(),
  name: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

export const categoryCreateItemSchema = z.object({
  name: z.string(),
})

export const adminPostSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  categories: z.array(categorySchema),
  coverImageUrl: z.string().url(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  published: z.boolean(),
})

export const adminPostCreateSchema = z.object({
  title: z.string(),
  content: z.string(),
  categories: z.array(categoryCreateItemSchema),
  coverImageUrl: z.string().url(),
  published: z.boolean(),
})

export const adminPostDraftSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  categories: z.array(categorySchema),
  coverImageUrl: z.string().url(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  postId: z.string(),
})

export const adminPostDraftCreateSchema = z.object({
  title: z.string(),
  content: z.string(),
  categories: z.array(categoryCreateItemSchema),
  coverImageUrl: z.string().url(),
})

export const adminPostUpdateSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  categories: z.array(categorySchema),
  coverImageUrl: z.string().url(),
  published: z.boolean(),
})

export const categoryCreateSchema = z.object({
  name: z.string(),
})

export const categoryUpdateSchema = z.object({
  id: z.string(),
  name: z.string(),
})

export const countSchema = z.object({
  count: z.string(),
})

export const postSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  categories: z.array(categorySchema),
  coverImageUrl: z.string().url(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

export const postCommentSchema = z.object({
  id: z.string(),
  postId: z.string(),
  isAdmin: z.boolean(),
  authorName: z.string(),
  path: z.string(),
  content: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

export const postCommentCreateSchema = z.object({
  authorName: z.string(),
  path: z.string(),
  content: z.string(),
})

export const versionsSchema = z.enum(['1.0.0'])
