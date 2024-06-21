import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import {
  CreateTweetSchema,
  UpdateTweetSchema,
  getTweetSchema,
} from "./tweet.schema";
import { onErrorMsg } from "../../utils/zodValidationMessage";
import { TweetService } from "./tweet.service";
import { HTTPException } from "hono/http-exception";
import type { Variables } from "../../utils/authVariables";
import { verifyAuth } from "../../utils/verifyAuth";

export const tweetRoute = new Hono<{ Variables: Variables }>();

const tweetService = new TweetService();
tweetRoute
  .get("/all", async (c) => {
    return c.json(await tweetService.findAll(10, 0));
  })
  .get("/:id", zValidator("param", getTweetSchema, onErrorMsg), async (c) => {
    const { id } = c.req.valid("param");
    return c.json(await tweetService.findOne(id));
  })
  .post("/", zValidator("json", CreateTweetSchema, onErrorMsg), async (c) => {
    const createData = c.req.valid("json");
    const userId = c.get("userId");
    try {
      const tweet = await tweetService.create(createData, userId);
      return c.json(tweet);
    } catch (error) {
      throw new HTTPException(404, {
        message:
          error && error instanceof Error
            ? error.message
            : "Failed to create tweet",
      });
    }
  })
  .patch("/", zValidator("json", UpdateTweetSchema, onErrorMsg), async (c) => {
    const updateData = c.req.valid("json");
    const userId = c.get("userId");
    const originalTweet = await tweetService.findOne(updateData.id);
    verifyAuth(originalTweet.user_id, userId);
    try {
      await tweetService.update(userId, updateData);
      return c.json({
        message: "Tweet updated successfully",
      });
    } catch (error) {
      throw new HTTPException(400, {
        message: "Failed to update tweet",
      });
    }
  })
  .delete(
    "/:id",
    zValidator("param", getTweetSchema, onErrorMsg),
    async (c) => {
      const { id } = c.req.valid("param");
      const userId = c.get("userId");
      const originalTweet = await tweetService.findOne(id);
      verifyAuth(originalTweet.user_id, userId);
      try {
        await tweetService.delete(id);
        return c.json({
          message: "Tweet deleted successfully",
        });
      } catch (error) {
        throw new HTTPException(400, {
          message: "Failed to delete tweet",
        });
      }
    }
  );
