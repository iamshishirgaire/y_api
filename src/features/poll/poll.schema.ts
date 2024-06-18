import { z } from "zod";

const VisibilityEnum = z.enum(["public", "private"]);

export const GetPollSchema = z.object({
  id: z.string().uuid(),
});
export const CreatePollSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  options: z.array(z.string()).min(2),
  visibility: VisibilityEnum.default("public"),
});

export const CreatePollResultSchema = z.object({
  poll_id: z.string().uuid(),
  vote_option: z.number().int().nonnegative(),
});

export type CreatePollResult = z.infer<typeof CreatePollResultSchema>;
export type CreatePoll = z.infer<typeof CreatePollSchema>;
