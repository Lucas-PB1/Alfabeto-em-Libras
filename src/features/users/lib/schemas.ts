import { z } from "zod";

export const userRoleSchema = z.enum(["admin", "editor"]);

export const userStatusSchema = z.enum(["pending", "approved", "blocked"]);

export const userProfileSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(2).max(80),
  email: z.string().email(),
  photoUrl: z.string().url().or(z.literal("")).default(""),
  role: userRoleSchema,
  status: userStatusSchema,
  lastLoginAt: z.string().optional(),
  approvedAt: z.string().optional(),
  approvedBy: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export const userUpdateSchema = z.object({
  role: userRoleSchema.optional(),
  status: userStatusSchema.optional(),
});

export const profileUpdateSchema = z.object({
  name: z.string().min(2).max(80).optional(),
  photoUrl: z.string().url().or(z.literal("")).optional(),
});

export const signUpSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email(),
  password: z.string().min(6),
});
