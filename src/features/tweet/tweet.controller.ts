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

export const tweetRoute = new Hono<{ Variables: Variables }>();

const tweetService = new TweetService();
tweetRoute
  .get("/:id", zValidator("param", getTweetSchema, onErrorMsg), async (c) => {
    const { id } = c.req.valid("param");
    try {
      const tweet = await tweetService.findOne(id);
      return c.json(tweet);
    } catch (error) {
      throw new HTTPException(404, {
        message: "Tweet not found",
      });
    }
  })
  .post("/", zValidator("json", CreateTweetSchema, onErrorMsg), async (c) => {
    const createData = c.req.valid("json");
    const userId = c.get("userId");
    try {
      await tweetService.create(createData, userId);
      c.status(202);
      return c.json({});
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
    try {
      await tweetService.update(userId, updateData);
      c.status(202);
      return c.json({});
    } catch (error) {
      throw new HTTPException(404, {
        message:
          error && error instanceof Error
            ? error.message
            : "Failed to update tweet",
      });
    }
  });
