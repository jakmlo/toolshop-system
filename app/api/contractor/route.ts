import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const contractors = await prisma.customer.findMany();

    return new NextResponse(
      JSON.stringify({
        status: "success",
        data: { contractors: { ...contractors } },
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch {}
}
