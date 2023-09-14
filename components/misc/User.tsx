"use client";

import { useSession } from "next-auth/react";

export default function User() {
  const { data: session } = useSession();

  return (
    <>
      <h1>Client Session</h1>
      <pre>{JSON.stringify(session)}</pre>
    </>
  );
}
