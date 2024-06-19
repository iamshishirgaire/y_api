import { HTTPException } from "hono/http-exception";

export const verifyAuth = (id1: string, id2: string) => {
  if (id1 !== id2) {
    throw new HTTPException(401, {
      message: "You are not authorized to update this user",
    });
  }
};
