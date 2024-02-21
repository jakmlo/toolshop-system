import UserForm from "@/components/misc/Forms/UserForm";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";

export default async function Profile() {
  const session = await getServerSession(authOptions);

  const user = await prisma.user.findUnique({
    where: {
      id: session?.user.id,
    },
    select: {
      id: true,
      name: true,
      photo: true,
      email: true,
      accepted: true,
      organization: true,
    },
  });

  return (
    <div className="container mt-16 w-1/2">
      <UserForm user={user} />
    </div>
  );
}
