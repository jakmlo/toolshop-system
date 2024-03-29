import EditContractorDialog from "@/components/misc/Dialogs/EditContractorDialog";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function ContractorDetails({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);
  const user = await prisma.user.findUnique({
    where: {
      id: session?.user.id,
    },
  });

  if (!(user?.organizationId && user?.accepted)) redirect("/workspaces");

  const contractor = await prisma.contractor.findUnique({
    where: {
      contractorId: params.id,
      organizationId: user?.organizationId,
    },
  });

  const rentals = await prisma.rental.findMany({
    where: {
      contractorId: contractor?.contractorId,
      organizationId: user?.organizationId,
    },
    orderBy: {
      rentalDate: "desc",
    },
  });

  return (
    <main className="p-4 md:p-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 md:p-6 mb-4">
        <h2 className="text-2xl font-bold mb-4">Dane kontrahenta</h2>
        <div className="grid gap-2">
          <div className="flex items-center">
            <h3 className="font-semibold text-lg md:text-xl">Kontrahent:</h3>
            <p className="ml-2 text-gray-500 dark:text-gray-400">
              {`${contractor?.firstName} ${contractor?.lastName}`}
            </p>
          </div>
          <div className="flex items-center">
            <h3 className="font-semibold text-lg md:text-xl">NIP:</h3>
            <p className="ml-2 text-gray-500 dark:text-gray-400">
              {contractor?.taxIdNumber}
            </p>
          </div>
          <div className="flex items-center">
            <h3 className="font-semibold text-lg md:text-xl">Adres:</h3>
            <p className="ml-2 text-gray-500 dark:text-gray-400">
              {contractor?.address}
            </p>
          </div>
          <div className="flex items-center">
            <h3 className="font-semibold text-lg md:text-xl">
              Numer telefonu:
            </h3>
            <p className="ml-2 text-gray-500 dark:text-gray-400">
              {contractor?.phoneNumber}
            </p>
          </div>
        </div>
      </div>
      {user.role === "admin" && (
        <EditContractorDialog contractor={contractor} />
      )}
      <div className="mt-6">
        <h2 className="text-2xl font-bold mb-4">Wypożyczenia</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {rentals.map((rental) => (
            <div
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 md:p-6"
              key={rental.rentalId}
            >
              <h3 className="font-semibold text-lg md:text-xl">
                {rental.rentalId}
              </h3>
              <p className="mt-2 text-gray-500 dark:text-gray-400">
                {rental.status}
              </p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
