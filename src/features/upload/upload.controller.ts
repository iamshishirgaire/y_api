import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { onErrorMsg } from "../../utils/zodValidationMessage";
export const uploadRoute = new Hono();

uploadRoute.get("/", (c) => {
  return c.json({
    message: "upload GET ROUTE",
  });
});
