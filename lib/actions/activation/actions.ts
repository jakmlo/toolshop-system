"use server";

import { prisma } from "@/lib/prisma";

type ActivateUserFunction = (
  token: string,
) => Promise<"userNotExist" | "tokenExpired" | "alreadyActivated" | "success">;

export const activateUser: ActivateUserFunction = async (token) => {
  const existingToken = await prisma.verificationToken.findUnique({
    where: {
      token: token,
      expires: {},
    },
  });

  if (!existingToken) return "userNotExist";

  if (existingToken.expires < new Date()) return "tokenExpired";

  const user = await prisma.user.findUnique({
    where: { email: existingToken.email },
  });
  if (!user) {
    return "userNotExist";
  }
  if (user.verified) {
    return "alreadyActivated";
  }

  await prisma.user.update({
    where: {
      email: existingToken.email,
    },
    data: {
      verified: true,
    },
  });

  return "success";
};
