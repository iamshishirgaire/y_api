import { z } from "zod";

export const authGoogleSigninSchema = z.object({
  token: z.string(),
});
