import { z } from "zod";

const NotificationTypeEnum = z.enum(["verified", "mention", "all"]);
const PostTypeEnum = z.enum(["tweet", "poll"]);

export const GetNotificationSchema = z.object({
  user_id: z.string().uuid(),
  type: NotificationTypeEnum,
  page: z.number().int(),
  limit: z.number().int(),
});
export const GetSingleNotificationSchema = z.object({
  id: z.string().uuid(),
});

export const CreateNotificationSchema = z.object({
  notif_type: NotificationTypeEnum.exclude(["all"]),
  post_type: PostTypeEnum,
  content_id: z.string().uuid().nullable(),
  message: z.string().nullable(),
  user_id: z.string().uuid(),
});

export const DeleteNotificationSchema = z.object({
  id: z.string().uuid(),
});

export const UpdateNotificationSchema = z.object({
  id: z.string().uuid(),
});

export type GetNotification = z.infer<typeof GetNotificationSchema>;
export type CreateNotification = z.infer<typeof CreateNotificationSchema>;
export type DeleteNotification = z.infer<typeof DeleteNotificationSchema>;
export type UpdateNotification = z.infer<typeof UpdateNotificationSchema>;
