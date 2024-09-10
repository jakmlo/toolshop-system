"use server";

import { getUserByEmail } from "@/lib/data/getUserByEmail";
import { sendMail } from "@/lib/mail";
import { renderAsync } from "@react-email/render";
import { ZodError } from "zod";
import TwoFactorTemplate from "@/lib/emailTemplates/twoFactor";

export async function twoFactorAuthentication(email: string, token: string) {
  try {
    const user = await getUserByEmail(email);

    if (!user) {
      return {
        status: 404,
        message: "User not found",
      };
    }

    const templateBody = await renderAsync(
      TwoFactorTemplate({ name: user.name, token }),
    );
    await sendMail({
      to: email,
      subject: "Uwierzytelnianie dwuskładnikowe",
      body: templateBody,
    });
  } catch (error: any) {
    console.log(error);
    if (error instanceof ZodError) {
      return { status: 400, message: "Failed validation" };
    }
    if (!!error) {
      return { status: 500, message: "Error occured" };
    }
  }
}
