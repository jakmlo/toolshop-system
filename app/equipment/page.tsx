import { Button } from "@/components/ui/button";
import { columns } from "@/components/utils/columns/equipment-columns";
import { DataTable } from "@/components/utils/data-table";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

export default async function Equipment() {
  const session = await auth();

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
    <div className="container flex flex-col items-center justify-center">
      {user.role === "admin" && (
        <Link className="mr-auto" href="/equipment/add">
          <Button>Dodaj sprzęt</Button>
        </Link>
      )}
      <DataTable columns={columns} data={tools} />
    </div>
  );
}
