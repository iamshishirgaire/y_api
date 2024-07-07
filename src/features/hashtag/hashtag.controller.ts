import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { onErrorMsg } from "../../utils/zodValidationMessage";
import { getHashTagsSchema } from "./hashtag.schema";
import { HashtagService } from "./hashtag.service";
import { cache } from "../../middleware/cache.middleware";
export const hashtagRoute = new Hono();

const hashtagService = new HashtagService();
hashtagRoute.get(
  "/",
  cache(30),
  zValidator("query", getHashTagsSchema, onErrorMsg),
  async (c) => {
    const reqData = c.req.valid("query");
    return c.json(await hashtagService.findAll(reqData));
  }
);
