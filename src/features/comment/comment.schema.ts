import { z } from "zod";

export const CreateCommentSchema = z
  .object({
    content: z.string().min(1, "Content cannot be empty"),
    media_url: z.array(z.string().url()).optional(),
    tweet_id: z.string().uuid().optional(),
    poll_id: z.string().uuid().nullable().optional(),
    reply_to_id: z.string().uuid().nullable().optional(),
  })
  .refine((data) => data.tweet_id || data.poll_id, {
    message: "Either tweet_id or poll_id must be provided",
    path: ["tweet_id", "poll_id"],
  });

export const DeleteCommentSchema = z.object({
  comment_id: z.string().uuid(),
  user_id: z.string().uuid(),
});

export const GetCommentsSchema = z.object({
  id: z.string().uuid(),
  type: z.enum(["tweet", "poll"]),
});
export const GetCommentRepliesSchema = z.object({
  id: z.string().uuid(),
});

export type CreateComment = z.infer<typeof CreateCommentSchema>;
export type DeleteComment = z.infer<typeof DeleteCommentSchema>;
export type GetCommentRepliesSchema = z.infer<typeof GetCommentRepliesSchema>;
export type GetComment = z.infer<typeof GetCommentsSchema>;
