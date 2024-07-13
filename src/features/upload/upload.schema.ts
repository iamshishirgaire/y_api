import { z } from "zod";

export const GetUploadUrlSchema = z.object({
  type: z.enum(["image", "video"]),
});
export type Upload = z.infer<typeof GetUploadUrlSchema>;
