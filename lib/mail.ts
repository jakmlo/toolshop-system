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
      from: process.env.EMAIL_FROM as string,
      to,
      subject,
      html: body,
    });
  } catch (error: any) {
    console.log(error.message);
  }
}

// export async function sendMail({
//   to,
//   subject,
//   body,
// }: {
//   to: string;
//   subject: string;
//   body: string;
// }) {
//   const { SMTP_EMAIL, SMTP_GMAIL_PASS } = process.env;

//   const transport = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//       user: SMTP_EMAIL,
//       pass: SMTP_GMAIL_PASS,
//     },
//   });

//   try {
//     await transport.sendMail({
//       from: {
//         name: "Toolshop System",
//         address: SMTP_EMAIL as string,
//       },
//       to,
//       subject,
//       html: body,
//     });
//   } catch (error: any) {
//     console.log(error.message);
//   }
// }
