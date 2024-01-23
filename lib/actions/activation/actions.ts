"use server";

import { verifyJWT } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";

type ActivateUserFunction = (
  jwtUserId: string
) => Promise<"userNotExist" | "alreadyActivated" | "success">;

export const activateUser: ActivateUserFunction = async (jwtUserId) => {
  const payload = verifyJWT(jwtUserId);
  if (!payload) return "userNotExist";

  const userId = payload?.id;
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });
  if (!user) {
    return "userNotExist";
  }
  if (user.verified) {
    return "alreadyActivated";
  }

  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      verified: true,
    },
  });

  return "success";
};
