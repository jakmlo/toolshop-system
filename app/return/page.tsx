import { ReturnForm } from "@/components/misc/Return/ReturnForm";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

export default async function Return() {
  const session = await auth();
  const user = await prisma.user.findUnique({
    where: {
      id: session?.user.id,
    },
  });

  if (!(user?.organizationId && user?.accepted)) redirect("/workspaces");

  const rentals = await prisma.rental.findMany({
    where: {
      status: "pending",
      organizationId: user?.organizationId,
    },
  });

  return (
    <div className="container flex items-center justify-center">
      <ReturnForm rentals={rentals} />
    </div>
  );
}
