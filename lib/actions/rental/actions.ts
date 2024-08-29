"use server";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  RentalInput,
  RentalInputSchema,
} from "@/lib/validations/rental.schema";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { ZodError } from "zod";

export const createRental = async (rentalList: RentalInput[]) => {
  try {
    RentalInputSchema.array().parse(rentalList);

    const session = await getServerSession(authOptions);

    const toolIds = rentalList.map((rentalItem) => rentalItem.tool);

    const counts: Record<string, number> = {};
    toolIds.forEach((number) => {
      counts[number] = (counts[number] || 0) + 1;
    });

    const distinctTools = await prisma.tool.findMany({
      where: {
        toolId: {
          in: toolIds,
        },
      },
      distinct: ["catalogNumber"],
    });

    const toolsWithTheSameCatalogNumber = await prisma.tool.findMany({
      where: {
        OR: distinctTools.flatMap((tool) =>
          Array.from({ length: counts[tool.catalogNumber] || 0 }, () => ({
            catalogNumber: tool.catalogNumber,
            toolId: { not: tool.toolId },
          })),
        ),
      },
    });

    const selectedTools = [...distinctTools, ...toolsWithTheSameCatalogNumber];

    const selectedToolIds = selectedTools.map((tool) => tool.toolId);

    const areAllToolsAvailable = selectedTools.every(
      (tool) => tool?.availability,
    );

    if (!areAllToolsAvailable) {
      return { status: 400, message: "Not enough tools" };
    }

    const user = await prisma.user.findUnique({
      where: {
        id: session?.user.id,
      },
    });

    await prisma.rental.create({
      data: {
        contractor: {
          connect: { contractorId: rentalList[0].contractor },
        },
        rentalDate: new Date(),
        returnDate: rentalList[0].date,
        status: "pending",
        tools: {
          connect: selectedTools.map((tool) => ({ toolId: tool?.toolId })),
        },
        organization: {
          connect: {
            organizationId: user?.organizationId as string,
          },
        },
      },
    });

    await prisma.tool.updateMany({
      where: {
        toolId: {
          in: selectedToolIds,
        },
        organizationId: user?.organizationId,
      },
      data: {
        availability: false,
      },
    });

    revalidatePath("/rental");
    return {
      status: 201,
      message: "Rental successfully created",
    };
  } catch (error: any) {
    if (error instanceof ZodError) {
      return { status: 400, message: "Failed validation" };
    }
    if (error.code === "P2002") {
      return {
        status: 409,
        message: `Rental with that ${error.meta.target.at(0)} already exists`,
      };
    }
    if (!!error) {
      return { status: 500, message: "Error occured" };
    }
  }
};

export const deleteRental = async (id: string) => {
  const session = await getServerSession(authOptions);
  await prisma.rental.delete({
    where: {
      rentalId: id,
      organizationId: session?.user.organizationId,
    },
  });
  revalidatePath("/");
};

export const checkToolStore = async (catalogNumber: string) => {
  const session = await getServerSession(authOptions);

  const user = await prisma.user.findUnique({
    where: {
      id: session?.user.id,
    },
  });

  const count = await prisma.tool.count({
    where: {
      organizationId: user?.organizationId,
      catalogNumber: catalogNumber,
      availability: true,
    },
  });
  return count;
};
