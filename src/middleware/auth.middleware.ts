import { createMiddleware } from "hono/factory";

export const validateAuth = createMiddleware(async (c, next) => {
  console.log(`[${c.req.method}] ${c.req.url}`);
  await next();
});
