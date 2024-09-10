import UserForm from "@/components/misc/Forms/UserForm";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export default async function Profile() {
  const session = await auth();

  const user = await prisma.user.findUnique({
    where: {
      id: session?.user.id,
    },
    select: {
      id: true,
      name: true,
      image: true,
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
