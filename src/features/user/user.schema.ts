import { z } from "zod";

export const userQuerySchema = z
  .object({
    email: z.string().email().optional(),
    id: z.string().uuid().optional(),
  })
  .refine((data) => data.email || data.id, {
    message: "Query must contain either 'email' or 'id'",
    path: ["query"],
  });

export const updateUserSchema = z.object({
  username: z.string().max(255).optional(),
  id: z.string().uuid(),
  email: z.string().email().max(255).optional(),
  bio: z.string().optional(),
  first_name: z.string().max(255).optional(), // Changed to snake_case
  last_name: z.string().max(255).optional(), // Changed to snake_case
  country: z.string().max(255).optional(),
  dob: z.date().optional(),
  profile_picture: z.string().max(255).optional(), // Changed to snake_case
  verified: z.boolean().optional(),
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>;
