import { HTTPException } from "hono/http-exception";
import type { CreateHashTags, GetHasTags } from "./hashtag.schema";
import db from "../../../db";
import { v4 as UUIDV4 } from "uuid";

export class HashtagService {
  public async findAll(data: GetHasTags) {
    try {
      const hashtags = await db`
        SELECT id, hashtag FROM hash_tags
        WHERE hashtag ILIKE ${`${data.query}%`}
        ORDER BY created_at DESC
        OFFSET ${data.page * data.page_size}
        LIMIT ${data.page_size}
      `;
      return hashtags;
    } catch (error) {
      console.log(error);
      throw new HTTPException(500, {
        message: "Failed to fetch hashtags",
      });
    }
  }

  public async findOne() {
    // Your logic here
  }

  public async create(data: CreateHashTags) {
    const hashtagData = {
      ...data,
      id: UUIDV4(),
    };
    try {
      const res = db`
        INSERT INTO hash_tags ${db(hashtagData)}
        ON CONFLICT(hashtag) do nothing
        RETURNING *
         `;
      return res;
    } catch (error) {
      throw new HTTPException(500, {
        message: "Failed to create hashtag",
      });
    }
  }
}
