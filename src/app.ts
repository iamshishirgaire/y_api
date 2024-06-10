import type { Hono } from "hono";
import { authRoute } from "./features/auth/auth.controller";
import { feedRoute } from "./features/feed/feed.controller";
import { userRoute } from "./features/user/user.controller";
//handlers
export const routes = (app: Hono) => {
  app.route("/auth", authRoute);
  app.route("/feed", feedRoute);
  app.route("/user", userRoute);
};
