"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import {
  ContractorInput,
  ContractorInputSchema,
} from "@/lib/validations/contractor.schema";
import { revalidatePath } from "next/cache";
import { ZodError } from "zod";

export async function addContractor(data: ContractorInput) {
  try {
    ContractorInputSchema.parse(data);

    const session = await auth();

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

    const contractor = await prisma.contractor.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        taxIdNumber: data.taxIdNumber,
        address: data.address,
        phoneNumber: data.phoneNumber,
        organization: {
          connect: {
            organizationId: user?.organizationId as string,
          },
        },
      },
    });

    revalidatePath("/contractors/[id]", "layout");

    return {
      status: 200,
      message: "Contractor created",
    };
  } catch (error: any) {
    if (error.code === "P2002") {
      return {
        status: 409,
        message: `Contractor with that ${error.meta.target.at(
          0,
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

export const editContractor = async (data: ContractorInput, id: string) => {
  try {
    const contractorInput = ContractorInputSchema.parse(data);

    const session = await auth();

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

    const contractor = await prisma.contractor.findUnique({
      where: { contractorId: id },
    });

    if (!contractor) {
      return {
        status: 404,
        message: "Contractor not found",
      };
    }
    await prisma.contractor.update({
      where: {
        contractorId: id,
      },
      data: {
        firstName: contractorInput.firstName,
        lastName: contractorInput.lastName,
        taxIdNumber: contractorInput.taxIdNumber,
        address: contractorInput.address,
        phoneNumber: contractorInput.phoneNumber,
      },
    });
    revalidatePath("/contractors");
    return {
      status: 204,
      message: "Contractor altered",
    };
  } catch (error: any) {
    if (error instanceof ZodError) {
      return { status: 400, message: "Failed validation" };
    }

    if (error.code === "P2002") {
      return {
        status: 409,
        message: `Contractor with that ${error.meta.target.at(
          0,
        )} already exists`,
      };
    }
  }
};
