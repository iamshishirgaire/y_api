import { HTTPException } from "hono/http-exception";
import db from "../../../db";
import { v4 as uuidv4 } from "uuid";
import type {
  CreateComment,
  DeleteComment,
  GetComment,
  GetCommentRepliesSchema,
} from "./comment.schema";
import type Comments from "../../../generated/public/Comments";

export class CommentService {
  public async getComments(
    data: GetComment,
    pageNumber: number,
    pageSize: number
  ) {
    try {
      if (data.type === "tweet") {
        const comments = await db<Comments[]>`
      SELECT * FROM comments
      WHERE tweet_id=${data.id} and reply_to_id IS NULL

      ORDER BY created_at DESC
      LIMIT ${pageSize} OFFSET ${pageNumber * pageSize}
      `;
        return comments;
        // biome-ignore lint/style/noUselessElse: <explanation>
      } else {
        const comments = await db<Comments[]>`
      SELECT * FROM comments
      WHERE poll_id='${data.id}'
      ORDER BY created_at DESC
      LIMIT ${pageSize} OFFSET ${pageNumber * pageSize}
      `;
        return comments;
      }
    } catch (error) {
      console.log(error);
      throw new HTTPException(500, {
        message: "Failed to get comments",
      });
    }
  }
  public async getCommentReplies(
    data: GetCommentRepliesSchema,
    pageNumber: number,
    pageSize: number
  ) {
    try {
      const comments = await db<Comments[]>`
      SELECT * FROM comments
      WHERE reply_to_id=${data.id}
      ORDER BY created_at DESC
      LIMIT ${pageSize} OFFSET ${pageNumber * pageSize}
      `;
      return comments;
    } catch (error) {
      throw new HTTPException(500, {
        message: "Failed to get comment replies",
      });
    }
  }

  public async createComment(data: CreateComment, user_id: string) {
    const commentData = {
      id: uuidv4(),
      ...data,
      user_id: user_id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    try {
      await db.begin(async (sql) => {
        await sql`
          INSERT INTO comments ${sql(commentData)}
        `;
      });
      return commentData;
    } catch (error: unknown) {
      console.log(error);
      throw new HTTPException(500, {
        message: "Failed to create comment",
      });
    }
  }
  public async deleteComment(data: DeleteComment) {
    try {
      await db.begin(async (sql) => {
        const result = await sql`
          DELETE FROM comments
          WHERE id = ${data.comment_id} AND user_id = ${data.user_id}
          RETURNING *user_id
        `;

        if (result.count === 0) {
          throw new HTTPException(404, {
            message: "Comment not found",
          });
        }
      });
      return { message: "Comment deleted successfully" };
    } catch (error: unknown) {
      throw new HTTPException(500, {
        message: "Failed to delete comment",
      });
    }
  }
}
