"use client";
import React, { useState } from "react";
import {
  ArrowLeftIcon,
  VercelLogoIcon,
  DashboardIcon,
  ResetIcon,
  PaperPlaneIcon,
  PersonIcon,
  RocketIcon,
} from "@radix-ui/react-icons";
import Link from "next/link";
import { usePathname } from "next/navigation";

const menus = [
  { title: "Pulpit", icon: <DashboardIcon />, href: "/dashboard" },
  { title: "Szybki zwrot", icon: <ResetIcon />, href: "/return" },
  { title: "Szybkie wydanie", icon: <PaperPlaneIcon />, href: "/rental" },
  { title: "Kontrahenci", icon: <PersonIcon />, href: "/contractors" },
  { title: "Sprzęt", icon: <RocketIcon />, href: "/equipment" },
];

export default function Sidebar() {
  const [open, setOpen] = useState(true);
  const pathname = usePathname();
  if (pathname === "/workspaces" || pathname === "/workspaces/profile")
    return null;

  return (
    <div
      className={`relative h-screen bg-gray-800 text-white ${
        open ? "w-72" : "w-20"
      }  px-4 py-8 duration-300`}
    >
      <ArrowLeftIcon
        className={`h-6 w-6 cursor-pointer rounded-full bg-white text-black ${
          !open && "rotate-180"
        } absolute -right-3 duration-300 `}
        onClick={() => setOpen(!open)}
      />
      <Link href={"/"} className="inline-flex">
        <VercelLogoIcon className="float-left mr-3 block h-6 w-6 rounded-sm fill-slate-700 stroke-2" />
        <h1
          className={`${
            !open && "scale-0"
          } origin-left font-semibold duration-300`}
        >
          Toolshop
        </h1>
      </Link>

      <ul className="pt-2">
        {menus.map((menu, index) => {
          return (
            <Link href={menu.href} key={index}>
              <li
                className={`flex cursor-pointer items-center gap-x-4 p-2 text-sm text-gray-200 ${
                  !open && "h-10 w-10 justify-center"
                } mt-2 rounded-md hover:bg-gray-500`}
              >
                <span className="float-left block">{menu.icon}</span>
                <span
                  className={`flex-1 text-base font-medium ${
                    !open && "hidden"
                  } whitespace-nowrap`}
                >
                  {menu.title}
                </span>
              </li>
            </Link>
          );
        })}
      </ul>
    </div>
  );
}
