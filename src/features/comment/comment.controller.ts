
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { commentSchema } from "./comment.schema";
import { onErrorMsg } from "../../utils/zodValidationMessage";
export const commentRoute = new Hono();

commentRoute
  .get("/",zValidator("param",commentSchema,onErrorMsg) ,(c) => {
    return c.json({
      message: "comment GET ROUTE",
      
    });
  })
  .post("/", (c) => {
    return c.json({
      message: "comment POST ROUTE",
    });
  })
  .patch("/", (c) => {
    return c.json({
      message: "comment PATCH ROUTE",
    });
  });

