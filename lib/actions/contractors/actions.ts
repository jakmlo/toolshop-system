"use server";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  ContractorInput,
  ContractorInputSchema,
} from "@/lib/validations/contractor.schema";

import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { ZodError } from "zod";

export async function addContractor(data: ContractorInput) {
  try {
    ContractorInputSchema.parse(data);

    const session = await getServerSession(authOptions);

    const user = await prisma.user.findUnique({
      where: {
        id: session?.user.id,
      },
      include: { organization: true },
    });

    const contractor = await prisma.contractor.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        taxIdNumber: data.taxIdNumber,
        address: data.address,
        phoneNumber: data.phoneNumber,
        organization: {
          connect: {
            organizationId: user?.organization?.organizationId,
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

export const editContractor = async (data: ContractorInput, id: string) => {
  try {
    const contractorInput = ContractorInputSchema.parse(data);

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
          0
        )} already exists`,
      };
    }
  }
};
