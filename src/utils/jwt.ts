import jwt, { type JwtPayload } from "jsonwebtoken";
import env from "./env";

const secretKey = env.JWT_SECRET;

export interface CustomJwtPayload extends JwtPayload {
  userId: string;
  userName: string;
}

export const generateAccessToken = (payload: CustomJwtPayload) => {
  const token = jwt.sign(payload, secretKey, {
    expiresIn: env.JWT_EXPIRES_IN,
  });
  return token;
};

export const generateRefreshToken = (payload: CustomJwtPayload) => {
  const token = jwt.sign(payload, secretKey, {
    expiresIn: env.JWT_COOKIE_EXPIRES_IN,
  });
  return token;
};

export const validateToken = (token: string) => {
  const decoded = jwt.verify(token, secretKey) as CustomJwtPayload;
  return decoded;
};
