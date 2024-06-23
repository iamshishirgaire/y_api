import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { onErrorMsg } from "../../utils/zodValidationMessage";
import { FollowSchema, GetFollowerSchema } from "./follow.schema";
import { FollowService } from "./follow.service";
import type { Variables } from "../../utils/authVariables";

export const followRoute = new Hono<{ Variables: Variables }>();
const followService = new FollowService();
followRoute
  .get("/", zValidator("json", GetFollowerSchema, onErrorMsg), async (c) => {
    const reqData = c.req.valid("json");
    if (reqData.type === "following") {
      return c.json(await followService.findAllFollowing(reqData));
    }
    return c.json(await followService.findAllFollowers(reqData));
  })

  .post("/", zValidator("json", FollowSchema, onErrorMsg), async (c) => {
    const reqData = c.req.valid("json");
    const userId = c.get("userId");
    return c.json(await followService.create(reqData, userId));
  })
  .delete("/", zValidator("json", FollowSchema, onErrorMsg), async (c) => {
    const reqData = c.req.valid("json");
    const userId = c.get("userId");
    return c.json(await followService.delete(reqData, userId));
  });
