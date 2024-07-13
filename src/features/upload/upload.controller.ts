import { Hono } from "hono";
import { UploadService } from "./upload.service";
import { zValidator } from "@hono/zod-validator";
import { GetUploadUrlSchema } from "./upload.schema";
import { onErrorMsg } from "../../utils/zodValidationMessage";
export const uploadRoute = new Hono();
const uploadService = new UploadService();

uploadRoute.get(
  "/",
  zValidator("query", GetUploadUrlSchema, onErrorMsg),
  async (c) => {
    const reqData = c.req.valid("query");
    console.log(reqData);
    return c.json(await uploadService.generateSignedUrl(reqData));
  },
);
