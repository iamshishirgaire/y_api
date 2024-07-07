import { z } from "zod";

const NotificationTypeEnum = z.enum(["verified", "mentions", "all"]);
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

export const CreateNotificationSchema = z
  .object({
    notif_type: NotificationTypeEnum.exclude(["all"]),
    post_type: PostTypeEnum,
    poll_id: z.string().uuid().nullable(),
    tweet_id: z.string().uuid().nullable(),
    message: z.string(),
    user_id: z.string().uuid(),
  })
  .transform((d) => {
    if (!d.tweet_id && !d.poll_id) {
      throw new Error("Either tweet_id or poll_id must be provided");
    }
    return d;
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
