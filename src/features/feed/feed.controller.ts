import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { feedSchema } from "./feed.schema";
import { onErrorMsg } from "../../utils/zodValidationMessage";
export const feedRoute = new Hono();

feedRoute
  .get("/:id", zValidator("param", feedSchema, onErrorMsg), (c) => {
    const v = c.req.valid("param");
    return c.json({
      message: "feed GET ROUTE",
      id: v.id,
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
