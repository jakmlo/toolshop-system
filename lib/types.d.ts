import { User } from "@prisma/client";

declare module "next-auth" {
  interface Session {
    user: {
      name: string;
      email: string;
      sub: string;
      id: string;
      role: string;
      photo: string;
      accepted: boolean;
      verified: boolean;
      createdAt: Date;
      updatedAt: Date;
      organizationId: string | null;
      iat: number;
      exp: number;
      jti: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user: {
      name: string;
      email: string;
      sub: string;
      id: string;
      role: string;
      photo: string;
      accepted: boolean;
      verified: boolean;
      createdAt: Date;
      updatedAt: Date;
      organizationId: string | null;
      iat: number;
      exp: number;
      jti: string;
    };
  }
}
