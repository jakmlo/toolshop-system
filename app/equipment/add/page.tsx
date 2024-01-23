import AddEquipmentForm from "@/components/misc/Forms/AddEquipmentForm";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function AddEquipment() {
  const session = await getServerSession(authOptions);

  const user = await prisma.user.findUnique({
    where: {
      id: session?.user.id,
    },
  });
  if (user?.role === "user") redirect("/equipment");
  if (!(user?.organizationId && user?.accepted)) redirect("/workspaces");

  const categories = await prisma.category.findMany({
    where: {
      organizationId: user?.organizationId,
    },
  });

  return (
    <div className="container flex items-center flex-col justify-center">
      <AddEquipmentForm categories={categories} />
    </div>
  );
}
