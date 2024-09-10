import { z } from "zod";

// Enum type
export const enumTypeSchema = z.enum(["ROSA", "MICO", "NITA"]);

// Character skill model
export const skillSchema = z.object({
  id: z.string().uuid(),

  // Skill name
  name: z.string().min(2).max(10),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

// Character model
export const characterSchema = z.object({
  id: z.string().email(),

  // Character name
  name: z.string().min(2).max(10),

  // power number
  power: z.number(),
  skills: z.array(skillSchema).max(2).default([]),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
