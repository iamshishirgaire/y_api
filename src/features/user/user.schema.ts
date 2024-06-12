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
