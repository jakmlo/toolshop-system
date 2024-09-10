"use client";

import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";

import { Button } from "../ui/button";

export const Social = () => {
  const onClick = (provider: "google") => {
    signIn(provider, { callbackUrl: "/workspaces" });
  };
  return (
    <div className="flex">
      <Button
        className="w-full"
        variant={"outline"}
        size={"lg"}
        onClick={() => onClick("google")}
      >
        <FcGoogle />
      </Button>
    </div>
  );
};
