import "./globals.css";
import type { Metadata } from "next";
import Sidebar from "../components/misc/Sidebar";
import { NextAuthProvider } from "./providers";
import { Toaster } from "@/components/ui/toaster";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Navbar from "@/components/misc/Navbar";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Toolshop system",
  description: "Toolshop",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  let user;
  if (session) {
    user = await prisma.user.findUnique({
      where: { id: session?.user.id },
      select: {
        name: true,
        role: true,
      },
    });
  }

  return (
    <html lang="pl">
      <body className="flex bg-slate-100 ">
        <NextAuthProvider>
          {!!session && <Sidebar />}
          <div className="flex-col w-full h-screen">
            {!!session && <Navbar user={user} />}
            {children}
          </div>
          <Toaster />
        </NextAuthProvider>
      </body>
    </html>
  );
}
