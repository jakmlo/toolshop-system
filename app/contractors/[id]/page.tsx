import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Pencil } from "lucide-react";
import { getServerSession } from "next-auth";

export default async function ContractorDetails({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);
  const contractor = await prisma.contractor.findUnique({
    where: {
      contractorId: params.id,
      organizationId: session?.user.organizationId,
    },
    include: {
      rentals: {
        orderBy: {
          rentalDate: "desc",
        },
      },
    },
  });

  return (
    <main className="p-4 md:p-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 md:p-6">
        <h2 className="text-2xl font-bold mb-4">
          Rental Details <Pencil />
        </h2>
        <div className="grid gap-2">
          <div className="flex items-center">
            <h3 className="font-semibold text-lg md:text-xl">
              Contractor Name:
            </h3>
            <p className="ml-2 text-gray-500 dark:text-gray-400">
              {`${contractor?.firstName} ${contractor?.lastName}`}
            </p>
          </div>
          <div className="flex items-center">
            <h3 className="font-semibold text-lg md:text-xl">Address:</h3>
            <p className="ml-2 text-gray-500 dark:text-gray-400">
              {contractor?.address}
            </p>
          </div>
          <div className="flex items-center">
            <h3 className="font-semibold text-lg md:text-xl">Phone Number:</h3>
            <p className="ml-2 text-gray-500 dark:text-gray-400">
              {contractor?.phoneNumber}
            </p>
          </div>
        </div>
      </div>
      <div className="mt-6">
        <h2 className="text-2xl font-bold mb-4">Rentals</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {contractor?.rentals.map((rental) => (
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
