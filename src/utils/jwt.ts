import jwt, { SignOptions, JwtPayload } from "jsonwebtoken";
import env from "./envVariables";

const secretKey = env.JWT_SECRET;

export interface CustomJwtPayload extends JwtPayload {
  userId: string;
  username: string;
}

export const generateAccessToken = (payload: CustomJwtPayload) => {
  try {
    const token = jwt.sign(payload, secretKey, { expiresIn: "15m" });
    return token;
  } catch (error) {
    throw new Error("Error generating access token");
  }
};

export const generateRefreshToken = (payload: CustomJwtPayload) => {
  try {
    const token = jwt.sign(payload, secretKey, { expiresIn: "30d" });
    return token;
  } catch (error) {
    throw new Error("Error generating refresh token");
  }
};

export const validateToken = (token: string) => {
  try {
    const decoded = jwt.verify(token, secretKey) as CustomJwtPayload;
    return decoded;
  } catch (error) {
    throw new Error("Error validating token");
  }
};

// Example usage:
// const accessToken = generateAccessToken({ userId: '123', username: 'john_doe' });
// const refreshToken = generateRefreshToken({ userId: '123', username: 'john_doe' });
// const decoded = validateToken(accessToken);
