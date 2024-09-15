"use server";

import { sendMail } from "@/lib/mail";
import { prisma } from "@/lib/prisma";
import {
  ForgotPasswordInput,
  ForgotPasswordSchema,
  ResetPasswordInput,
  ResetPasswordSchema,
} from "@/lib/validations/user.schema";
import { renderAsync } from "@react-email/render";
import { hash } from "bcryptjs";
import ResetPasswordTemplate from "@/lib/emailTemplates/resetPassword";
import { ZodError } from "zod";
import { generatePasswordResetToken } from "@/lib/token";

export async function forgotPassword(data: ForgotPasswordInput) {
  try {
    ForgotPasswordSchema.parse(data);

    const user = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (!user) {
      return {
        status: 400,
        message: "Error Occured",
      };
    }
    const passwordResetToken = await generatePasswordResetToken(user.email);

    const resetPasswordUrl = `${process.env.NEXTAUTH_URL}/auth/password/reset/${passwordResetToken}`;

    const templateBody = await renderAsync(
      ResetPasswordTemplate({ name: user.name, url: resetPasswordUrl }),
    );
    await sendMail({
      to: user.email,
      subject: "Zmiana hasła",
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

export const resetPassword = async (
  email: string,
  data: ResetPasswordInput,
) => {
  try {
    ResetPasswordSchema.parse(data);

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) return { status: 400, message: "Error occured" };

    const hashedPassword = await hash(data.password, 10);

    const result = await prisma.user.update({
      where: {
        email,
      },
      data: {
        password: hashedPassword,
      },
    });
    if (result) return { status: 200, message: "Password Updated" };
  } catch (error: any) {
    if (error instanceof ZodError) {
      return { status: 400, message: "Failed validation" };
    }
    if (!!error) {
      return { status: 500, message: "Error occured" };
    }
  }
};
