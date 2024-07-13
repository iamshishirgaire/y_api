import { z } from "zod";

export const getTweetSchema = z.object({
  id: z.string().uuid(),
});

const VisibilityEnum = z.enum(["public", "private"]);

export const CreateTweetSchema = z
  .object({
    content: z.string().optional(),
    media_url: z.array(z.string().url()).optional(),
    visibility: VisibilityEnum.default("public"),
    parent_tweet_id: z.string().uuid().optional(),
  })
  .transform((data) => {
    console.log(data);
    const isContentEmpty = !data.content || /^\s*$/.test(data.content);

    if (
      isContentEmpty &&
      (!data.media_url || data.media_url.length === 0) &&
      !data.parent_tweet_id
    ) {
      throw new Error(
        "Tweet must contain either non-empty content, media_url, or parent_tweet_id",
      );
    }
    return data;
  });

export const UpdateTweetSchema = z.object({
  id: z.string().uuid(),
  content: z.string().min(1).optional(),
  media_url: z.array(z.string().url()).optional(),
  visibility: VisibilityEnum.optional(),
});
export type CreateTweet = z.infer<typeof CreateTweetSchema>;
export type UpdateTweet = z.infer<typeof UpdateTweetSchema>;
