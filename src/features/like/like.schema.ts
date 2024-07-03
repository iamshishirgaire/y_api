import { z } from "zod";

export const IsLikedByMeSchema = z.object({
  user_id: z.string(),
  tweet_id: z.string(),
});

export const CreateLikeSchema = z.object({
  tweet_id: z.string(),
});

export const DeleteLikeSchema = z.object({
  user_id: z.string(),
  tweet_id: z.string(),
});
