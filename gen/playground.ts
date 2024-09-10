import { z } from "zod";

// カテゴリモデル
export const categorySchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(24),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

// カテゴリモデル
export const categoryCreateSchema = z.object({
  name: z.string().min(1).max(24),
});

// カテゴリモデル
export const categoryCreateItemSchema = z.object({
  name: z.string().min(1).max(24),
});

// カテゴリモデル
export const categoryUpdateSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1).max(24).optional(),
});

// カウントモデル
export const countSchema = z.object({
  count: z.number(),
});

// 投稿コメントモデル
export const postCommentSchema = z.object({
  id: z.string().uuid(),
  postId: z.string().uuid(),
  isAdmin: z.boolean(),

  // 経路列挙モデルのパス(ex. /comment_a_id/comment_b_id)
  path: z.string().min(1),

  // 投稿へのコメント内容(データのフォーマットは JSON 文字列)
  content: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

// 投稿コメントモデル
export const postCommentCreateSchema = z.object({
  // 経路列挙モデルのパス(ex. /comment_a_id/comment_b_id)
  path: z.string().min(1),

  // 投稿へのコメント内容(データのフォーマットは JSON 文字列)
  content: z.string(),
});

export const versionsSchema = z.enum(["1.0.0"]);

// 管理者用 - 投稿モデル
export const adminPostSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),

  // 投稿内容(データのフォーマットは JSON 文字列)
  content: z.string(),

  // 投稿のカテゴリ
  categories: z.array(categorySchema).min(1).default([]),
  coverImageUrl: z.string().url(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  published: z.boolean(),
});

// 管理者用 - 投稿下書きモデル
export const adminPostDraftSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),

  // 投稿内容(データのフォーマットは JSON 文字列)
  content: z.string(),

  // 投稿のカテゴリ
  categories: z.array(categorySchema).min(1).default([]),
  coverImageUrl: z.string().url(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  postId: z.string().uuid(),
});

// 管理者用 - 投稿モデル
export const adminPostUpdateSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().optional(),

  // 投稿内容(データのフォーマットは JSON 文字列)
  content: z.string().optional(),

  // 投稿のカテゴリ
  categories: z.array(categorySchema).min(1).optional().default([]),
  coverImageUrl: z.string().url().optional(),
  published: z.boolean().optional(),
});

// 投稿モデル
export const postSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),

  // 投稿内容(データのフォーマットは JSON 文字列)
  content: z.string(),

  // 投稿のカテゴリ
  categories: z.array(categorySchema).min(1).default([]),
  coverImageUrl: z.string().url(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

// 管理者用 - 投稿モデル
export const adminPostCreateSchema = z.object({
  title: z.string(),

  // 投稿内容(データのフォーマットは JSON 文字列)
  content: z.string(),

  // 投稿のカテゴリ
  categories: z.array(categoryCreateItemSchema).min(1).default([]),
  coverImageUrl: z.string().url(),
  published: z.boolean(),
});

// 管理者用 - 投稿下書きモデル
export const adminPostDraftCreateSchema = z.object({
  title: z.string(),

  // 投稿内容(データのフォーマットは JSON 文字列)
  content: z.string(),

  // 投稿のカテゴリ
  categories: z.array(categoryCreateItemSchema).min(1).default([]),
  coverImageUrl: z.string().url(),
});
