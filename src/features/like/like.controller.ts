import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { onErrorMsg } from "../../utils/zodValidationMessage";
import {
  CreateLikeSchema,
  DeleteLikeSchema,
  IsLikedByMeSchema,
} from "./like.schema";
import { LikeService } from "./like.service";
import { cache } from "../../middlewares/cache.middleware";
import type { Variables } from "../../utils/authVariables";
export const likeRoute = new Hono<{ Variables: Variables }>();

const likeService = new LikeService();

likeRoute
  .get(
    "/",
    cache(10),
    zValidator("query", IsLikedByMeSchema, onErrorMsg),
    async (c) => {
      const reqData = c.req.valid("query");
      return c.json(
        await likeService.getIsLikedByMe(reqData.user_id, reqData.tweet_id)
      );
    }
  )
  .post("/", zValidator("query", CreateLikeSchema, onErrorMsg), async (c) => {
    const reqData = c.req.valid("query");
    const userId = c.get("userId");
    return c.json(await likeService.likeTweet(userId, reqData.tweet_id));
  })
  .delete("/", zValidator("query", DeleteLikeSchema, onErrorMsg), async (c) => {
    const reqData = c.req.valid("query");
    return c.json(
      await likeService.dislikeTweet(reqData.user_id, reqData.tweet_id)
    );
  });
