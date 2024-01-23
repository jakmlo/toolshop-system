import nodemailer from "nodemailer";
import Handlebars from "handlebars";
import { activationTemplate } from "./emailTemplates/activation";
import { resetPasswordTemplate } from "./emailTemplates/resetPassword";

export async function sendMail({
  to,
  subject,
  body,
}: {
  to: string;
  subject: string;
  body: string;
}) {
  const { SMTP_EMAIL, SMTP_GMAIL_PASS } = process.env;

  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: SMTP_EMAIL,
      pass: SMTP_GMAIL_PASS,
    },
  });

  try {
    await transport.sendMail({
      from: {
        name: "Toolshop System",
        address: SMTP_EMAIL as string,
      },
      to,
      subject,
      html: body,
    });
  } catch (error: any) {
    return error.message;
  }
}

export function compileActivationTemplate(name: string, url: string) {
  const template = Handlebars.compile(activationTemplate);
  const htmlBody = template({
    name,
    url,
  });
  return htmlBody;
}

export function compileResetPasswordTemplate(name: string, url: string) {
  const template = Handlebars.compile(resetPasswordTemplate);
  const htmlBody = template({
    name,
    url,
  });
  return htmlBody;
}
