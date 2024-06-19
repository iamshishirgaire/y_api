import type { Context, Env } from "hono";
import { HTTPException } from "hono/http-exception";
import type { ZodError } from "zod";

// biome-ignore lint/complexity/noBannedTypes: <explanation>
type c = Context<Env, string, {}>;
type result =
  | {
      success: true;
      data: unknown;
    }
  | {
      success: false;
      error: ZodError<unknown>;
      data: unknown;
    };

export function onErrorMsg(result: result, c: c) {
  if (!result.success) {
    throw new HTTPException(400, {
      message: JSON.stringify(result.error.errors),
    });
  }
}
