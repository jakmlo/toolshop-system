import { getErrorResponse } from "@/lib/helpers";
import { prisma } from "@/lib/prisma";
import { RentalInput, RentalSchema } from "@/lib/validations/rental.schema";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as RentalInput;
    const data = RentalSchema.parse(body);

    // Check if there are enough tools available
    const availableTools = await prisma.tool.findUnique({
      where: { ToolID: data.tool },
      select: { Availability: true },
    });

    if (!availableTools?.Availability) {
      return getErrorResponse(400, "Not enough tools to rent");
    }

    const rental = await prisma.rental.create({
      data: {
        Tool: {
          connect: { ToolID: data.tool },
        },
        Customer: {
          connect: { CustomerID: data.contractor },
        },
        RentalDate: new Date(),
        ReturnDate: data.date,
        Status: "pending",
      },
    });

    const updateTool = await prisma.tool.update({
      where: {
        ToolID: data.tool,
      },
      data: {
        Availability: false,
      },
    });

    return new NextResponse(
      JSON.stringify({
        status: "success",
        data: { rental: { ...rental } },
      }),
      {
        status: 201,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    if (error instanceof ZodError) {
      return getErrorResponse(400, "Failed validation", error);
    }

    if (error.code === "P2002") {
      return getErrorResponse(
        409,
        `Rental with that ${error.meta.target.at(0)} already exists`
      );
    }

    return getErrorResponse(500, error.message);
  }
}

export async function GET() {
  try {
    const rentals = await prisma.rental.findMany();

    return new NextResponse(
      JSON.stringify({
        status: "success",
        data: { rentals: { ...rentals } },
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch {}
}
