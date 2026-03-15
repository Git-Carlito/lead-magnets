import { Resend } from "resend";
import type { CreateEmailOptions } from "resend";

export function sendEmail(payload: CreateEmailOptions) {
  const apiKey = import.meta.env.RESEND_API_KEY;
  if (!apiKey) return;

  const resend = new Resend(apiKey);

  resend.emails.send(payload).catch((err) => {
    console.error("Resend email error:", err);
  });
}
