
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { bookmarkSchema } from "./bookmark.schema";
import { onErrorMsg } from "../../utils/zodValidationMessage";
export const bookmarkRoute = new Hono();

bookmarkRoute
  .get("/",zValidator("param",bookmarkSchema,onErrorMsg) ,(c) => {
    return c.json({
      message: "bookmark GET ROUTE",
      
    });
  })
  .post("/", (c) => {
    return c.json({
      message: "bookmark POST ROUTE",
    });
  })
  .patch("/", (c) => {
    return c.json({
      message: "bookmark PATCH ROUTE",
    });
  });

