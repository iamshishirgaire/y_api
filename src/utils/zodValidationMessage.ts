import type { Context, Env } from "hono";
import { HTTPException } from "hono/http-exception";
import type { ZodError } from "zod";

type c = Context<Env, string, {}>;
type result =
  | {
    success: true;
    data: any;
  }
  | {
    success: false;
    error: ZodError<any>;
    data: any;
  };

export function onErrorMsg(result: result, c: c) {
  if (!result.success) {
    throw new HTTPException(400, {
      message: result.error.errors.map((e) => e.message).join(", "),
    });
  }
}
