import { Hono } from "hono";
import { logger } from "hono/logger";
import { testDbClient } from "../db";
import { cors } from "hono/cors";
import { routes } from "./app";
import { csrf } from "hono/csrf";
import { HTTPException } from "hono/http-exception";
import { validateAuth } from "./middleware/auth.middleware";

await testDbClient();
const app = new Hono().basePath("/api/v1");
app.use(csrf());
app.use(logger());
app.use(cors());

app.onError((err, c) => {
  if (err instanceof HTTPException) {
    return err.getResponse();
  }
  return c.json({
    message: "Internal Server Error",
    error: err,
  });
});

app.get("/status", (c) => {
  return c.json({
    message: "Server up and running",
  });
});
app.use(validateAuth);
routes(app);
export default app;
