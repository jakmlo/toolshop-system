import { prisma } from "@/lib/prisma";
import { Plus } from "lucide-react";
import { CreateOrganizationDialog } from "@/components/misc/Dialogs/CreateOrganizationDialog";
import Link from "next/link";
import { JoinOrganizationDialog } from "@/components/misc/Dialogs/JoinOrganizationDialog";
import { auth } from "@/auth";

export default async function Workspaces() {
  const session = await auth();
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
            <p className="mb-2 text-2xl font-bold">Moje miejsca pracy</p>
            {!user?.accepted && <JoinOrganizationDialog />}
            <p className="text-gray-600">
              {user?.organizationId
                ? "To twój obszar roboczy"
                : "Nie masz jeszcze obszaru roboczego"}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {user?.organizationId ? (
              <>
                <Link href={user?.accepted ? "/dashboard" : ""}>
                  <div className="cursor-pointer rounded-md bg-white p-6 shadow-md hover:shadow-xl">
                    <h2 className="mb-2 text-lg font-bold">
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
                    <div className="flex cursor-pointer flex-col items-center rounded-md bg-white p-6 shadow-md hover:shadow-xl">
                      <Plus className="m-4 h-16 w-16 text-blue-500" />
                      <h2 className="mb-2 text-center text-lg font-bold">
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
                <div className="flex cursor-pointer flex-col items-center rounded-md bg-white p-6 shadow-md hover:shadow-xl">
                  <Plus className="m-4 h-16 w-16 text-blue-500" />
                  <h2 className="mb-2 text-center text-lg font-bold">
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
