import { DataTable } from "@/components/utils/data-table";
import { columns } from "@/components/utils/columns/user-columns";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

export default async function Seats() {
  const session = await auth();
  const user = await prisma.user.findUnique({
    where: {
      id: session?.user.id,
    },
  });

  if (user?.role === "user") redirect("/dashboard");
  if (!(user?.organizationId && user?.accepted)) redirect("/workspaces");

  const users = await prisma.user.findMany({
    where: {
      organizationId: user.organizationId,
    },
    orderBy: {
      accepted: "desc",
    },
  });

  return (
    <main className="container flex flex-col items-center justify-center">
      <DataTable columns={columns} data={users} />
    </main>
  );
}
