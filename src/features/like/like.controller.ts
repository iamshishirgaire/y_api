import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { onErrorMsg } from "../../utils/zodValidationMessage";
import {
  CreateLikeSchema,
  DeleteLikeSchema,
  IsLikedByMeSchema,
} from "./like.schema";
import { LikeService } from "./like.service";
import { cache } from "../../middleware/cache.middleware";
export const likeRoute = new Hono();

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
    return c.json(
      await likeService.likeTweet(reqData.user_id, reqData.tweet_id)
    );
  })
  .delete("/", zValidator("query", DeleteLikeSchema, onErrorMsg), async (c) => {
    const reqData = c.req.valid("query");
    return c.json(
      await likeService.dislikeTweet(reqData.user_id, reqData.tweet_id)
    );
  });
