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

export const messageRoute = new Hono();
const messageService = new MessageService();

messageRoute
  .get("/", zValidator("query", GetMessagesSchema, onErrorMsg), async (c) => {
    const reqData = c.req.valid("query");
    return c.json(await messageService.findAll(reqData));
  })
  .get(
    "/channel",
    zValidator("query", GetMessageChannelsSchema, onErrorMsg),
    async (c) => {
      const reqData = c.req.valid("query");
      return c.json(await messageService.findAllChannels(reqData));
    }
  )
  .post(
    "/channel",
    zValidator("query", CreateMessageChannelSchema, onErrorMsg),
    async (c) => {
      const reqData = c.req.valid("query");
      return c.json(await messageService.createChannel(reqData));
    }
  )
  .post("/", zValidator("json", CreateMessageSchema, onErrorMsg), async (c) => {
    const reqData = c.req.valid("json");
    return c.json(await messageService.create(reqData));
  })
  .patch(
    "/",
    zValidator("json", UpdateMessageSchema, onErrorMsg),
    async (c) => {
      const reqData = c.req.valid("json");
      return c.json(await messageService.update(reqData));
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
