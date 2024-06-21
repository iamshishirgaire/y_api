import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { onErrorMsg } from "../../utils/zodValidationMessage";
import {
  CreateCommentSchema,
  DeleteCommentSchema,
  GetCommentRepliesSchema,
  GetCommentsSchema,
} from "./comment.schema";
import { CommentService } from "./comment.service";
import type { Variables } from "../../utils/authVariables";

export const commentRoute = new Hono<{ Variables: Variables }>();
const commentService = new CommentService();

commentRoute
  .get("/", zValidator("query", GetCommentsSchema, onErrorMsg), async (c) => {
    const reqData = c.req.valid("query");
    const comments = await commentService.getComments(reqData, 0, 10);
    return c.json(comments);
  })
  .get(
    "/replies",
    zValidator("query", GetCommentRepliesSchema, onErrorMsg),
    async (c) => {
      const reqData = c.req.valid("query");
      const comments = await commentService.getCommentReplies(reqData, 0, 10);
      return c.json(comments);
    }
  )
  .post("/", zValidator("json", CreateCommentSchema, onErrorMsg), async (c) => {
    const reqData = c.req.valid("json");
    const userId = c.get("userId");
    return c.json(await commentService.createComment(reqData, userId));
  })
  .delete(
    "/",
    zValidator("json", DeleteCommentSchema, onErrorMsg),
    async (c) => {
      const reqData = c.req.valid("json");
      await commentService.deleteComment(reqData);
      return c.json(await commentService.deleteComment(reqData));
    }
  );
