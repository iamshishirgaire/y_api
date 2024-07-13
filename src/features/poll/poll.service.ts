import db from "../../../db";
import { v4 as uuidv4 } from "uuid";
import type { CreatePoll, CreatePollResult } from "./poll.schema";
import type Polls from "../../../generated/public/Polls";
import { HTTPException } from "hono/http-exception";
import type PollResults from "../../../generated/public/PollResults";

export default class PollService {
  public async findOne(id: string, userId: string) {
    try {
      const poll = await db`
        WITH VoteCounts AS (
          SELECT
            pr.poll_id,
            pr.vote_option,
            COUNT(pr.vote_option) AS vote_count,
            SUM(COUNT(pr.vote_option)) OVER (PARTITION BY pr.poll_id) AS total_votes
          FROM
            poll_results pr
          WHERE
            pr.poll_id = ${id}
          GROUP BY
            pr.poll_id, pr.vote_option
        )
        SELECT
          p.id AS poll_id,
          p.user_id,
          p.description,
          p.visibility,
          p.created_at,
          p.updated_at,
          p.like_count,
          p.comment_count,
          p.retweet_count,
          p.vote_count,
          p.view_count,
          (
            SELECT pr.vote_option
            FROM poll_results pr
            WHERE pr.poll_id = p.id AND pr.user_id = ${userId}
            LIMIT 1
          ) AS voted_option,
          json_agg(
            json_build_object(
              'option', p.options[opt_idx + 1],
              'percentage', ROUND(COALESCE(vc.vote_count * 100.0 / NULLIF(vc.total_votes, 0), 0), 2)
            ) ORDER BY opt_idx
          ) AS results
        FROM
          polls p
        LEFT JOIN LATERAL (
          SELECT
            generate_series(0, array_length(p.options, 1) - 1) AS opt_idx
        ) AS opt ON true
        LEFT JOIN VoteCounts vc ON p.id = vc.poll_id AND opt.opt_idx = vc.vote_option
        WHERE
          p.id = ${id}
        GROUP BY
          p.id, p.user_id, p.description, p.visibility, p.created_at, p.updated_at;
      `;
      return poll[0];
    } catch (error) {
      console.log(error);
      throw new HTTPException(500, {
        message: "Failed to fetch poll",
      });
    }
  }

  public async create(data: CreatePoll, uId: string) {
    try {
      const pollData = {
        id: uuidv4(),
        description: data.description,
        options: data.options,
        visibility: data.visibility,
        expired_at: new Date(data.duration),
        user_id: uId,
      };

      await db`insert into polls ${db(pollData)}`;
      return pollData;
    } catch (error) {
      console.log(error);
      throw new HTTPException(400, {
        message: "Failed to create poll",
      });
    }
  }

  public async vote(data: CreatePollResult, uId: string) {
    try {
      const voteData = {
        id: uuidv4(),
        ...data,
        user_id: uId,
      };
      const poll = await db<Polls[]>`
        SELECT * FROM polls
        WHERE id = ${data.poll_id}
      `;
      if (poll.length === 0) {
        throw new Error("Poll does not exist");
      }
      if (poll[0].expired_at < new Date()) {
        throw new HTTPException(400, {
          message: "Poll has expired",
        });
      }
      if (
        data.vote_option > poll[0].options.length - 1 &&
        data.vote_option < 0
      ) {
        throw new Error("Invalid vote option");
      }
      const existingVote = await db<PollResults[]>`
        SELECT * FROM poll_results
        WHERE poll_id = ${data.poll_id} AND user_id = ${uId}
      `;

      await db.begin(async (sql) => {
        if (existingVote.length > 0) {
          // User has already voted, update their vote
          await sql`
                 UPDATE poll_results
                 SET vote_option = ${data.vote_option}
                 WHERE poll_id = ${data.poll_id} AND user_id = ${uId}
               `;
        } else {
          // Insert new vote
          await sql`
                 INSERT INTO poll_results ${sql(voteData)}
               `;
          await sql`
                 UPDATE polls
                 SET vote_count = vote_count + 1
                 WHERE id = ${data.poll_id}
               `;
        }
      });
      return voteData;
    } catch (error) {
      console.log(error);
      throw new HTTPException(400, {
        message: "Failed to vote",
      });
    }
  }

  public async getPollsByUser(userId: string) {
    try {
      const pollsIds = await db`
        SELECT id FROM polls
        WHERE user_id = ${userId}
      `;
      return pollsIds;
    } catch (error) {
      throw new HTTPException(500, {
        message: "Failed to fetch polls",
      });
    }
  }
  public async deletePoll(userId: string, pollId: string) {
    try {
      const polls = await db<Polls[]>`
       DELETE FROM polls
       WHERE user_id = ${userId} and id = ${pollId}
     `;
      return polls;
    } catch (error) {
      throw new HTTPException(500, {
        message: "Failed to delete poll",
      });
    }
  }
  public async GetPollInFeed(userId: string) {
    try {
      // SELECT p.id
      // FROM polls p
      // JOIN followers f ON p.user_id = f.followee_id
      // WHERE f.follower_id = ${userId}
      //   AND p.expired_at > CURRENT_TIMESTAMP;
      const polls = await db`
      SELECT id,user_id from polls
    `;
      return polls;
    } catch (error) {
      throw new HTTPException(500, {
        message: "Failed to fetch polls",
      });
    }
  }
}
