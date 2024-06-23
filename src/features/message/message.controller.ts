import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { onErrorMsg } from "../../utils/zodValidationMessage";
import {
  GetMessagesSchema,
  GetMessageChannelsSchema,
  CreateMessageSchema,
  UpdateMessageSchema,
  DeleteMessageSchema,
  CreateMessageChannelSchema,
} from "./message.schema";
import { MessageService } from "./message.service";
import type { Variables } from "../../utils/authVariables";
import { HTTPException } from "hono/http-exception";
import { verifyAuth } from "../../utils/verifyAuth";

export const messageRoute = new Hono<{ Variables: Variables }>();
const messageService = new MessageService();

messageRoute
  .get("/", zValidator("query", GetMessagesSchema, onErrorMsg), async (c) => {
    const reqData = c.req.valid("query");
    const userId = c.get("userId");
    return c.json(await messageService.findAll(reqData, userId));
  })
  .get(
    "/channel",
    zValidator("query", GetMessageChannelsSchema, onErrorMsg),
    async (c) => {
      const reqData = c.req.valid("query");
      const userId = c.get("userId");
      verifyAuth(userId, reqData.user_id);
      return c.json(await messageService.findAllChannels(reqData));
    }
  )
  .post(
    "/channel",
    zValidator("query", CreateMessageChannelSchema, onErrorMsg),
    async (c) => {
      const reqData = c.req.valid("query");
      const userId = c.get("userId");
      verifyAuth(userId, reqData.sender_id);
      return c.json(await messageService.createChannel(reqData));
    }
  )
  .post("/", zValidator("json", CreateMessageSchema, onErrorMsg), async (c) => {
    const reqData = c.req.valid("json");
    const userId = c.get("userId");
    verifyAuth(userId, reqData.sender_id);
    return c.json(await messageService.create(reqData));
  })
  .patch(
    "/",
    zValidator("json", UpdateMessageSchema, onErrorMsg),
    async (c) => {
      const reqData = c.req.valid("json");
      const userId = c.get("userId");

      return c.json(await messageService.update(reqData, userId));
    }
  )
  .delete(
    "/:id",
    zValidator("param", DeleteMessageSchema, onErrorMsg),
    async (c) => {
      const reqData = c.req.valid("param");
      return c.json(await messageService.delete(reqData));
    }
  );
