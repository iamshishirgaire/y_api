import { emailQueue } from "../email.queue";

export const addEmailJob = async (
  to: string,
  subject: string,
  body: string
) => {
  await emailQueue.addJob("sendEmail", { to, subject, body });
};
