import UserForm from "@/components/misc/Forms/UserForm";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function Profile() {
  const session = await getServerSession(authOptions);

  const user = await prisma.user.findUnique({
    where: {
      id: session?.user.id,
    },
    select: {
      id: true,
      name: true,
      image: true,
      email: true,
      organizationId: true,
      accepted: true,
    },
  });

  if (!(user?.organizationId && user?.accepted)) redirect("/workspaces");

  return (
    <div className="container w-1/2">
      <UserForm user={user} />
    </div>
  );
}
