import { z } from "zod";

export const getHashTagsSchema = z.object({
  page: z.string().transform((val) => Number.parseInt(val, 10)),
  page_size: z.string().transform((val) => Number.parseInt(val, 10)),
  query: z.string(),
});
export const createHashTagsSchema = z.object({
  hashtag: z.string(),
});
export type GetHasTags = z.infer<typeof getHashTagsSchema>;
export type CreateHashTags = z.infer<typeof createHashTagsSchema>;
