"use server";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  ReturnInput,
  ReturnInputSchema,
} from "@/lib/validations/return.schema";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

export const returnAction = async (data: ReturnInput) => {
  try {
    const result = ReturnInputSchema.parse(data);

    const rental = await prisma.rental.findUnique({
      where: { rentalId: result.rental },
    });

    if (!rental) {
      return {
        status: 400,
        message: `Rental of id ${result.rental} does not exist`,
      };
    }

    const session = await getServerSession(authOptions);

    const user = await prisma.user.findUnique({
      where: {
        id: session?.user.id,
      },
    });

    if (rental.status === "pending") {
      await prisma.rental.update({
        where: {
          rentalId: rental.rentalId,
          organizationId: user?.organizationId,
        },
        data: { status: "returned" },
      });

      await prisma.tool.updateMany({
        where: {
          rentals: {
            some: {
              rentalId: rental.rentalId,
              organizationId: user?.organizationId,
            },
          },
        },
        data: { availability: true },
      });
    } else {
      return {
        status: 400,
        message: `The rental of id ${result.rental} is returned`,
      };
    }
    revalidatePath("/return");
    return {
      status: 200,
      message: `Tool of id ${rental.rentalId} successfully returned`,
    };
  } catch (error: any) {
    return {
      status: 500,
      message: error.message,
    };
  }
};
