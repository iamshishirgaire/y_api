import { Redis } from "ioredis";
import env from "./envVariables";

const client = new Redis(env.REDIS_URL);
export const redisClient = client;
