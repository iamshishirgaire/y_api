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
  firstName: z.string().max(255).optional(),
  lastName: z.string().max(255).optional(),
  country: z.string().max(255).optional(),
  dob: z.string().optional(), // or z.date().optional() depending on how you handle dates
  profilePicture: z.string().max(255).optional(),
  verified: z.boolean().optional(),
});


export type UpdateUserInput = z.infer<typeof updateUserSchema>;
