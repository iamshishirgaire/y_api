
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { messageSchema } from "./message.schema";
import { onErrorMsg } from "../../utils/zodValidationMessage";
export const messageRoute = new Hono();

messageRoute
  .get("/",zValidator("param",messageSchema,onErrorMsg) ,(c) => {
    return c.json({
      message: "message GET ROUTE",
      
    });
  })
  .post("/", (c) => {
    return c.json({
      message: "message POST ROUTE",
    });
  })
  .patch("/", (c) => {
    return c.json({
      message: "message PATCH ROUTE",
    });
  });

