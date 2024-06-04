import { Context, Env } from "hono";
import { ZodError } from "zod";
import { HTTPException } from "hono/http-exception";

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
