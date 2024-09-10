import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function RentalDetails({
  params,
}: {
  params: { id: string };
}) {
  const session = await auth();
  const user = await prisma.user.findUnique({
    where: {
      id: session?.user.id,
    },
  });

  if (!(user?.organizationId && user?.accepted)) redirect("/workspaces");

  const catalogNumberCount: {
    [key: string]: number;
  } = {};
  const rental = await prisma.rental.findUnique({
    where: {
      rentalId: params.id,
      organizationId: user?.organizationId,
    },
    include: {
      contractor: true,
      tools: true,
    },
  });

  const distinctTools = await prisma.tool.findMany({
    where: {
      rentals: {
        some: {
          rentalId: rental?.rentalId,
          organizationId: user?.organizationId,
        },
      },
    },
    distinct: ["catalogNumber"],
  });

  rental?.tools.forEach((tool) => {
    const catalogNumber = tool.catalogNumber;
    catalogNumberCount[catalogNumber] =
      (catalogNumberCount[catalogNumber] || 0) + 1;
  });

  return (
    <main className="p-4 md:p-6">
      <div className="rounded-lg bg-white p-4 shadow-md dark:bg-gray-800 md:p-6">
        <h2 className="mb-4 text-2xl font-bold">Rental Details</h2>
        <div className="grid gap-2">
          <div className="flex items-center">
            <h3 className="text-lg font-semibold md:text-xl">
              Contractor Name:
            </h3>
            <p className="ml-2 text-gray-500 dark:text-gray-400">
              {`${rental?.contractor.firstName} ${rental?.contractor.lastName}`}
            </p>
          </div>
          <div className="flex items-center">
            <h3 className="text-lg font-semibold md:text-xl">
              Start Rent Date:
            </h3>
            <p className="ml-2 text-gray-500 dark:text-gray-400">
              {rental?.rentalDate.toDateString()}
            </p>
          </div>
          <div className="flex items-center">
            <h3 className="text-lg font-semibold md:text-xl">End Rent Date:</h3>
            <p className="ml-2 text-gray-500 dark:text-gray-400">
              {rental?.returnDate.toDateString()}
            </p>
          </div>
          <div className="flex items-center">
            <h3 className="text-lg font-semibold md:text-xl">Status:</h3>
            <p className="ml-2 text-gray-500 dark:text-gray-400">
              {rental?.status}
            </p>
          </div>
        </div>
      </div>
      <div className="mt-6">
        <h2 className="mb-4 text-2xl font-bold">Tools</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {distinctTools.map((tool) => (
            <div
              className="rounded-lg bg-white p-4 shadow-md dark:bg-gray-800 md:p-6"
              key={tool.toolId}
            >
              <h3 className="text-lg font-semibold md:text-xl">{tool.name}</h3>
              <p className="mt-2 text-gray-500 dark:text-gray-400">
                {`${tool?.catalogNumber} x${
                  catalogNumberCount[tool.catalogNumber]
                }`}
              </p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
