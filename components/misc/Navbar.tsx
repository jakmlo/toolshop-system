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

type NavbarProps = {
  name: string | undefined;
};

export default function Navbar({ name }: NavbarProps) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <nav className="bg-gray-700 p-4 flex-initial mx-6 my-4 rounded-md">
      <div className="container mx-auto flex items-center justify-between">
        <div className="text-white font-bold text-lg">
          {pathname === "/"
            ? "Pulpit"
            : pathname.charAt(1).toUpperCase() + pathname.slice(2)}
        </div>
        <ul className="flex space-x-4">
          <li>
            <div className="flex items-center rounded-md bg-gray-600 justify-center p-2">
              <MagnifyingGlassIcon className="text-white" />
              <input
                type="search"
                placeholder="Search..."
                className="text-base bg-transparent w-full text-white focus:outline-none px-2"
              />
            </div>
          </li>
          <li>
            <a>
              <BellIcon className="text-white" />
            </a>
          </li>
          <li>
            <div className="flex items-center w-full gap-4 md:ml-auto md:gap-2 lg:gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="h-9 w-9">
                    <AvatarImage
                      alt="Avatar"
                      className="rounded-full border"
                      height="32"
                      src="/placeholder-user.jpg"
                      width="32"
                    />
                    <AvatarFallback>{name?.charAt(0)}</AvatarFallback>
                    <span className="sr-only">Toggle user menu</span>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>
                    <Link href={"/profile"} className="w-full text-left">
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <button
                      className="w-full text-left"
                      onClick={() => signOut()}
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
