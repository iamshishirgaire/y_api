import { z } from "zod";

export const GetFollowerSchema = z.object({
  user_id: z.string().uuid(),
  type: z.enum(["followers", "following"]),
  page: z.string().transform((val) => Number.parseInt(val, 10)),
  page_size: z.string().transform((val) => Number.parseInt(val, 10)),
});
export const FollowSchema = z.object({
  user_id: z.string().uuid(),
});

export type GetFollower = z.infer<typeof GetFollowerSchema>;
export type GetFollowing = z.infer<typeof GetFollowerSchema>;
export type Follow = z.infer<typeof FollowSchema>;
export type Unfollow = z.infer<typeof FollowSchema>;
