import db from "../../../db";
import type Tweets from "../../../generated/public/Tweets";
import type { CreateTweet, UpdateTweet } from "./tweet.schema";
import { v4 as uuidv4 } from "uuid";

export class TweetService {
  public async findAll(limit: number, offset: number): Promise<Tweets[]> {
    const tweets = await db<Tweets[]>`
      SELECT * FROM tweets
      ORDER BY created_at DESC
      LIMIT ${limit}
      OFFSET ${offset}
    `;
    return tweets;
  }

  public async findOne(id: string): Promise<Tweets | null> {
    const tweets = await db<Tweets[]>`
      SELECT * FROM tweets
      WHERE id = ${id}
    `;
    return tweets[0] || null;
  }

  public async create(data: CreateTweet, uid: string): Promise<void> {
    const tweetData = {
      id: uuidv4(),
      ...data,
      user_id: uid,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    await db`insert into tweets ${db(
      tweetData,
      "content",
      "created_at",
      "updated_at",
      "edited",
      "media_url",
      "visibility",
      "id",
      "user_id"
    )}`;
  }

  public async update(userId: string, data: UpdateTweet): Promise<void> {
    const tweetData = {
      ...data,
      updated_at: new Date().toISOString(),
    };
    await db`
      UPDATE tweets
      SET ${db(
        tweetData,
        "content",
        "updated_at",
        "edited",
        "media_url",
        "visibility"
      )}
      WHERE id = ${userId}
    `;
  }

  public async delete(id: string): Promise<void> {
    await db`
      DELETE FROM tweets
      WHERE id = ${id}
    `;
  }
}
