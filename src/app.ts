import type { Hono } from "hono";
import { authRoute } from "./features/auth/auth.controller";
import { tweetRoute } from "./features/tweet/tweet.controller";
import { userRoute } from "./features/user/user.controller";
import { pollRoute } from "./features/poll/poll.controller";
//handlers
export const routes = (app: Hono) => {
  app.route("/auth", authRoute);
  app.route("/tweet", tweetRoute);
  app.route("/user", userRoute);
  app.route("/poll", pollRoute);
};
