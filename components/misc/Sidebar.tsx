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
  const pathname = usePathname();
  if (pathname === "/workspaces" || pathname === "/workspaces/profile")
    return null;

  const [open, setOpen] = useState(true);

  return (
    <div
      className={`relative bg-gray-800 text-white h-screen ${
        open ? "w-72" : "w-20"
      }  py-8 px-4 duration-300`}
    >
      <ArrowLeftIcon
        className={`bg-white text-black rounded-full h-6 w-6 cursor-pointer ${
          !open && "rotate-180"
        } duration-300 absolute -right-3 `}
        onClick={() => setOpen(!open)}
      />
      <Link href={"/"} className="inline-flex">
        <VercelLogoIcon className="fill-slate-700 mr-3 stroke-2 rounded-sm w-6 h-6 float-left block" />
        <h1
          className={`${
            !open && "scale-0"
          } font-semibold origin-left duration-300`}
        >
          Toolshop
        </h1>
      </Link>

      <ul className="pt-2">
        {menus.map((menu, index) => {
          return (
            <Link href={menu.href} key={index}>
              <li
                className={`text-gray-200 text-sm flex items-center gap-x-4 cursor-pointer p-2 ${
                  !open && "w-10 h-10 justify-center"
                } hover:bg-gray-500 rounded-md mt-2`}
              >
                <span className="block float-left">{menu.icon}</span>
                <span
                  className={`text-base font-medium flex-1 ${
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
