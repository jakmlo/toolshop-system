import AddContractorDialog from "@/components/misc/Dialogs/EditContractorDialog";
import { Button } from "@/components/ui/button";
import { columns } from "@/components/utils/columns/contractor-columns";
import { DataTable } from "@/components/utils/data-table";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Contractors() {
  const session = await getServerSession(authOptions);

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
    <div className="container flex items-center flex-col justify-center">
      {user.role === "admin" && (
        <Link className="mr-auto" href="/contractors/add">
          <Button>Dodaj kontrahenta</Button>
        </Link>
      )}
      <DataTable columns={columns} data={contractors} />
    </div>
  );
}
