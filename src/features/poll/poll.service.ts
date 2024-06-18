import db from "../../../db";
import { v4 as uuidv4 } from "uuid";
import type Poll from "../../../generated/public/Poll";
import type { CreatePoll, CreatePollResult } from "./poll.schema";

export default class PollService {
  public async findOne(id: string): Promise<Poll | null> {
    const poll = await db<Poll[]>`
      SELECT * FROM poll
      WHERE id = ${id}
    `;
    return poll[0] || null;
  }

  public async create(data: CreatePoll, uId: string): Promise<void> {
    const pollData = {
      id: uuidv4(),
      ...data,
      user_id: uId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    await db`insert into ${db(
      pollData,
      "id",
      "created_at",
      "description",
      "options",
      "title",
      "user_id",
      "updated_at",
      "created_at"
    )}`;
  }

  public async vote(data: CreatePollResult, uId: string): Promise<void> {
    const voteData = {
      id: uuidv4(),
      ...data,
      user_id: uId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    await db`insert into ${db(
      voteData,
      "id",
      "created_at",
      "updated_at",
      "user_id",
      "vote_option"
    )}`;
  }

  public async getPollsByUser(userId: string): Promise<Poll[]> {
    const polls = await db<Poll[]>`
      SELECT * FROM poll
      WHERE user_id = ${userId}
    `;
    return polls;
  }
}
