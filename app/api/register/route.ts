import { getErrorResponse } from "@/lib/helpers";
import { signJWT } from "@/lib/jwt";
import { sendMail } from "@/lib/mail";
import ActivationTemplate from "@/lib/emailTemplates/activation";
import { prisma } from "@/lib/prisma";
import { render } from "@react-email/render";
import {
  RegisterUserInput,
  RegisterUserSchema,
} from "@/lib/validations/user.schema";
import { hash } from "bcrypt";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

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
        photo: data.photo,
      },
    });

    if (user) {
      const jwtUserId = signJWT({
        id: user.id,
      });
      const activationUrl = `${process.env.NEXTAUTH_URL}/auth/activation/${jwtUserId}`;

      const templateBody = render(
        ActivationTemplate({ name: user.name, url: activationUrl }),
      );

      await sendMail({
        to: user.email,
        subject: "Aktywacja konta",
        body: templateBody,
      });
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
