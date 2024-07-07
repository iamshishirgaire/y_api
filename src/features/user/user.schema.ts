import { z } from "zod";

export const userQuerySchema = z
  .object({
    email: z.string().email().optional(),
    id: z.string().uuid().optional(),
    user_name: z.string().optional(),
  })
  .transform((d) => {
    if (!d.email && !d.id && !d.user_name) {
      throw new Error(
        "Query must contain either 'email' or 'id' or 'user_name'",
      );
    }
    if (
      (d.email && d.id) ||
      (d.email && d.user_name) ||
      (d.id && d.user_name)
    ) {
      throw new Error(
        "Query must contain either 'email' or 'id' or 'user_name'",
      );
    }
    return d;
  });

export const updateUserSchema = z.object({
  id: z.string().uuid(),
  user_name: z.string().max(255).optional(),
  email: z.string().email().max(255).optional(),
  bio: z.string().optional(),
  first_name: z.string().max(255).optional(),
  last_name: z.string().max(255).optional(),
  country: z.string().max(255).optional(),
  dob: z.date().optional(),
  profile_picture: z.string().max(255).optional(),
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>;
