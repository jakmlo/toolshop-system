"use server";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ToolInput, ToolInputSchema } from "@/lib/validations/tool.schema";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { ZodError } from "zod";

export async function addEquipment(data: ToolInput) {
  try {
    ToolInputSchema.parse(data);

    const session = await getServerSession(authOptions);

    const user = await prisma.user.findUnique({
      where: {
        id: session?.user.id,
      },
    });

    if (
      user?.organizationId !== session?.user.organizationId ||
      !user?.accepted
    )
      return { status: 401, message: "Not authorized" };

    if (user?.role !== "admin")
      return { status: 401, message: "Not authorized" };

    const tool = await prisma.tool.create({
      data: {
        name: data.name,
        catalogNumber: data.catalogNumber,
        description: data?.description,
        categoryId: data.categoryId,
        availability: true,
        organization: {
          connect: {
            organizationId: user?.organizationId as string,
          },
        },
      },
    });

    revalidatePath("/equipment");

    return {
      status: 200,
      message: "Equipment added",
    };
  } catch (error: any) {
    if (error.code === "P2002") {
      return {
        status: 409,
        message: `Equipment with that ${error.meta.target.at(
          0
        )} already exists`,
      };
    }
    if (error instanceof ZodError) {
      return { status: 400, message: "Failed validation" };
    }
    if (!!error) {
      return { status: 500, message: error.message };
    }
  }
}

export const editEquipment = async (data: ToolInput, id: string) => {
  try {
    const toolInput = ToolInputSchema.parse(data);

    const session = await getServerSession(authOptions);

    const user = await prisma.user.findUnique({
      where: {
        id: session?.user.id,
      },
    });

    if (
      user?.organizationId !== session?.user.organizationId ||
      !user?.accepted
    )
      return { status: 401, message: "Not authorized" };

    if (user?.role !== "admin")
      return { status: 401, message: "Not authorized" };

    const tool = await prisma.tool.findUnique({
      where: { toolId: id, organizationId: user?.organizationId },
    });

    if (!tool) {
      return {
        status: 404,
        message: "Equipment not found",
      };
    }
    await prisma.tool.update({
      where: {
        toolId: id,
        organizationId: user?.organizationId,
      },
      data: {
        name: toolInput.name,
        catalogNumber: toolInput.catalogNumber,
        description: toolInput.description,
        categoryId: toolInput.categoryId,
      },
    });
    revalidatePath("/equipment");
    return {
      status: 204,
      message: "Equipment altered",
    };
  } catch (error: any) {
    if (error instanceof ZodError) {
      return { status: 400, message: "Failed validation" };
    }

    if (error.code === "P2002") {
      return {
        status: 409,
        message: `Equipment with that ${error.meta.target.at(
          0
        )} already exists`,
      };
    }
  }
};
