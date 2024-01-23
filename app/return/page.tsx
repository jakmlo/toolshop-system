import { ReturnForm } from "@/components/misc/Return/ReturnForm";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Return() {
  const session = await getServerSession(authOptions);
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
