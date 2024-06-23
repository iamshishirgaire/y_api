import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { onErrorMsg } from "../../utils/zodValidationMessage";
import {
  CreateNotificationSchema,
  DeleteNotificationSchema,
  GetNotificationSchema,
  GetSingleNotificationSchema,
  UpdateNotificationSchema,
} from "./notification.schema";
import { NotificationService } from "./notification.service";
export const notificationRoute = new Hono();
const notificationService = new NotificationService();

notificationRoute
  .get(
    "/",
    zValidator("query", GetNotificationSchema, onErrorMsg),
    async (c) => {
      const reqData = c.req.valid("query");
      return c.json(await notificationService.findAll(reqData));
    }
  )
  .get(
    "/:id",
    zValidator("param", GetSingleNotificationSchema, onErrorMsg),
    async (c) => {
      const reqData = c.req.valid("param");
      return c.json(await notificationService.findOne(reqData.id));
    }
  )
  .patch(
    "/",
    zValidator("query", UpdateNotificationSchema, onErrorMsg),
    async (c) => {
      const reqData = c.req.valid("query");
      return c.json(await notificationService.update(reqData));
    }
  )
  .delete(
    "/",
    zValidator("param", DeleteNotificationSchema, onErrorMsg),
    async (c) => {
      const reqData = c.req.valid("param");
      return c.json(await notificationService.delete(reqData));
    }
  );
