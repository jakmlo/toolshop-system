import { ReturnForm } from "@/components/misc/Return/ReturnForm";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";

export default async function Return() {
  const session = await getServerSession(authOptions);
  const rentals = await prisma.rental.findMany({
    where: {
      status: "pending",
      organizationId: session?.user.organizationId,
    },
  });

  return (
    <div className="container flex items-center justify-center">
      <ReturnForm rentals={rentals} />
    </div>
  );
}
