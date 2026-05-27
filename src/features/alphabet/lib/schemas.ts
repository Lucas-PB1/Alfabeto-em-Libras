import { z } from "zod";

const imageUrlSchema = z.string().url().or(z.literal(""));

export const alphabetLetterSchema = z.object({
  id: z.string().min(1),
  letter: z.string().min(1).max(2),
  librasImage: imageUrlSchema.default(""),
  active: z.boolean().default(true),
  order: z.number().int().min(0),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export const alphabetUpdateSchema = z.object({
  librasImage: imageUrlSchema.optional(),
  active: z.boolean().optional(),
  order: z.number().int().min(0).optional(),
});
