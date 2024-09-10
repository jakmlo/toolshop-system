import EditEquipmentDialog from "@/components/misc/Dialogs/EditEquipmentDialog";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Image from "next/image";
import { auth } from "@/auth";

export default async function EquipmentDetails({
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
      <div className="mb-4 flex flex-row gap-96 rounded-lg bg-white p-4 shadow-md dark:bg-gray-800 md:p-6">
        <div className="w-auto flex-col">
          <h2 className="mb-4 text-2xl font-bold">Dane sprzętu</h2>
          <div className="flex items-center">
            <h3 className="text-lg font-semibold md:text-xl">Nazwa sprzętu:</h3>
            <p className="ml-2 text-gray-500 dark:text-gray-400">
              {tool?.name}
            </p>
          </div>
          <div className="flex items-center">
            <h3 className="text-lg font-semibold md:text-xl">
              Numer katalogowy:
            </h3>
            <p className="ml-2 text-gray-500 dark:text-gray-400">
              {tool?.catalogNumber}
            </p>
          </div>
          <div className="flex items-center">
            <h3 className="text-lg font-semibold md:text-xl">Opis:</h3>
            <p className="ml-2 text-gray-500 dark:text-gray-400">
              {tool?.description}
            </p>
          </div>
          <div className="flex items-center">
            <h3 className="text-lg font-semibold md:text-xl">Dostępność:</h3>
            <p className="ml-2 text-gray-500 dark:text-gray-400">
              {tool?.availability ? "Dostępne" : "Niedostępne"}
            </p>
          </div>
        </div>
        {tool?.image && (
          <Image
            priority={true}
            width={300}
            height={300}
            src={tool.image}
            alt="Ilustracja sprzętu"
          />
        )}
      </div>
      {user.role === "admin" && (
        <EditEquipmentDialog tool={tool} categories={tool.category} />
      )}
      <div className="mt-6">
        <h2 className="mb-4 text-2xl font-bold">Wypożyczenia</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"></div>
      </div>
    </main>
  );
}
