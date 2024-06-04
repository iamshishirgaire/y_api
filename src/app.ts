import { Hono } from "hono";
import { authRoute } from "./features/auth/auth.controller";
import { feedRoute } from "./features/feed/feed.controller";
//handlers
export const routes = (app: Hono) => {
  app.route("/auth", authRoute);
  app.route("/feed", feedRoute);
};
