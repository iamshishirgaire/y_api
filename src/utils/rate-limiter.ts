import { RateLimiterRedis } from "rate-limiter-flexible";
import { redisClient } from "../services/redis";

export const opts = {
  points: 2, // Number of points
  duration: 1, // Per second(s)
};
export const rateLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: "rateLimiter",
  ...opts,
});
