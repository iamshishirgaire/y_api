import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { onErrorMsg } from "../../utils/zodValidationMessage";
import { getMentionsSchema } from "./mention.schema";
import { MentionService } from "./mention.service";
import type { Variables } from "../../utils/authVariables";
import { cache } from "../../middlewares/cache.middleware";
export const mentionRoute = new Hono<{ Variables: Variables }>();
const mentionService = new MentionService();
mentionRoute.get(
  "/",
  cache(30),
  zValidator("query", getMentionsSchema, onErrorMsg),
  async (c) => {
    const reqData = c.req.valid("query");
    const user_id = c.get("userId");
    return c.json(await mentionService.findAll(reqData, user_id));
  }
);
