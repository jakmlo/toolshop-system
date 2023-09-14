import "./globals.css";
import type { Metadata } from "next";
import Sidebar from "../components/misc/Sidebar";
import { NextAuthProvider } from "./providers";
import { Toaster } from "@/components/ui/toaster";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

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
  return (
    <html lang="en">
      <body className="flex bg-slate-100">
        <NextAuthProvider>
          {!!session && <Sidebar />}
          {children}
          <Toaster />
        </NextAuthProvider>
      </body>
    </html>
  );
}
