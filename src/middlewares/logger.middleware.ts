import { createMiddleware } from "hono/factory";
import { logger } from "../services/winston";

export const loggingMiddleware = createMiddleware(async (c, next) => {
  const { method, url } = c.req;
  const start = Date.now();

  try {
    await next();
    const duration = Date.now() - start;
    const status = c.res.status;
    const message = `${method} ${url} ${status} - ${duration}ms`;

    logger.info(message, {
      method,
      url,
      status,
      duration,
    });
    if (status >= 400) {
      logger.error(message, {
        method,
        url,
        status,
        duration,
      });
    }
  } catch (error: unknown) {
    const duration = Date.now() - start;
    const status = 500;
    let errorMessage = "Unknown error";
    let errorStack = "";

    if (error instanceof Error) {
      errorMessage = error.message;
      errorStack = error.stack ?? "";
    }

    const message = `${method} ${url} ${status} - ${duration}ms - Error: ${errorMessage}`;

    logger.error(message, {
      method,
      url,
      status,
      duration,
      error: errorStack,
    });
    console.error("Error logging....");

    throw error;
  }
});
