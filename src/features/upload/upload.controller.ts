import { Hono } from "hono";
import { UploadService } from "./upload.service";
export const uploadRoute = new Hono();
const uploadService = new UploadService();

uploadRoute.get("/", async (c) => {
  return c.json(await uploadService.generateSignedUrl());
});
