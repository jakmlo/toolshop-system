"use server";

import { signIn, signOut } from "@/auth";
import { getUserByEmail } from "@/lib/data/getUserByEmail";
import { prisma } from "@/lib/prisma";
import { generateTwoFactorToken } from "@/lib/token";
import { LoginUserInput, LoginUserSchema } from "@/lib/validations/user.schema";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect";
import { z, ZodError } from "zod";
import { twoFactorAuthentication } from "../two-factor-authentication/actions";
import { getTwoFactorTokenByEmail } from "@/lib/data/getTwoFactorTokenByToken";
import { getTwoFactorConfirmationByUserId } from "@/lib/data/twoFactorConfirmation";

const checkUserSchema = z.string().email();

export const checkUserVerified = async (email: string) => {
  try {
    checkUserSchema.parse(email);
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    return !!user?.emailVerified;
  } catch (error: any) {
    if (error instanceof ZodError) {
      console.error("Validation Error:", error);
      return false;
    } else {
      console.error("Unexpected Error:", error);
      return false;
    }
  }
};

export const loginUser = async (data: LoginUserInput, callbackUrl: string) => {
  const validatedFields = LoginUserSchema.safeParse(data);

  if (!validatedFields.success) {
    return { error: "Niepoprawne pola" };
  }

  const { email, password, code } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser) return { error: "Niepoprawne dane logowania" };

  if (existingUser?.isTwoFactorEnabled && existingUser.email) {
    if (code) {
      const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);

      if (!twoFactorToken) {
        return { error: "Brak kodu" };
      }

      if (twoFactorToken.token !== code) {
        return { error: "Niepoprawny kod!" };
      }

      const hasExpired = new Date(twoFactorToken.expires) < new Date();

      if (hasExpired) {
        return { error: "Kod wygasł!" };
      }

      await prisma.twoFactorToken.delete({
        where: {
          id: twoFactorToken.id,
        },
      });

      const existingConfirmation = await getTwoFactorConfirmationByUserId(
        existingUser.id,
      );

      if (existingConfirmation) {
        await prisma.twoFactorConfirmation.delete({
          where: {
            id: existingConfirmation.id,
          },
        });
      }

      await prisma.twoFactorConfirmation.create({
        data: {
          userId: existingUser.id,
        },
      });
    } else {
      const twoFactorToken = await generateTwoFactorToken(existingUser.email);
      await twoFactorAuthentication(twoFactorToken.email, twoFactorToken.token);
      return { twoFactor: true };
    }
  }

  try {
    await signIn("credentials", {
      email: email.toLowerCase(),
      password,
      redirectTo: callbackUrl,
    });
    return {};
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Nieprawidłowe dane logowania." };
        default:
          return { error: "Coś poszło nie tak" };
      }
    }
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    await signOut({ redirect: false });
  } catch (err) {
    if (isRedirectError(err)) {
      throw err;
    }
  } finally {
    redirect("/");
  }
};
