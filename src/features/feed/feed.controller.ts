import { Hono } from "hono";
import { FeedService } from "./feed.service";
import type { Variables } from "../../utils/authVariables";
import { zValidator } from "@hono/zod-validator";
import { GetFeedSchema } from "./feed.schema";
import { onErrorMsg } from "../../utils/zodValidationMessage";

export const feedRoute = new Hono<{ Variables: Variables }>();
const feedService = new FeedService();

feedRoute.get(
  "/",
  zValidator("query", GetFeedSchema, onErrorMsg),
  async (c) => {
    const id = c.get("userId");
    const reqData = c.req.valid("query");
    return c.json(await feedService.findAll(id, reqData));
  }
);
