import db from "../../../db";
import { v4 as uuidv4 } from "uuid";
import type { CreatePoll, CreatePollResult } from "./poll.schema";
import type Polls from "../../../generated/public/Polls";

export default class PollService {
  public async findOne(id: string) {
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
        pr.poll_id = ${id}  -- Replace with the actual pollId value
    GROUP BY
        pr.poll_id, pr.vote_option
)
SELECT
    p.id AS poll_id,
    p.user_id,
    p.description,
    p.options AS all_options,
    p.visibility,
    p.created_at,
    p.updated_at,
    json_agg(
        json_build_object(
            'option', p.options[opt_idx + 1],  -- Adjust for 1-based index
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
    p.id = ${id}  -- Replace with the actual pollId value
GROUP BY
    p.id, p.user_id, p.description, all_options, p.visibility, p.created_at, p.updated_at;


    `;
    return poll[0];
  }

  public async create(data: CreatePoll, uId: string) {
    const pollData = {
      id: uuidv4(),
      ...data,
      user_id: uId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    await db`insert into polls ${db(pollData)}`;
    return pollData;
  }

  public async vote(data: CreatePollResult, uId: string) {
    const voteData = {
      id: uuidv4(),
      ...data,
      user_id: uId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    const poll = await db<Polls[]>`
      SELECT * FROM polls
      WHERE id = ${data.poll_id}
    `;
    if (poll.length === 0) {
      throw new Error("Poll does not exist");
    }
    if (data.vote_option > poll[0].options.length - 1 && data.vote_option < 0) {
      throw new Error("Invalid vote option");
    }
    await db`insert into poll_results ${db(voteData)}`;
    return voteData;
  }

  public async getPollsByUser(userId: string) {
    const polls = await db`
WITH VoteCounts AS (
    SELECT
        pr.poll_id,
        pr.vote_option,
        COUNT(pr.vote_option) AS vote_count,
        SUM(COUNT(pr.vote_option)) OVER (PARTITION BY pr.poll_id) AS total_votes
    FROM
        poll_results pr
    GROUP BY
        pr.poll_id, pr.vote_option
)
SELECT
    p.id AS poll_id,
    p.user_id,
    p.description,
    p.options AS all_options,
    p.visibility,
    p.created_at,
    p.updated_at,
    json_agg(
        json_build_object(
            'option', p.options[opt_idx + 1],  -- Adjust for 1-based index
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
    p.user_id = ${userId}  -- Replace with the actual userId value
GROUP BY
    p.id, p.user_id, p.description, all_options, p.visibility, p.created_at, p.updated_at
ORDER BY
    p.created_at DESC;

    `;
    return polls;
  }
  public async deletePoll(userId: string, pollId: string) {
    const polls = await db<Polls[]>`
      DELETE FROM polls
      WHERE user_id = ${userId} and id = ${pollId}
    `;
  }
}
