import { HTTPException } from "hono/http-exception";
import { v4 as uuidv4 } from "uuid";
import db from "../../../db";
import type Tweets from "../../../generated/public/Tweets";
import { getHashTagsandMentions } from "../../utils/getHashTagsandMentions";
import type { CreateHashTags } from "../hashtag/hashtag.schema";
import { NotificationMessagesCreator } from "../notification/notification-messages";
import type { CreateNotification } from "../notification/notification.schema";
import type { CreateTweet, UpdateTweet } from "./tweet.schema";

export class TweetService {
  public async findAll(limit: number, offset: number): Promise<Tweets[]> {
    try {
      const tweets = await db<Tweets[]>`
        SELECT * FROM tweets
        where visibility = 'public'
        ORDER BY created_at DESC
        LIMIT ${limit}
        OFFSET ${offset}
      `;
      return tweets;
    } catch (error) {
      throw new HTTPException(500, {
        message: "Failed to fetch tweets",
      });
    }
  }

  public async findOne(id: string): Promise<Tweets> {
    try {
      const tweets = await db<Tweets[]>`
       SELECT * FROM tweets
       WHERE id = ${id} AND visibility = 'public'
     `;
      if (tweets.length === 0) {
        throw new HTTPException(404, {
          message: "Tweet not found",
        });
      }
      return tweets[0];
    } catch (error) {
      throw new HTTPException(500, {
        message: "Failed to fetch tweet",
      });
    }
  }

  public async create(data: CreateTweet, uid: string, user_name: string) {
    try {
      const tweetContent = data.content;
      if (tweetContent && tweetContent.length > 300) {
        throw new HTTPException(400, {
          message: "Tweet content is too long",
        });
      }
      const { hashTags, mentions } = getHashTagsandMentions(tweetContent ?? "");
      console.log(hashTags, mentions);
      const tweetData = {
        id: uuidv4(),
        ...data,
        media_url: data.media_url ? `{${data.media_url.join(",")}}` : null,
        user_id: uid,
      };
      await db.begin(async (sql) => {
        await sql`
         INSERT INTO tweets ${sql(tweetData)}
       `;
        if (data.parent_tweet_id) {
          await sql`update tweets set retweet_count = retweet_count + 1 where id = ${data.parent_tweet_id}`;
        }
        if (hashTags && hashTags.length > 0) {
          const hashTagData: (CreateHashTags & {
            id: string;
          })[] = [];
          for (const tag of hashTags) {
            hashTagData.push({
              hashtag: tag,
              id: uuidv4(),
            });
          }
          await sql`INSERT INTO hash_tags
           ${sql(hashTagData, "hashtag", "id")}
            ON CONFLICT(hashtag)
            DO UPDATE SET count = hash_tags.count + 1;
            `;
        }
        if (mentions && mentions.length > 0) {
          const users = await sql<{ id: string }[]>`
            SELECT id  FROM users
            WHERE user_name = ANY(${mentions})
          `;

          const notficationMessage = new NotificationMessagesCreator();
          const notificationData: (CreateNotification & {
            id: string;
            seen: boolean;
          })[] = [];
          for (const user of users) {
            if (user.id === uid) {
              return;
            }
            notificationData.push({
              user_id: user.id,
              notif_type: "mentions",
              id: uuidv4(),
              seen: false,
              post_type: "tweet",
              tweet_id: tweetData.id,
              poll_id: null,
              message: notficationMessage.mentionNotification(user_name),
            });
          }
          await sql`INSERT INTO notifications ${db(notificationData)}

          `;
        }
      });
      return tweetData;
    } catch (error) {
      console.log(error);
      throw new HTTPException(400, {
        message: "Failed to create tweet",
      });
    }
  }

  public async update(userId: string, data: UpdateTweet): Promise<void> {
    const { id, ...rest } = data;
    const tweetData = {
      ...rest,
      edited: true,
      updated_at: new Date(),
    };
    await db`
      UPDATE tweets
      SET ${db(tweetData)}
      WHERE user_id = ${userId} and id = ${id}
    `;
  }

  public async delete(id: string): Promise<void> {
    await db.begin(async (sql) => {
      const originalTweet = await sql<Tweets[]>`
      SELECT * FROM tweets
      WHERE id = ${id}
    `;
      if (originalTweet.length === 0) {
        throw new HTTPException(404, {
          message: "Tweet not found",
        });
      }
      await sql`
      DELETE FROM tweets
      WHERE id = ${id}
    `;
      if (originalTweet[0].parent_tweet_id) {
        await sql`update tweets set retweet_count = retweet_count - 1 where id = ${originalTweet[0].parent_tweet_id}`;
      }
    });
  }
}
