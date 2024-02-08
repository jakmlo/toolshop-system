"use client";

import { MagnifyingGlassIcon, BellIcon } from "@radix-ui/react-icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut } from "next-auth/react";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "../ui/use-toast";

type NavbarProps = {
  user: { name: string; role: string | null } | null | undefined;
};
export default function Navbar({ user }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === "/workspaces" || pathname === "/workspaces/profile")
    return (
      <header className="flex items-center justify-between bg-white p-6 shadow-md dark:bg-gray-800">
        <Link
          className="text-2xl font-bold text-gray-800 dark:text-gray-200"
          href="/workspaces"
        >
          Toolshop System
        </Link>
        <div className="flex items-center space-x-4">
          <div className="flex w-full items-center gap-4 pr-16 md:ml-auto md:gap-2 lg:gap-4">
            <h2>{user?.name}</h2>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="h-12 w-12 cursor-pointer">
                  <AvatarImage
                    alt="Avatar"
                    className="rounded-full border"
                    height="32"
                    src="/placeholder-user.jpg"
                    width="32"
                  />
                  <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                  <span className="sr-only">
                    Otwórz menu rozwijane użytkownika
                  </span>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <Link href={"/workspaces/profile"}>
                  <DropdownMenuItem>Profil</DropdownMenuItem>
                </Link>
                <DropdownMenuItem>Ustawienia</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <button
                    className="w-full text-left"
                    onClick={async () => {
                      const data = await signOut({
                        redirect: false,
                        callbackUrl: "/",
                      });
                      router.push(data.url);
                      router.refresh();
                      toast({
                        title: "Wylogowano pomyślnie",
                        description: "Nastąpiło przekierowanie",
                        variant: "default",
                      });
                    }}
                  >
                    Wyloguj się
                  </button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
    );

  return (
    <nav className="mx-6 my-4 flex-initial rounded-md bg-gray-700 p-4">
      <div className="container mx-auto flex items-center justify-between">
        <div className="text-lg font-bold text-white">
          {pathname === "/dashboard"
            ? "Pulpit"
            : pathname.charAt(1).toUpperCase() + pathname.slice(2)}
        </div>
        <ul className="flex space-x-4">
          <li>
            <div className="flex items-center justify-center rounded-md bg-gray-600 p-2">
              <MagnifyingGlassIcon className="text-white" />
              <input
                type="search"
                placeholder="Search..."
                className="w-full bg-transparent px-2 text-base text-white focus:outline-none"
              />
            </div>
          </li>
          <li>
            <a>
              <BellIcon className="text-white" />
            </a>
          </li>
          <li>
            <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="h-9 w-9 cursor-pointer">
                    <AvatarImage
                      alt="Avatar"
                      className="rounded-full border"
                      height="32"
                      src="/placeholder-user.jpg"
                      width="32"
                    />
                    <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                    <span className="sr-only">Toggle user menu</span>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <Link href={"/profile"}>
                    <DropdownMenuItem>Profile</DropdownMenuItem>
                  </Link>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  {user?.role === "admin" && (
                    <Link href={"/seats"}>
                      <DropdownMenuItem>
                        Zarządzaj użytkownikami
                      </DropdownMenuItem>
                    </Link>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <button
                      className="w-full text-left"
                      onClick={async () => {
                        const data = await signOut({
                          redirect: false,
                          callbackUrl: "/",
                        });
                        router.push(data.url);
                        router.refresh();
                        toast({
                          title: "Wylogowano pomyślnie",
                          description: "Nastąpiło przekierowanie",
                          variant: "default",
                        });
                      }}
                    >
                      Sign out
                    </button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </li>
        </ul>
      </div>
    </nav>
  );
}
