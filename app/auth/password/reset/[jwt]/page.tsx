import ResetPasswordForm from "@/components/misc/Forms/ResetPasswordForm";
import { verifyJWT } from "@/lib/jwt";

interface ResetPasswordProps {
  params: {
    jwt: string;
  };
}

export default function ResetPassword({ params }: ResetPasswordProps) {
  const payload = verifyJWT(params.jwt);

  if (!payload) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500 text-2xl">
        Nieprawidłowe żądanie
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center w-full h-screen">
      <ResetPasswordForm jwtUserId={params.jwt} />
    </div>
  );
}
