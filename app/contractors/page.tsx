import { columns } from "@/components/utils/columns/contractor-columns";
import { DataTable } from "@/components/utils/data-table";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";

export default async function Contractors() {
  const session = await getServerSession(authOptions);
  const contractors = await prisma.contractor.findMany({
    where: {
      organizationId: session?.user.organizationId,
    },
  });

  return (
    <div className="container flex items-center flex-col justify-center">
      <DataTable columns={columns} data={contractors} />
    </div>
  );
}
