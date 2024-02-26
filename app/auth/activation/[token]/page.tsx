import { activateUser } from "@/lib/actions/activation/actions";

interface ActivationProps {
  params: {
    token: string;
  };
}
const ActivationPage = async ({ params }: ActivationProps) => {
  const result = await activateUser(params.token);

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      {result === "userNotExist" ? (
        <p className="text-2xl text-red-500">Ten użytkownik nie istnieje</p>
      ) : result === "alreadyActivated" ? (
        <p className="text-2xl text-red-500">
          Ten adres e-mail jest już zweryfikowany
        </p>
      ) : result === "tokenExpired" ? (
        <p className="text-2xl text-red-500">Token wygasł</p>
      ) : result === "success" ? (
        <p className="text-2xl text-green-500">Adres e-mail zweryfikowany</p>
      ) : (
        <p className="text-2xl text-yellow-500">Coś poszło nie tak</p>
      )}
    </div>
  );
};

export default ActivationPage;
