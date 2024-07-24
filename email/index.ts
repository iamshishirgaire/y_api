import { Resend } from "resend";
import React from "react";
import TwitterWelcomeEmail from "./emails/welcome";
const resend = new Resend("re_123456789");

export const sendEmail = async (
  email: string,
  subject: string,
  username: string
) => {
  await resend.emails.send({
    from: "Acme <onboarding@resend.dev>",
    to: email,
    subject: subject,
    react: React.createElement(TwitterWelcomeEmail, {
      username: username,
    }),

    headers: {
      "X-Entity-Ref-ID": "123456789",
    },
    tags: [
      {
        name: "category",
        value: "welcome_email",
      },
    ],
  });
};
