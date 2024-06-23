import type { Hono } from "hono";
import { authRoute } from "./features/auth/auth.controller";
import { tweetRoute } from "./features/tweet/tweet.controller";
import { userRoute } from "./features/user/user.controller";
import { pollRoute } from "./features/poll/poll.controller";
import { notificationRoute } from "./features/notification/notification.controller";
import { messageRoute } from "./features/message/message.controller";
import { feedRoute } from "./features/feed/feed.controller";
import { likeRoute } from "./features/like/like.controller";
import { commentRoute } from "./features/comment/comment.controller";
//handlers
export const routes = (app: Hono) => {
  app.route("/auth", authRoute);
  app.route("/tweet", tweetRoute);
  app.route("/user", userRoute);
  app.route("/poll", pollRoute);
  app.route("/notification", notificationRoute);
  app.route("/message", messageRoute);
  app.route("/feed", feedRoute);
  app.route("/like", likeRoute);
  app.route("/comment", commentRoute);
};
