import ResetPasswordForm from "@/components/misc/Forms/ResetPasswordForm";
import { prisma } from "@/lib/prisma";

interface ResetPasswordProps {
  params: {
    token: string;
  };
}

export default async function ResetPassword({ params }: ResetPasswordProps) {
  const existingToken = await prisma.passwordResetToken.findFirst({
    where: {
      token: params.token,
    },
  });

  if (!existingToken) {
    return (
      <div className="flex h-screen items-center justify-center text-2xl text-red-500">
        Nieprawidłowe żądanie
      </div>
    );
  }

  if (existingToken.expires < new Date()) {
    return (
      <div className="flex h-screen items-center justify-center text-2xl text-red-500">
        Token wygasł
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <ResetPasswordForm email={existingToken.email} />
    </div>
  );
}
