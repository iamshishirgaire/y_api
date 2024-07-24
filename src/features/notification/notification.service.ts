import { HTTPException } from "hono/http-exception";
import db from "../../../db";
import { v4 as uuidv4 } from "uuid";

import type {
  CreateNotification,
  DeleteNotification,
  GetNotification,
  UpdateNotification,
} from "./notification.schema";

export class NotificationService {
  public async findAll(data: GetNotification, userId: string) {
    try {
      if (data.type === "all") {
        const notifications = await db`
          SELECT * FROM notifications WHERE user_id = ${userId}
          order by created_at desc
          limit ${data.page_size} offset ${data.page}
        `;
        return notifications;
      }
      const notifications = await db`
        SELECT * FROM notifications WHERE user_id = ${userId}
        and notif_type = ${data.type}
        order by created_at desc
        limit ${data.page_size} offset ${data.page}
      `;
      return notifications;
    } catch (error) {
      throw new HTTPException(500, {
        message: "Failed to retrieve notifications",
      });
    }
  }

  public async findOne(id: string) {
    try {
      const notification = await db`
        SELECT * FROM notifications WHERE id = ${id}
      `;
      if (notification.length === 0) {
        throw new HTTPException(404, {
          message: "Notification not found",
        });
      }
      return notification[0];
    } catch (error) {
      throw new HTTPException(500, {
        message: "Failed to retrieve notification",
      });
    }
  }

  public async create(data: CreateNotification[]) {
    const notificationData = {
      id: uuidv4(),
      ...data,
      seen: false,
      created_at: new Date(),
    };
    try {
      await db`
        INSERT INTO notifications ${db(notificationData)}
      `;
      return notificationData;
    } catch (error) {
      throw new HTTPException(500, {
        message: "Failed to create notification",
      });
    }
  }

  public async update(data: UpdateNotification) {
    try {
      const notification = await db`
        UPDATE notifications
        SET seen = true
        WHERE id = ${data.id}
        RETURNING *
      `;
      if (notification.length === 0) {
        throw new HTTPException(404, {
          message: "Notification not found",
        });
      }
      return notification[0];
    } catch (error) {
      throw new HTTPException(500, {
        message: "Failed to update notification",
      });
    }
  }

  public async delete(data: DeleteNotification) {
    try {
      const result = await db`
        DELETE FROM notifications
        WHERE id = ${data.id}
        RETURNING *
      `;
      if (result.count === 0) {
        throw new HTTPException(404, {
          message: "Notification not found",
        });
      }
      return { message: "Notification deleted successfully" };
    } catch (error) {
      throw new HTTPException(500, {
        message: "Failed to delete notification",
      });
    }
  }
}
