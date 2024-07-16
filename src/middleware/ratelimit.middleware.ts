import { createMiddleware } from "hono/factory";
import { opts, rateLimiter } from "../utils/rate-limiter";

export const rateLimiterMiddleware = createMiddleware(async (c, next) => {
  try {
    console.log("Rate limiter middleware", c.req.raw.headers ?? "hello");
    const rateLimiterRes = await rateLimiter.consume(
      c.req.raw.headers.get("CF-Connecting-IP") ?? "",
    );
    await next();
    const headers = {
      "Retry-After": rateLimiterRes.msBeforeNext / 1000,
      "X-RateLimit-Limit": opts.points,
      "X-RateLimit-Remaining": rateLimiterRes.remainingPoints,
      "X-RateLimit-Reset": new Date(Date.now() + rateLimiterRes.msBeforeNext),
    };
    c.set("header", headers);
  } catch (err) {
    if (err instanceof Error) {
      c.json({
        message: err.message,
      });
    } else {
      c.status(429);
      const secs =
        Math.round(
          // biome-ignore lint/suspicious/noExplicitAny: <explanation>
          Number((err as any).msBeforeNext) / 1000 || 1,
        ) || 1;
      c.header("Retry-After", String(secs));
      c.json({
        message: "Too many requests",
      });
    }
  }
});
