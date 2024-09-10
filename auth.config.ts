import { compare } from "bcryptjs";
import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { LoginUserSchema } from "./lib/validations/user.schema";
import { getUserByEmail } from "./lib/data/getUserByEmail";

export default {
  providers: [
    Google,
    Credentials({
      name: "Credentials",
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        const validatedCredentials = LoginUserSchema.safeParse(credentials);

        if (validatedCredentials.success) {
          const { email, password } = validatedCredentials.data;
          const user = await getUserByEmail(email);
          if (!user || !user.password) {
            return null;
          }
          if (await compare(password, user.password)) {
            return user;
          }
        }
        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;
