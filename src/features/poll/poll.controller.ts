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
import { cache } from "../../middlewares/cache.middleware";

export const pollRoute = new Hono<{ Variables: Variables }>();
const pollService = new PollService();

pollRoute
  .get("/feed", async (c) => {
    const userId = c.get("userId");
    return c.json(await pollService.GetPollInFeed(userId));
  })
  .get(
    "/:id",
    cache(20),
    zValidator("param", GetPollSchema, onErrorMsg),
    async (c) => {
      const { id } = c.req.valid("param");
      const userId = c.get("userId");
      const res = await pollService.findOne(id, userId);
      return c.json(res);
    }
  )
  .get(
    "/user/:userId",
    cache(60),
    zValidator("param", GetPollByUsersSchema, onErrorMsg),
    async (c) => {
      const { userId } = c.req.valid("param");
      const res = await pollService.getPollsByUser(userId);
      return c.json(res);
    }
  )
  .post("/", zValidator("json", CreatePollSchema, onErrorMsg), async (c) => {
    const data = c.req.valid("json");
    const userId = c.get("userId");
    const res = await pollService.create(data, userId);
    return c.json(res);
  })
  .post(
    "/vote",
    zValidator("json", CreatePollResultSchema, onErrorMsg),
    async (c) => {
      const data = c.req.valid("json");
      const userId = c.get("userId");
      const res = await pollService.vote(data, userId);
      return c.json(res);
    }
  )
  .delete("/:id", zValidator("param", GetPollSchema, onErrorMsg), async (c) => {
    const { id } = c.req.valid("param");
    const userId = c.get("userId");

    const originalTweet = await pollService.findOne(id, userId);
    verifyAuth(userId, originalTweet.user_id);
    await pollService.deletePoll(userId, id);
    return c.json({
      message: "Poll deleted successfully",
    });
  })
  .get("/feed", cache(60), async (c) => {
    console.log("Printed");
    const userId = c.get("userId");
    const res = await pollService.GetPollInFeed(userId);
  });
