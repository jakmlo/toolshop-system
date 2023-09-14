"use client";
import React, { useState } from "react";
import {
  ArrowLeftIcon,
  VercelLogoIcon,
  MagnifyingGlassIcon,
  DashboardIcon,
  ResetIcon,
  PaperPlaneIcon,
} from "@radix-ui/react-icons";
import Link from "next/link";

const menus = [
  { title: "Dashboard", icon: <DashboardIcon />, href: "/" },
  { title: "Szybki zwrot", icon: <ResetIcon />, href: "/return" },
  { title: "Szybkie wydanie", icon: <PaperPlaneIcon />, href: "/rental" },
];

export default function Sidebar() {
  const [open, setOpen] = useState(true);

  return (
    <div
      className={`relative h-screen bg-gray-800 text-white ${
        open ? "w-72" : "w-20"
      }  py-8 px-4 shadow-lg rounded-r-lg duration-300`}
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
      <div
        className={`flex items-center rounded-md bg-gray-600 ${
          !open && "w-10 h-10 justify-center"
        } p-2 mt-6`}
      >
        <MagnifyingGlassIcon />
        <input
          type="search"
          placeholder="Search"
          className={`text-base bg-transparent w-full text-white focus:outline-none px-2 ${
            !open && "hidden"
          }`}
        />
      </div>

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
