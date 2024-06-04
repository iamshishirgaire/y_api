import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { onErrorMsg } from "../../utils/zodValidationMessage";
import {
  authForgotPasswordSchema,
  authLoginSchema,
  authSignupSchema,
} from "./auth.schema";
import { validateAuth } from "../../middleware/auth.middleware";
Promise;
export const authRoute = new Hono();
authRoute.use(validateAuth);
authRoute

  .post("/login", zValidator("json", authLoginSchema, onErrorMsg), (c) => {
    return c.json({
      message: "auth POST ROUTE",
    });
  })

  .post("/signup", zValidator("json", authSignupSchema, onErrorMsg), (c) => {
    return c.json({
      message: "auth PATCH ROUTE",
    });
  })

  .post(
    "/forgot-password",
    zValidator("query", authForgotPasswordSchema, onErrorMsg),
    (c) => {
      return c.json({
        message: "auth POST ROUTE",
      });
    }
  );
