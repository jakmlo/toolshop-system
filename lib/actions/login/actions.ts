"use server";

import { prisma } from "@/lib/prisma";
import { ZodError, z } from "zod";

const checkUserSchema = z.string().email();

export const checkUserVerified = async (email: string) => {
  try {
    checkUserSchema.parse(email);
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      return {
        status: 404,
        message: "User not found",
      };
    }

    return user.verified;
  } catch (error: any) {
    if (error instanceof ZodError) {
      return { status: 400, message: "Failed validation" };
    }
    if (!!error) {
      return { status: 500, message: "Error occured" };
    }
  }
};
