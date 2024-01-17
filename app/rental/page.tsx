import { RentalForm } from "@/components/misc/Rental/RentalForm";
import { Rental } from "@/lib/validations/rental.schema";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function Rental() {
  const session = await getServerSession(authOptions);
  const contractorsData = await prisma.contractor.findMany({
    where: {
      organizationId: session?.user.organizationId,
    },
  });
  const toolsData = await prisma.tool.findMany({
    where: {
      organizationId: session?.user.organizationId,
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
