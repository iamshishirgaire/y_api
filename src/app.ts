import type { Hono } from "hono";
import { authRoute } from "./features/auth/auth.controller";
import { tweetRoute } from "./features/tweet/tweet.controller";
import { userRoute } from "./features/user/user.controller";
//handlers
export const routes = (app: Hono) => {
  app.route("/auth", authRoute);
  app.route("/feed", tweetRoute);
  app.route("/user", userRoute);
};
