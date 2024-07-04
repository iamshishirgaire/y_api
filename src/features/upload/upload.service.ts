import { v2 } from "cloudinary";
import env from "../../utils/env";

export class UploadService {
  public async generateSignedUrl() {
    try {
      const timestamp = Math.round(new Date().getTime() / 1000);
      const signature = v2.utils.api_sign_request(
        {
          timestamp,
        },
        env.CLOUDINARY_API_SECRET
      );
      const uploadUrl = v2.utils.api_url("upload", {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        timestamp,
        signature,
      });
      return {
        uploadUrl,
        timestamp,
        signature,
        api_key: process.env.CLOUDINARY_API_KEY,
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      };
    } catch (error) {}
  }
}
