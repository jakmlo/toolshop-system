"use server";

import { signJWT, verifyJWT } from "@/lib/jwt";
import { compileResetPasswordTemplate, sendMail } from "@/lib/mail";
import { prisma } from "@/lib/prisma";
import {
  ForgotPasswordInput,
  ForgotPasswordSchema,
  ResetPasswordInput,
  ResetPasswordSchema,
} from "@/lib/validations/user.schema";
import { hash } from "bcrypt";

import { ZodError } from "zod";

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
        status: 404,
        message: "User not found",
      };
    }

    const jwtUserId = signJWT({
      id: user.id,
    });
    const resetPasswordUrl = `${process.env.NEXTAUTH_URL}/auth/password/reset/${jwtUserId}`;

    const body = compileResetPasswordTemplate(user.name, resetPasswordUrl);
    await sendMail({
      to: user.email,
      subject: "Zmiana hasła",
      body: body,
    });
  } catch (error: any) {
    if (error instanceof ZodError) {
      return { status: 400, message: "Failed validation" };
    }
    if (!!error) {
      return { status: 500, message: "Error occured" };
    }
  }
}

export const resetPassword = async (
  jwtUserId: string,
  data: ResetPasswordInput
) => {
  try {
    ResetPasswordSchema.parse(data);
    const payload = verifyJWT(jwtUserId);

    if (!payload) return { status: 404, message: "User not found" };

    const userId = payload.id;
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) return { status: 404, message: "User not found" };

    const hashedPassword = await hash(data.password, 10);

    const result = await prisma.user.update({
      where: {
        id: userId,
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
