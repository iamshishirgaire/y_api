import { HTTPException } from "hono/http-exception";
import db from "../../../db";
import { v4 as uuidv4 } from "uuid";

export class LikeService {
  public async getIsLikedByMe(user_id: string, tweet_id: string) {
    try {
      await db`select COUNT(*) from likes where user_id = ${user_id} and tweet_id = ${tweet_id}`;
      return { isLiked: true };
    } catch (error) {
      throw new HTTPException(500, {
        message: "Failed to get like count",
      });
    }
  }
  public async likeTweet(user_id: string, tweet_id: string) {
    const likeData = {
      id: uuidv4(),
      user_id: user_id,
      tweet_id: tweet_id,
    };
    try {
      await db.begin(async (sql) => {
        await sql`
        INSERT INTO likes ${sql(likeData)}
      `;
        await sql`
        UPDATE tweets
        SET like_count = like_count + 1
        WHERE id = ${tweet_id}
      `;
      });
      return likeData;
    } catch (error: unknown) {
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      if (error instanceof Error && (error as any).code === "23505") {
        throw new HTTPException(404, {
          message: "You have already liked this tweet",
        });
      }
      throw new HTTPException(500, {
        message: "Failed to like tweet",
      });
    }
  }
  public async dislikeTweet(user_id: string, tweet_id: string) {
    try {
      await db.begin(async (sql) => {
        const result = await sql`
        DELETE FROM likes 
        WHERE user_id = ${user_id} AND tweet_id = ${tweet_id}
        RETURNING *
      `;

        if (result.count === 0) {
          throw new HTTPException(404, {
            message: "Like not found",
          });
        }

        await sql`
        UPDATE tweets
        SET like_count = like_count - 1
        WHERE id = ${tweet_id}
      `;
      });
      return { message: "Tweet disliked successfully" };
    } catch (error: unknown) {
      throw new HTTPException(500, {
        message: "Failed to dislike tweet",
      });
    }
  }
}
