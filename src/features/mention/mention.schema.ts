import { z } from "zod";

export const getMentionsSchema = z.object({
  page: z.string().transform((val) => Number.parseInt(val, 10)),
  page_size: z.string().transform((val) => Number.parseInt(val, 10)),
  query: z.string(),
});
export type GetMentions = z.infer<typeof getMentionsSchema>;
