import { redisClient } from "../utils/redis";
import type { Redis } from "ioredis";

class PubSubService {
  private subscriber: Redis;
  constructor() {
    this.subscriber = redisClient.duplicate();
  }
  async subscribe(channel: string, handler: (message: string) => void) {
    await this.subscriber.subscribe(channel);
    this.subscriber.on("message", (channel, message) => {
      handler(message);
    });
  }

  async publish(channel: string, message: string) {
    await redisClient.publish(channel, message);
  }
}

export default new PubSubService();
