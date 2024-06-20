
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { notificationSchema } from "./notification.schema";
import { onErrorMsg } from "../../utils/zodValidationMessage";
export const notificationRoute = new Hono();

notificationRoute
  .get("/",zValidator("param",notificationSchema,onErrorMsg) ,(c) => {
    return c.json({
      message: "notification GET ROUTE",
      
    });
  })
  .post("/", (c) => {
    return c.json({
      message: "notification POST ROUTE",
    });
  })
  .patch("/", (c) => {
    return c.json({
      message: "notification PATCH ROUTE",
    });
  });

