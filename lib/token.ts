import { randomBytes, randomInt } from "crypto";
import { prisma } from "./prisma";
import { getTwoFactorTokenByEmail } from "./data/getTwoFactorTokenByToken";

export const generateTwoFactorToken = async (email: string) => {
  const token = randomInt(100000, 1000000).toString();
  const expires = new Date(new Date().getTime() + 300 * 1000);

  const existingToken = await getTwoFactorTokenByEmail(email);

  if (existingToken) {
    await prisma.twoFactorToken.delete({
      where: { id: existingToken.id },
    });
  }
  const twoFactorToken = await prisma.twoFactorToken.create({
    data: {
      email,
      token,
      expires,
    },
  });
  return twoFactorToken;
};

export const generateVerificationToken = async (email: string) => {
  const token = randomBytes(64).toString("base64url");
  const expires = new Date(new Date().getTime() + 300 * 1000);

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
  const token = randomBytes(64).toString("base64url");
  const expires = new Date(new Date().getTime() + 300 * 1000);

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
