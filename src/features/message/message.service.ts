import { HTTPException } from "hono/http-exception";
import db from "../../../db";
import { v4 as uuidv4 } from "uuid";
import type {
  CreateMessage,
  CreateMessageChannel,
  DeleteMessage,
  GetMessageChannels,
  GetMessages,
  UpdateMessage,
} from "./message.schema";
import type Messages from "../../../generated/public/Messages";
import { getChannelId } from "../../utils/getChannelId";
import type MessageChannels from "../../../generated/public/MessageChannels";

export class MessageService {
  public async findAll(data: GetMessages, userId: string) {
    try {
      const res = await db<Messages[]>`
    SELECT * FROM messages WHERE channel_id = ${data.channel_id}
    AND sender_id = ${userId} OR receiver_id = ${userId}
    ORDER BY created_at DESC
    LIMIT ${data.page_size} OFFSET ${data.page_size * data.page}
    `;
      return res;
    } catch (error) {
      console.log(error);
      throw new HTTPException(500, {
        message: "Failed to fetch messages",
      });
    }
  }

  public async findAllChannels(data: GetMessageChannels) {
    try {
      const res = await db<
        MessageChannels[]
      >`SELECT * FROM message_channels WHERE ${data.user_id} = ANY(users)
      ORDER BY created_at DESC  
     LIMIT ${data.page_size} OFFSET ${data.page_size * data.page}
      `;
      return res;
    } catch (error) {
      console.log(error);
      throw new HTTPException(500, {
        message: "Failed to fetch chats",
      });
    }
  }

  public async createChannel(data: CreateMessageChannel) {
    try {
      const channelData = {
        id: getChannelId(data.sender_id, data.receiver_id),
        users: [data.sender_id, data.receiver_id],
        created_at: new Date(),
        updated_at: new Date(),
      };
      const channel = await db`
      INSERT INTO message_channels ${db(channelData)}
      RETURNING *
      `;

      return channel;
    } catch (error) {
      console.log(error);
      throw new HTTPException(500, {
        message: "Failed to create channel",
      });
    }
  }

  public async create(data: CreateMessage) {
    try {
      const messageData = {
        id: uuidv4(),
        ...data,
        created_at: new Date(),
        updated_at: new Date(),
      };
      await db`
      INSERT INTO messages ${db(messageData)}`;
      return messageData;
    } catch (error) {
      throw new HTTPException(500, {
        message: "Failed to create message",
      });
    }
  }

  public async update(data: UpdateMessage, userId: string) {
    try {
      const messageData = {
        ...data,
        updated_at: new Date(),
      };
      await db`
      UPDATE messages SET ${db(messageData)} WHERE id = ${data.id}
      AND sender_id = ${userId}
      `;
      return messageData;
    } catch (error) {
      throw new HTTPException(500, {
        message: "Failed to create message",
      });
    }
  }

  public async delete(data: DeleteMessage) {
    try {
      await db`DELETE FROM messages WHERE id = ${data.id}`;
      return {
        message: "Message deleted successfully",
      };
    } catch (error) {
      throw new HTTPException(500, {
        message: "Failed to delete message",
      });
    }
  }
}
