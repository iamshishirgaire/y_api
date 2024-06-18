import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import {
  CreatePollResultSchema,
  CreatePollSchema,
  GetPollSchema,
} from "./poll.schema";
import { onErrorMsg } from "../../utils/zodValidationMessage";
import type { Variables } from "../../utils/authVariables";

export const pollRoute = new Hono<{ Variables: Variables }>();

pollRoute
  .get("/", zValidator("param", GetPollSchema, onErrorMsg), (c) => {
    return c.json({
      message: "poll GET ROUTE",
    });
  })
  .post("/", zValidator("json", CreatePollSchema, onErrorMsg), (c) => {
    return c.json({
      message: "poll POST ROUTE",
    });
  })
  .post(
    "/vote",
    zValidator("json", CreatePollResultSchema, onErrorMsg),
    (c) => {
      return c.json({
        message: "poll POST ROUTE",
      });
    }
  );
