import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { userQuerySchema } from "./user.schema";
import { onErrorMsg } from "../../utils/zodValidationMessage";
import { UserService } from "./user.service";
import { HTTPException } from "hono/http-exception";
export const userRoute = new Hono();

const userService = new UserService();
userRoute.get("/", zValidator("query", userQuerySchema, onErrorMsg), (c) => {
  const query = c.req.valid("query");
  if (query.email) {
    return c.json(userService.findByEmail(query.email));
  }
  if (query.id) {
    return c.json(userService.findById(query.id));
  } else {
    throw new HTTPException(400, {
      message: "Query must contain either 'email' or 'id'",
    });
  }
});
