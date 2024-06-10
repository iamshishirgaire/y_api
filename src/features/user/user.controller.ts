
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { userSchema } from "./user.schema";
import { onErrorMsg } from "../../utils/zodValidationMessage";
export const userRoute = new Hono();

userRoute
  .get("/",zValidator("param",userSchema,onErrorMsg) ,(c) => {
    return c.json({
      message: "user GET ROUTE",
      
    });
  })
  .post("/", (c) => {
    return c.json({
      message: "user POST ROUTE",
    });
  })
  .patch("/", (c) => {
    return c.json({
      message: "user PATCH ROUTE",
    });
  });

