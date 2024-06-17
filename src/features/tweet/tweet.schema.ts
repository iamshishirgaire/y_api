import { z } from "zod";

export const getTweetSchema = z.object({
  id: z.string(),
});

const VisibilityEnum = z.enum(["public", "private"]);

export const CreateTweetSchema = z.object({
  content: z.string().min(1),
  media_url: z.array(z.string().url()).optional(),
  edited: z.boolean().optional().default(false),
  visibility: VisibilityEnum.default("public"),
});

export const UpdateTweetSchema = z.object({
  content: z.string().min(1).optional(),
  media_url: z.array(z.string().url()).optional(),
  edited: z.boolean().optional(),
  visibility: VisibilityEnum.optional(),
});
export type CreateTweet = z.infer<typeof CreateTweetSchema>;
export type UpdateTweet = z.infer<typeof UpdateTweetSchema>;
