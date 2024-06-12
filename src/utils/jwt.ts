import jwt, { SignOptions, JwtPayload } from "jsonwebtoken";
import env from "./envVariables";

const secretKey = env.JWT_SECRET;

export interface CustomJwtPayload extends JwtPayload {
  userId: string;
  username: string;
}

export const generateAccessToken = (payload: CustomJwtPayload) => {
  try {
    const token = jwt.sign(payload, secretKey, {
      expiresIn: env.JWT_EXPIRES_IN,
    });
    return token;
  } catch (error) {
    throw error;
  }
};

export const generateRefreshToken = (payload: CustomJwtPayload) => {
  try {
    const token = jwt.sign(payload, secretKey, {
      expiresIn: env.JWT_COOKIE_EXPIRES_IN,
    });
    return token;
  } catch (error) {
    throw error;
  }
};

export const validateToken = (token: string) => {
  try {
    const decoded = jwt.verify(token, secretKey) as CustomJwtPayload;
    return decoded;
  } catch (error) {
    throw error;
  }
};

// Example usage:
// const accessToken = generateAccessToken({ userId: '123', username: 'john_doe' });
// const refreshToken = generateRefreshToken({ userId: '123', username: 'john_doe' });
// const decoded = validateToken(accessToken);