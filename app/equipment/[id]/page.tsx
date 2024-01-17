import { prisma } from "@/lib/prisma";
import { Pencil } from "lucide-react";

export default async function EquipmentDetails({
  params,
}: {
  params: { id: string };
}) {
  const tool = await prisma.tool.findUnique({
    where: {
      toolId: params.id,
    },
  });

  return (
    <main className="p-4 md:p-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 md:p-6">
        <h2 className="text-2xl font-bold mb-4">
          Dane sprzętu <Pencil />
        </h2>
        <div className="grid gap-2">
          <div className="flex items-center">
            <h3 className="font-semibold text-lg md:text-xl">Nazwa sprzętu:</h3>
            <p className="ml-2 text-gray-500 dark:text-gray-400">
              {tool?.name}
            </p>
          </div>
          <div className="flex items-center">
            <h3 className="font-semibold text-lg md:text-xl">
              Numer katalogowy:
            </h3>
            <p className="ml-2 text-gray-500 dark:text-gray-400">
              {tool?.catalogNumber}
            </p>
          </div>
          <div className="flex items-center">
            <h3 className="font-semibold text-lg md:text-xl">Opis:</h3>
            <p className="ml-2 text-gray-500 dark:text-gray-400">
              {tool?.description}
            </p>
          </div>
          <div className="flex items-center">
            <h3 className="font-semibold text-lg md:text-xl">Dostępność:</h3>
            <p className="ml-2 text-gray-500 dark:text-gray-400">
              {tool?.availability}
            </p>
          </div>
        </div>
      </div>
      <div className="mt-6">
        <h2 className="text-2xl font-bold mb-4">Rentals</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"></div>
      </div>
    </main>
  );
}
