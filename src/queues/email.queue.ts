import { BaseQueue } from "@/services/bull_mq";

interface EmailJobData {
  to: string;
  subject: string;
  body: string;
}

class EmailQueue extends BaseQueue<EmailJobData> {
  constructor() {
    super("email");
  }
}

export const emailQueue = new EmailQueue();
