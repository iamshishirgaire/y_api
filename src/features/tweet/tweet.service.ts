import db from "../../../db";
import type Tweets from "../../../generated/public/Tweets";
import type { CreateTweet, UpdateTweet } from "./tweet.schema";
import { v4 as uuidv4 } from "uuid";

export class TweetService {
  public async findAll(limit: number, offset: number): Promise<Tweets[]> {
    const tweets = await db<Tweets[]>`
      SELECT * FROM tweets
      where visibility = 'public'
      ORDER BY created_at DESC
      LIMIT ${limit}
      OFFSET ${offset}
    `;
    return tweets;
  }

  public async findOne(id: string): Promise<Tweets> {
    const tweets = await db<Tweets[]>`
      SELECT * FROM tweets
      WHERE id = ${id} AND visibility = 'public'
    `;
    return tweets[0] ?? {};
  }

  public async create(data: CreateTweet, uid: string) {
    const tweetData = {
      id: uuidv4(),
      ...data,
      user_id: uid,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    await db`insert into tweets ${db(tweetData)}`;
    return tweetData;
  }

  public async update(userId: string, data: UpdateTweet): Promise<void> {
    const { id, ...rest } = data;
    const tweetData = {
      ...rest,
      edited: true,
      updated_at: new Date().toISOString(),
    };
    await db`
      UPDATE tweets
      SET ${db(tweetData)}
      WHERE user_id = ${userId} and id = ${id}
    `;
  }

  public async delete(id: string): Promise<void> {
    await db`
      DELETE FROM tweets
      WHERE id = ${id}
    `;
  }
}
