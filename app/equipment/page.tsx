import { Button } from "@/components/ui/button";
import { columns } from "@/components/utils/columns/equipment-columns";
import { DataTable } from "@/components/utils/data-table";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Equipment() {
  const session = await getServerSession(authOptions);

  const user = await prisma.user.findUnique({
    where: {
      id: session?.user.id,
    },
  });

  if (!(user?.organizationId && user?.accepted)) redirect("/workspaces");

  const tools = await prisma.tool.findMany({
    where: {
      organizationId: user?.organizationId,
    },
  });

  return (
    <div className="container flex items-center flex-col justify-center">
      {user.role === "admin" && (
        <Link className="mr-auto" href="/equipment/add">
          <Button>Dodaj sprzęt</Button>
        </Link>
      )}
      <DataTable columns={columns} data={tools} />
    </div>
  );
}
