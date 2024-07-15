import { Hono } from "hono";
import { cors } from "hono/cors";
import { csrf } from "hono/csrf";
import { HTTPException } from "hono/http-exception";
import { logger } from "hono/logger";
import { testDbClient } from "../db";
import { routes } from "./app";
import { validateAuth } from "./middleware/auth.middleware";
import { collectDefaultMetrics, Counter, Gauge, Registry } from "prom-client";
import {
  metricsEndpoint,
  metricsMiddleware,
} from "./middleware/metrics.middleware";
import { loggingMiddleware } from "./middleware/logger.middleware";

const register = new Registry();
collectDefaultMetrics({ register });

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
app.use(loggingMiddleware);
app.use(metricsMiddleware);
app.get("/metrics", metricsEndpoint);
app.use(validateAuth);
routes(app);
export default app;
