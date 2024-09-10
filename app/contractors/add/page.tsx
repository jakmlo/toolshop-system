import AddContractorForm from "@/components/misc/Forms/AddContractorForm";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

export default async function AddContractor() {
  const session = await auth();

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
