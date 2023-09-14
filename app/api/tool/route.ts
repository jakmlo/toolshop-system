import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const tools = await prisma.tool.findMany();

    return new NextResponse(
      JSON.stringify({
        status: "success",
        data: { tools: { ...tools } },
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch {}
}
