import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { Plus } from "lucide-react";
import { CreateOrganizationDialog } from "@/components/misc/Dialogs/CreateOrganizationDialog";
import Link from "next/link";
import { JoinOrganizationDialog } from "@/components/misc/Dialogs/JoinOrganizationDialog";

export default async function Workspaces() {
  const session = await getServerSession(authOptions);

  if (session) {
    const user = await prisma.user.findUnique({
      where: { id: session?.user.id },
      include: {
        organization: true,
      },
    });
    return (
      <main className="h-max p-12">
        <div className="grid grid-flow-row gap-4">
          <div className="text-left">
            <p className="text-2xl font-bold mb-2">Moje miejsca pracy</p>
            {!user?.accepted && <JoinOrganizationDialog />}
            <p className="text-gray-600">
              {user?.organizationId
                ? "To twój obszar roboczy"
                : "Nie masz jeszcze obszaru roboczego"}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 ">
            {user?.organizationId ? (
              <>
                <Link href={user?.accepted ? "/dashboard" : ""}>
                  <div className="bg-white p-6 rounded-md shadow-md  hover:shadow-xl cursor-pointer ">
                    <h2 className="text-lg font-bold mb-2">
                      {`${user?.organization?.name} ${
                        !user.accepted ? "(W trakcie weryfikacji)" : ""
                      }`}
                    </h2>
                    <p className="text-gray-600">
                      {`Utworzone ${user?.organization?.createdAt.toLocaleDateString()}`}
                    </p>
                  </div>
                </Link>
                {!user.accepted && (
                  <CreateOrganizationDialog>
                    <div className="bg-white p-6 rounded-md shadow-md flex flex-col items-center hover:shadow-xl cursor-pointer ">
                      <Plus className="h-16 w-16 text-blue-500 m-4" />
                      <h2 className="text-lg font-bold mb-2 text-center">
                        Dodaj obszar roboczy
                      </h2>
                      <p className="text-gray-600">
                        Stwórz swój własny obszar roboczy, zarządzaj nim i
                        wykorzystaj wszystko co ma do zaoferowania Toolshop
                        System.
                      </p>
                    </div>
                  </CreateOrganizationDialog>
                )}
              </>
            ) : (
              <CreateOrganizationDialog>
                <div className="bg-white p-6 rounded-md shadow-md flex flex-col items-center hover:shadow-xl cursor-pointer ">
                  <Plus className="h-16 w-16 text-blue-500 m-4" />
                  <h2 className="text-lg font-bold mb-2 text-center">
                    Dodaj obszar roboczy
                  </h2>
                  <p className="text-gray-600">
                    Stwórz swój własny obszar roboczy i zarządzaj nim i
                    wykorzystaj wszystko co ma do zaoferowania Toolshop System.
                  </p>
                </div>
              </CreateOrganizationDialog>
            )}
          </div>
        </div>
      </main>
    );
  }
}
