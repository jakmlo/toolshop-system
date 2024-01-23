import { RentalForm } from "@/components/misc/Rental/RentalForm";
import { Rental } from "@/lib/validations/rental.schema";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Rental() {
  const session = await getServerSession(authOptions);
  const user = await prisma.user.findUnique({
    where: {
      id: session?.user.id,
    },
  });

  if (!(user?.organizationId && user?.accepted)) redirect("/workspaces");

  const contractorsData = prisma.contractor.findMany({
    where: {
      organizationId: user?.organizationId,
    },
  });
  const toolsData = prisma.tool.findMany({
    where: {
      organizationId: user?.organizationId,
    },
    distinct: ["catalogNumber"],
  });

  const [contractors, tools] = await Promise.all([contractorsData, toolsData]);

  return (
    <div className="container flex flex-row">
      <RentalForm contractors={contractors} tools={tools} />
    </div>
  );
}
