"use server";
import { EditUserInput, EditUserSchema } from "@/lib/validations/user.schema";
import { ZodError } from "zod";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const editUser = async (data: EditUserInput, id: string) => {
  try {
    const userInput = EditUserSchema.parse(data);

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
        photo: userInput.photo,
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
