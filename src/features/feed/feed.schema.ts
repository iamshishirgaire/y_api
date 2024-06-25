import { z } from "zod";

export const GetFeedSchema = z.object({
  page: z.string().transform((val) => Number.parseInt(val, 10)),
  page_size: z.string().transform((val) => Number.parseInt(val, 10)),
});

export type GetFeed = z.infer<typeof GetFeedSchema>;
