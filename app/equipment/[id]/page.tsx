import EditEquipmentDialog from "@/components/misc/Dialogs/EditEquipmentDialog";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function EquipmentDetails({
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

  const tool = await prisma.tool.findUnique({
    where: {
      toolId: params.id,
      organizationId: user?.organizationId,
    },
    include: {
      category: true,
    },
  });

  if (!tool) redirect("/equipment");

  return (
    <main className="p-4 md:p-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 md:p-6 mb-4">
        <h2 className="text-2xl font-bold mb-4">Dane sprzętu</h2>
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
              {tool?.availability ? "Dostępne" : "Niedostępne"}
            </p>
          </div>
        </div>
      </div>
      {user.role === "admin" && (
        <EditEquipmentDialog tool={tool} categories={tool.category} />
      )}
      <div className="mt-6">
        <h2 className="text-2xl font-bold mb-4">Wypożyczenia</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"></div>
      </div>
    </main>
  );
}
