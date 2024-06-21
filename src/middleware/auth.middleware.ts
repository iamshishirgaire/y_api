// middlewares/auth.ts
import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";
import { publicRoutes } from "../public.routes";
import { validateToken } from "../utils/jwt";

export const validateAuth = createMiddleware(async (c, next) => {
  const absolutePath = c.req.path.split("/api/v1/")[1];
  if (publicRoutes.includes(absolutePath)) {
    console.log("Public route");

    await next();
    return;
  }

  // Get the access token from the Authorization header
  const authHeader = c.req.header("Authorization");

  if (!authHeader) {
    throw new HTTPException(401, { message: "No Authorization header found" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    throw new HTTPException(401, {
      message: "No token found in Authorization header",
    });
  }
  // Validate the token
  try {
    const decoded = validateToken(token);
    c.set("userId", decoded.userId);
    console.log("User ID: ", decoded.userId);
    await next();
  } catch (error: unknown) {
    //check if error is jwt expired error
    if (typeof error === "object" && error !== null && "name" in error) {
      if (error.name === "TokenExpiredError") {
        throw new HTTPException(403, { message: "Token expired" });
      }
    }
    throw new HTTPException(401, { message: "Invalid or expired token" });
  }
});
