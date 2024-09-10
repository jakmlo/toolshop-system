import { DataTable } from "@/components/utils/data-table";
import { columns } from "@/components/utils/columns/rental-columns";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

export default async function Home() {
  const session = await auth();
  const user = await prisma.user.findUnique({
    where: {
      id: session?.user.id,
    },
  });

  if (!(user?.organizationId && user?.accepted)) redirect("/workspaces");

  const rentalsData = await prisma.rental.findMany({
    where: {
      organizationId: user.organizationId,
    },
    include: { tools: true, contractor: true },
    orderBy: {
      rentalDate: "desc",
    },
  });

  const rentals = rentalsData?.map((rental) => {
    const { rentalId, tools, contractor, rentalDate, returnDate, status } =
      rental;
    return {
      rentalId,
      toolName: tools[0]?.name,
      contractorName: `${contractor.firstName} ${contractor.lastName}`,
      rentalDate: rentalDate,
      returnDate: returnDate,
      status,
    };
  });

  return (
    <main className="container flex flex-col items-center justify-center">
      <DataTable columns={columns} data={rentals} />
    </main>
  );
}
