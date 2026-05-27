import { z } from "zod";

const imageUrlSchema = z.string().url().or(z.literal(""));

export const wordVisualTypeSchema = z.enum(["image", "icon"]);

export const wordContentSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(2).max(80),
  letter: z.string().min(1).max(2),
  visualType: wordVisualTypeSchema,
  image: imageUrlSchema.default(""),
  iconKey: z.string().min(1).default("Circle"),
  colorClass: z.string().min(1).default("bg-slate-100"),
  active: z.boolean().default(true),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export const wordWriteBaseSchema = wordContentSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const wordWriteSchema = wordWriteBaseSchema.refine((word) => word.visualType === "icon" || word.image.length > 0, {
    message: "Informe uma imagem para palavras com visual de imagem.",
    path: ["image"],
  });

export const wordPatchSchema = wordWriteBaseSchema.partial();
