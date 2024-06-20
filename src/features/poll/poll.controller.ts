import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import type { Variables } from "../../utils/authVariables";
import { verifyAuth } from "../../utils/verifyAuth";
import { onErrorMsg } from "../../utils/zodValidationMessage";
import {
  CreatePollResultSchema,
  CreatePollSchema,
  GetPollByUsersSchema,
  GetPollSchema,
} from "./poll.schema";
import PollService from "./poll.service";

export const pollRoute = new Hono<{ Variables: Variables }>();
const pollService = new PollService();

pollRoute
  .get("/:id", zValidator("param", GetPollSchema, onErrorMsg), async (c) => {
    try {
      const { id } = c.req.valid("param");
      const res = await pollService.findOne(id);
      return c.json(res);
    } catch (error) {
      throw new HTTPException(404, {
        message: "Failed to fetch Polls",
      });
    }
  })
  .get(
    "/user/:userId",
    zValidator("param", GetPollByUsersSchema, onErrorMsg),
    async (c) => {
      try {
        const { userId } = c.req.valid("param");
        const res = await pollService.getPollsByUser(userId);
        return c.json(res);
      } catch (error) {
        throw new HTTPException(404, {
          message: "Failed to fetch Polls",
        });
      }
    }
  )

  .post("/", zValidator("json", CreatePollSchema, onErrorMsg), async (c) => {
    try {
      const data = c.req.valid("json");
      const userId = c.get("userId");
      const res = await pollService.create(data, userId);
      return c.json(res);
    } catch (error) {
      console.log(error);
      throw new HTTPException(404, {
        message: "Failed to create Poll",
      });
    }
  })
  .post(
    "/vote",
    zValidator("json", CreatePollResultSchema, onErrorMsg),
    async (c) => {
      try {
        const data = c.req.valid("json");
        const userId = c.get("userId");
        const res = await pollService.vote(data, userId);
        return c.json(res);
      } catch (error: unknown) {
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        if (error instanceof Error && (error as any).code === "23505") {
          throw new HTTPException(404, {
            message: "You have already voted",
          });
        }
        throw new HTTPException(404, {
          message: "Failed to vote",
        });
      }
    }
  )
  .delete("/:id", zValidator("param", GetPollSchema, onErrorMsg), async (c) => {
    const { id } = c.req.valid("param");
    const userId = c.get("userId");
    try {
      const originalTweet = await pollService.findOne(id);
      verifyAuth(userId, originalTweet.user_id);
      await pollService.deletePoll(userId, id);
      return c.json({
        message: "Poll deleted successfully",
      });
    } catch (error) {
      throw new HTTPException(404, {
        message: "Failed to delete Poll",
      });
    }
  });
