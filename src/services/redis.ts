import { Redis } from "ioredis";
import env from "../utils/env";

const client = new Redis(env.REDIS_URL);
export const redisClient = client;
