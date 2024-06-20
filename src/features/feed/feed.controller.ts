
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { feedSchema } from "./feed.schema";
import { onErrorMsg } from "../../utils/zodValidationMessage";
export const feedRoute = new Hono();

feedRoute
  .get("/",zValidator("param",feedSchema,onErrorMsg) ,(c) => {
    return c.json({
      message: "feed GET ROUTE",
      
    });
  })
  .post("/", (c) => {
    return c.json({
      message: "feed POST ROUTE",
    });
  })
  .patch("/", (c) => {
    return c.json({
      message: "feed PATCH ROUTE",
    });
  });

