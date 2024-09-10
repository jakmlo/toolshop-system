"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import {
  CreateOrganizationInput,
  CreateOrganizationSchema,
  JoinOrganizationInput,
  JoinOrganizationSchema,
} from "@/lib/validations/organization.schema";
import { revalidatePath } from "next/cache";
import { ZodError } from "zod";

export async function createOrganization(data: CreateOrganizationInput) {
  try {
    CreateOrganizationSchema.parse(data);

    const session = await auth();

    const user = await prisma.user.findUnique({
      where: {
        id: session?.user.id,
      },
    });

    if (!user) {
      return {
        status: 404,
        message: "User not found",
      };
    }

    const organization = await prisma.organization.create({
      data: {
        name: data.name,
        adminId: user.id,
        users: {
          connect: { id: user.id },
        },
      },
    });

    await prisma.user.update({
      where: {
        id: session?.user.id,
      },
      data: {
        role: "admin",
        accepted: true,
      },
    });

    revalidatePath("/workspaces");

    return {
      status: 200,
      message: "Organization created",
      organizationId: organization.organizationId,
    };
  } catch (error: any) {
    if (error instanceof ZodError) {
      return { status: 400, message: "Failed validation" };
    }
    if (!!error) {
      return { status: 500, message: error.message };
    }
  }
}

export async function joinOrganization(data: JoinOrganizationInput) {
  try {
    const organizationInput = JoinOrganizationSchema.parse(data);

    const session = await auth();

    const user = await prisma.user.findUnique({
      where: {
        id: session?.user.id,
      },
    });

    if (!user) {
      return {
        status: 404,
        message: "User not found",
      };
    }

    const organization = await prisma.organization.findUnique({
      where: {
        name: organizationInput.name,
      },
    });

    if (!organization)
      return {
        status: 404,
        message: "Nie znaleziono organizacji",
      };

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        organizationId: organization.organizationId,
      },
    });

    revalidatePath("/workspaces");

    return {
      status: 200,
      message: "Sent request",
      organizationId: organization.organizationId,
    };
  } catch (error: any) {
    if (error instanceof ZodError) {
      return { status: 400, message: "Failed validation" };
    }
    if (!!error) {
      return { status: 500, message: error.message };
    }
  }
}

export async function addUserToOrganization(id: string) {
  try {
    const session = await auth();

    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
    });

    if (!user) {
      return {
        status: 404,
        message: "User not found",
      };
    }

    const organization = await prisma.organization.findUnique({
      where: {
        adminId: session?.user.id,
      },
    });

    if (!organization) return { status: 401, message: "Unauthorized" };

    await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        accepted: true,
      },
    });

    revalidatePath("/seats");

    return {
      status: 200,
      message: "User added",
    };
  } catch (error: any) {
    if (error instanceof ZodError) {
      return { status: 400, message: "Failed validation" };
    }
    if (!!error) {
      return { status: 500, message: error.message };
    }
  }
}

export async function removeUserFromOrganization(id: string) {
  try {
    const session = await auth();

    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
    });

    if (!user) {
      return {
        status: 404,
        message: "User not found",
      };
    }

    const organization = await prisma.organization.findUnique({
      where: {
        adminId: session?.user.id,
      },
    });

    if (!organization) return { status: 401, message: "Unauthorized" };

    await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        accepted: false,
        organizationId: null,
      },
    });

    revalidatePath("/seats");
    revalidatePath("/workspaces");

    return {
      status: 200,
      message: "User removed",
    };
  } catch (error: any) {
    if (error instanceof ZodError) {
      return { status: 400, message: "Failed validation" };
    }
    if (!!error) {
      return { status: 500, message: error.message };
    }
  }
}
