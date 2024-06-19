import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { onErrorMsg } from "../../utils/zodValidationMessage";
import { updateUserSchema, userQuerySchema } from "./user.schema";
import { UserService } from "./user.service";
import { verifyAuth } from "../../utils/verifyAuth";

type Variables = {
  userId: string;
};
export const userRoute = new Hono<{ Variables: Variables }>();

const userService = new UserService();

userRoute
  .get("/", zValidator("query", userQuerySchema, onErrorMsg), async (c) => {
    const query = c.req.valid("query");
    if (query.email) {
      return c.json((await userService.findByEmail(query.email)) ?? {});
    }
    if (query.id) {
      return c.json((await userService.findById(query.id)) ?? {});
    }
    throw new HTTPException(400, {
      message: "Query must contain either 'email' or 'id'",
    });
  })
  .patch("/", zValidator("json", updateUserSchema, onErrorMsg), async (c) => {
    const body = c.req.valid("json");
    const id = c.get("userId");
    verifyAuth(body.id, id);
    try {
      await userService.update(body);
      c.status(201);
      return c.json({
        message: "User updated successfully",
      });
    } catch (e) {
      throw new HTTPException(400, {
        message: "Failed to update user",
      });
    }
  });
