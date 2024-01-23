import { DataTable } from "@/components/utils/data-table";
import { columns } from "@/components/utils/columns/user-columns";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Seats() {
  const session = await getServerSession(authOptions);
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
    <main className="container flex items-center flex-col justify-center">
      <DataTable columns={columns} data={users} />
    </main>
  );
}
