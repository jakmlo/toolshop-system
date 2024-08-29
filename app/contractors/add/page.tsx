import AddContractorForm from "@/components/misc/Forms/AddContractorForm";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function AddContractor() {
  const session = await getServerSession(authOptions);

  const user = await prisma.user.findUnique({
    where: {
      id: session?.user.id,
    },
  });
  if (user?.role === "user") redirect("/contractors");
  if (!(user?.organizationId && user?.accepted)) redirect("/workspaces");
  return (
    <div className="container flex flex-col items-center justify-center">
      <AddContractorForm />
    </div>
  );
}
