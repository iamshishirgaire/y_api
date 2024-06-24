
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { mentionSchema } from "./mention.schema";
import { onErrorMsg } from "../../utils/zodValidationMessage";
export const mentionRoute = new Hono();

mentionRoute
  .get("/",zValidator("param",mentionSchema,onErrorMsg) ,(c) => {
    return c.json({
      message: "mention GET ROUTE",
      
    });
  })
  .post("/", (c) => {
    return c.json({
      message: "mention POST ROUTE",
    });
  })
  .patch("/", (c) => {
    return c.json({
      message: "mention PATCH ROUTE",
    });
  });

