
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { likeSchema } from "./like.schema";
import { onErrorMsg } from "../../utils/zodValidationMessage";
export const likeRoute = new Hono();

likeRoute
  .get("/",zValidator("param",likeSchema,onErrorMsg) ,(c) => {
    return c.json({
      message: "like GET ROUTE",
      
    });
  })
  .post("/", (c) => {
    return c.json({
      message: "like POST ROUTE",
    });
  })
  .patch("/", (c) => {
    return c.json({
      message: "like PATCH ROUTE",
    });
  });

