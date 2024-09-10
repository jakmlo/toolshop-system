import AddEquipmentForm from "@/components/misc/Forms/AddEquipmentForm";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

export default async function AddEquipment() {
  const session = await auth();

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
    <div className="container flex flex-col items-center justify-center">
      <AddEquipmentForm categories={categories} />
    </div>
  );
}
