import { Button } from "@/components/ui/button";
import { columns } from "@/components/utils/columns/contractor-columns";
import { DataTable } from "@/components/utils/data-table";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

export default async function Contractors() {
  const session = await auth();

  const user = await prisma.user.findUnique({
    where: {
      id: session?.user.id,
    },
  });

  if (!(user?.organizationId && user?.accepted)) redirect("/workspaces");

  const contractors = await prisma.contractor.findMany({
    where: {
      organizationId: user?.organizationId,
    },
  });

  return (
    <div className="container flex flex-col items-center justify-center">
      {user.role === "admin" && (
        <Link className="mr-auto" href="/contractors/add">
          <Button>Dodaj kontrahenta</Button>
        </Link>
      )}
      <DataTable columns={columns} data={contractors} />
    </div>
  );
}
