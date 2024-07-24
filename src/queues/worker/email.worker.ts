import { redisClient } from "@/services/redis";
import { Worker } from "bullmq";

const emailWorker = new Worker(
  "email",
  async (job) => {
    // Process the email job
    const { to, subject, body } = job.data;
    console.log(`Sending email to ${to} with subject ${subject}`);
    // Implement your email sending logic here
  },
  { connection: redisClient }
);

emailWorker.on("completed", (job) => {
  console.log(`Job ${job.id} has completed`);
});

emailWorker.on("failed", (job, err) => {
  console.log(`Job ${job} has failed with ${err.message}`);
});
