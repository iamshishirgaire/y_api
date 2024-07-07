import { HTTPException } from "hono/http-exception";
import db from "../../../db";
import type { GetMentions } from "./mention.schema";

export class MentionService {
  public async findAll(data: GetMentions, user_id: string) {
    const { query, page, page_size } = data;

    try {
      const res = await db`
        WITH ranked_users AS (
          SELECT
            u.id,
            u.user_name,
            u.verified,
            u.profile_picture,
            CASE
              WHEN f.followee_id IS NULL THEN FALSE
              ELSE TRUE
            END AS isFollowing,
            ROW_NUMBER() OVER (ORDER BY u.user_name ASC) AS row_num
          FROM
            users u
          LEFT JOIN
            followers f ON u.id = f.followee_id AND f.follower_id = ${user_id}
          WHERE
            u.user_name ILIKE ${`%${query}%`}
            and u.id != ${user_id}
        )
        SELECT
          id,
          user_name,
          verified,
          profile_picture,
          isFollowing
        FROM
          ranked_users
        WHERE
          row_num > ${(page - 1) * page_size}
        ORDER BY
          row_num
        LIMIT
          ${page_size}
      `;

      return res;
    } catch (error) {
      throw new HTTPException(500, {
        message: "Failed to fetch mentions",
      });
    }
  }
  public async findOne(): Promise<void> {
    // Your logic here
  }

  public async create(): Promise<void> {
    // Your logic here
  }

  public async update(): Promise<void> {
    // Your logic here
  }

  public async delete(): Promise<void> {
    // Your logic here
  }
}
