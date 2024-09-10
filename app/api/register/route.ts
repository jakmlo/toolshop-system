import { getErrorResponse } from "@/lib/helpers";
import { sendMail } from "@/lib/mail";
import ActivationTemplate from "@/lib/emailTemplates/activation";
import { prisma } from "@/lib/prisma";
import { renderAsync } from "@react-email/render";
import {
  RegisterUserInput,
  RegisterUserSchema,
} from "@/lib/validations/user.schema";
import { hash } from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { generateVerificationToken } from "@/lib/token";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as RegisterUserInput;
    const data = RegisterUserSchema.parse(body);

    const hashedPassword = await hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email.toLowerCase(),
        password: hashedPassword,
      },
    });

    if (user) {
      try {
        const verificationToken = await generateVerificationToken(user.email);
        const activationUrl = `${process.env.NEXTAUTH_URL}/auth/activation/${verificationToken}`;
        const templateBody = await renderAsync(
          ActivationTemplate({ name: user.name, url: activationUrl }),
        );
        await sendMail({
          to: user.email,
          subject: "Aktywacja konta",
          body: templateBody,
        });
      } catch (error: any) {
        return getErrorResponse(500, error.message);
      }
    }

    return new NextResponse(
      JSON.stringify({
        status: "success",
        data: { user: { ...user, password: undefined } },
      }),
      {
        status: 201,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error: any) {
    if (error instanceof ZodError) {
      return getErrorResponse(400, "Failed validation", error);
    }

    if (error.code === "P2002") {
      return getErrorResponse(
        409,
        `User with that ${error.meta.target.at(0)} already exists`,
      );
    }

    return getErrorResponse(500, error.message);
  }
}
