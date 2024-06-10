import { z } from "zod";

export const authLoginSchema = z.object({
  email: z.string().email({
    message: "Email must be a valid email",
  }),
  password: z
    .string({
      message: "Password must be a string",
    })
    .min(6)
    .max(20),
});

export const authSignupSchema = z.object({
  firstName: z
    .string({
      message: "Firstname  must be a string",
    })
    .min(3)
    .max(20),
  lastName: z.object({
    lastName: z
      .string({
        message: "Lastname  must be a string",
      })
      .min(3)
      .max(20),
  }),
  email: z.string().email({
    message: "Email must be a valid email",
  }),
  password: z
    .string({
      message: "Password must be a string",
    })
    .min(6)
    .max(20),
});
export const authForgotPasswordSchema = z.object({
  email: z.string().email(),
});

export const authGoogleSigninSchema = z.object({
  token: z.string(),
})
