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
  options: z.array(z.string()).min(2).max(4),
  visibility: VisibilityEnum.default("public"),
  duration: z.string().refine((date) => {
    const parsedDate = new Date(date);
    return (
      parsedDate.getTime() > Date.now() &&
      parsedDate.getTime() < Date.now() + 7 * 24 * 60 * 60 * 1000
    );
  }),
});

export const CreatePollResultSchema = z.object({
  poll_id: z.string().uuid(),
  vote_option: z.number().int().nonnegative(),
});

export type CreatePollResult = z.infer<typeof CreatePollResultSchema>;
export type CreatePoll = z.infer<typeof CreatePollSchema>;
