import { randomUUID } from "crypto";
import { prisma } from "./prisma";

export const generateVerificationToken = async (email: string) => {
  const token = randomUUID();
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  const existingToken = await prisma.verificationToken.findFirst({
    where: { email },
  });

  try {
    if (existingToken) {
      await prisma.verificationToken.delete({
        where: {
          id: existingToken.id,
        },
      });
    }

    const verificationToken = await prisma.verificationToken.create({
      data: {
        email,
        token,
        expires,
      },
    });
    return verificationToken.token;
  } catch (error: any) {
    console.log(error.message);
  }
};

export const generatePasswordResetToken = async (email: string) => {
  const token = randomUUID();
  const expires = new Date(new Date().getTime() + 600 * 1000);

  const existingToken = await prisma.passwordResetToken.findFirst({
    where: { email },
  });

  try {
    if (existingToken) {
      await prisma.passwordResetToken.delete({
        where: {
          id: existingToken.id,
        },
      });
    }

    const passwordResetToken = await prisma.passwordResetToken.create({
      data: {
        email,
        token,
        expires,
      },
    });
    return passwordResetToken.token;
  } catch (error: any) {
    console.log(error.message);
  }
};
