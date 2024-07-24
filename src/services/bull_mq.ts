import { Queue } from "bullmq";
import { redisClient } from "./redis";

export abstract class BaseQueue<T> {
  protected queue: Queue;

  constructor(queueName: string) {
    this.queue = new Queue(queueName, { connection: redisClient });
  }

  public async addJob(jobName: string, data: T): Promise<void> {
    await this.queue.add(jobName, data);
  }
}
