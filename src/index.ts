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
  let message: { message: string };
  try {
    message = JSON.parse(err.message);
  } catch (error) {
    message = { message: err.message };
  }

  if (err instanceof HTTPException) {
    c.status(err.status);
    return c.json(message);
  }

  c.status(500);
  return c.json({
    message: "Internal server error",
    error: message,
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
