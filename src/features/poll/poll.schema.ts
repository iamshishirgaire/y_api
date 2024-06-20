import { z } from "zod";

const VisibilityEnum = z.enum(["public", "private"]);

export const GetPollSchema = z.object({
  id: z.string().uuid(),
});
export const GetPollByUsersSchema = z.object({
  userId: z.string().uuid(),
});

export const CreatePollSchema = z.object({
  description: z.string().min(1),
  options: z.array(z.string()).min(2).max(5),
  visibility: VisibilityEnum.default("public"),
});

export const CreatePollResultSchema = z.object({
  poll_id: z.string().uuid(),
  vote_option: z.number().int().nonnegative(),
});

export type CreatePollResult = z.infer<typeof CreatePollResultSchema>;
export type CreatePoll = z.infer<typeof CreatePollSchema>;
