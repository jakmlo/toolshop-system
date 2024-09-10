import { RentalForm } from "@/components/misc/Rental/RentalForm";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

export default async function Rental() {
  const session = await auth();
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
