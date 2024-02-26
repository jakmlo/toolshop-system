"use server";
import { EditUserInput, EditUserSchema } from "@/lib/validations/user.schema";
import { ZodError, z } from "zod";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const editUser = async (data: EditUserInput, userId: string) => {
  try {
    const userInput = EditUserSchema.parse(data);
    const id = z.string().parse(userId);

    const user = await prisma.user.findUnique({
      where: { id: id },
    });

    if (!user) {
      return {
        status: 400,
        message: "Bad request",
      };
    }
    await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        name: userInput.name,
        email: userInput.email.toLowerCase(),
        image: userInput.image ?? undefined,
      },
    });
    revalidatePath("/profile");
    return {
      status: 204,
      message: "User altered",
    };
  } catch (error: any) {
    if (error instanceof ZodError) {
      return { status: 400, message: "Failed validation" };
    }

    if (error.code === "P2002") {
      return {
        status: 409,
        message: `User with that ${error.meta.target.at(0)} already exists`,
      };
    }
  }
};

export const addUserImage = async (
  imageUrl: string,
  userId: string | undefined,
) => {
  try {
    const url = z.string().url().parse(imageUrl);
    const id = z.string().parse(userId);

    const user = await prisma.user.findUnique({
      where: { id: id },
    });

    if (!user) {
      return {
        status: 400,
        message: "Bad request",
      };
    }
    await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        image: url,
      },
    });
    revalidatePath("/profile");
    return {
      status: 201,
      message: "Image added",
    };
  } catch (error: any) {
    if (error instanceof ZodError) {
      return { status: 400, message: "Failed validation" };
    }

    if (error.code === "P2002") {
      return {
        status: 409,
        message: `User with that ${error.meta.target.at(0)} already exists`,
      };
    }
  }
};
