import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { onErrorMsg } from "../../utils/zodValidationMessage";
import { UserService } from "../user/user.service";
import { authGoogleSigninSchema } from "./auth.schema";
import { AuthService } from "./auth.service";
import { setCookie, getCookie } from "hono/cookie";
import {
  generateAccessToken,
  generateRefreshToken,
  validateToken,
} from "../../utils/jwt";

export const authRoute = new Hono();
const authService = new AuthService();
const userService = new UserService();

authRoute
  .post(
    "/signin/google",
    zValidator("json", authGoogleSigninSchema, onErrorMsg),
    async (c) => {
      try {
        const validated = c.req.valid("json");
        const data = await authService.verifyGoogleToken(validated.token);
        const user = await userService.findByEmail(data.email);

        let usr;
        if (user[0]?.email) {
          usr = user[0];
        } else {
          usr = await userService.create(data);
        }

        const accessToken = generateAccessToken({
          userId: usr.id,
          username: usr.email,
        });

        const refreshToken = generateRefreshToken({
          userId: usr.id,
          username: usr.email,
        });

        setCookie(c, "refreshToken", refreshToken, {
          httpOnly: true,
          secure: true,
        });

        return c.json({
          message: user[0]?.email
            ? "Signed in successfully"
            : "User created successfully",
          accessToken: accessToken,
          refreshToken: refreshToken,
        });
      } catch (error) {
        console.error(error);
        throw new HTTPException(400, { message: "Failed to validate token" });
      }
    }
  )

  .post("/refresh-token", async (c) => {
    const refreshTokenFromCookie = getCookie(c, "refreshToken");
    const body = await c.req.json();
    let refreshToken = body.refreshToken || refreshTokenFromCookie;

    if (!refreshToken) {
      throw new HTTPException(400, { message: "No refresh token found" });
    }
    try {
      const decoded = validateToken(refreshToken);
      const accessToken = generateAccessToken({
        userId: decoded.userId,
        username: decoded.username,
      });
      const newRefreshToken = generateRefreshToken({
        userId: decoded.userId,
        username: decoded.username,
      });

      setCookie(c, "refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: true,
      });
      return c.json({
        message: "Token refreshed successfully",
        accessToken: accessToken,
        refreshToken: newRefreshToken,
      });
    } catch (error) {
      console.error(error);
      throw new HTTPException(400, { message: "Failed to refresh token" });
    }
  });
