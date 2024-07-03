import cloudinary from "cloudinary";
import env from "../src/utils/env";
const timestamp = Math.round(new Date().getTime() / 1000);
const signature = cloudinary.v2.utils.api_sign_request(
  {
    timestamp: timestamp,
  },
  env.CLOUDINARY_URL
);
