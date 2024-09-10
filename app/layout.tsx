import "./globals.css";
import type { Metadata } from "next";
import Sidebar from "../components/misc/Sidebar";
import { NextAuthProvider } from "./providers";
import { Toaster } from "@/components/ui/toaster";
import Navbar from "@/components/misc/Navbar";
import { prisma } from "@/lib/prisma";
import { EdgeStoreProvider } from "@/lib/edgestore";
import { auth } from "@/auth";

export const metadata: Metadata = {
  title: "Toolshop system",
  description: "Toolshop",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
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
      <body className="flex bg-slate-100">
        <NextAuthProvider>
          <EdgeStoreProvider>
            {!!session && <Sidebar />}
            <div className="h-screen w-full flex-col">
              {!!session && <Navbar user={user} session={session} />}
              {children}
            </div>
            <Toaster />
          </EdgeStoreProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
