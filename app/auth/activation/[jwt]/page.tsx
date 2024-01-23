import { activateUser } from "@/lib/actions/activation/actions";

interface ActivationProps {
  params: {
    jwt: string;
  };
}
const ActivationPage = async ({ params }: ActivationProps) => {
  const result = await activateUser(params.jwt);

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      {result === "userNotExist" ? (
        <p className="text-red-500 text-2xl">Ten użytkownik nie istnieje</p>
      ) : result === "alreadyActivated" ? (
        <p className="text-red-500 text-2xl">
          Ten adres e-mail jest już zweryfikowany
        </p>
      ) : result === "success" ? (
        <p className="text-green-500 text-2xl">Adres e-mail zweryfikowany</p>
      ) : (
        <p className="text-yellow-500 text-2xl">Coś poszło nie tak</p>
      )}
    </div>
  );
};

export default ActivationPage;
