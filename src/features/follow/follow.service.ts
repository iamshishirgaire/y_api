import { HTTPException } from "hono/http-exception";
import db from "../../../db";
import type { Follow, GetFollower, Unfollow } from "./follow.schema";
import type Followers from "../../../generated/public/Followers";
import { v4 as uuidv4 } from "uuid";

export class FollowService {
  public async findAllFollowers(data: GetFollower) {
    try {
      const res = await db<Followers[]>`SELECT * FROM followers
      WHERE follower_id = ${data.user_id} 
      LIMIT ${data.page_size} OFFSET ${data.page_size * data.page}`;
      return res;
    } catch (e) {
      throw new HTTPException(500, {
        message: "Failed to fetch followers",
      });
    }
  }
  public async findAllFollowing(data: GetFollower) {
    try {
      const res = await db<Followers[]>`SELECT * FROM followers
      WHERE followee_id = ${data.user_id} 
      LIMIT ${data.page_size} OFFSET ${data.page_size * data.page}`;
      return res;
    } catch (e) {
      throw new HTTPException(500, {
        message: "Failed to fetch followers",
      });
    }
  }
  public async create(data: Follow, user_id: string) {
    try {
      const followerData = {
        id: uuidv4(),
        follower_id: user_id,
        followee_id: data.user_id,
      };
      const res = await db<Followers[]>`INSERT INTO followers ${db(
        followerData
      )} RETURNING *`;
      return res[0];
    } catch (error) {
      throw new HTTPException(500, {
        message: "Failed to follow user",
      });
    }
  }

  public async delete(data: Unfollow, userId: string) {
    try {
      const res = await db<Followers[]>`DELETE FROM followers
      WHERE followee_id = ${data.user_id} AND follower_id = ${userId}`;
      return {
        message: "User unfollowed",
      };
    } catch (error) {
      throw new HTTPException(500, {
        message: "Failed to unfollow user",
      });
    }
  }
}
