import { Resend } from "resend";

export async function sendMail({
  to,
  subject,
  body,
}: {
  to: string;
  subject: string;
  body: string;
}) {
  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    await resend.emails.send({
      from: `Toolshop System <${process.env.EMAIL_FROM}>` as string,
      to,
      subject,
      html: body,
    });
  } catch (error: any) {
    console.log(error.message);
  }
}
