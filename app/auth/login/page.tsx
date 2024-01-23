import LoginForm from "@/components/misc/Forms/LoginForm";
import Link from "next/link";

export default async function Login() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="flex items-center justify-between p-6 bg-white dark:bg-gray-800 shadow-md">
        <Link
          className="text-2xl font-bold text-gray-800 dark:text-gray-200"
          href="/"
        >
          Toolshop System
        </Link>
        <div className="flex items-center space-x-4">
          <Link
            className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
            href="/auth/login"
          >
            Zaloguj się
          </Link>
          <Link
            href="/auth/register"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            Zarejestruj się
          </Link>
        </div>
      </header>
      <div className="flex justify-center">
        <LoginForm />
      </div>

      <footer className="bg-white dark:bg-gray-800 py-6 px-6 mt-auto">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row justify-between items-center">
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            © 2024 Toolshop System. Wszystkie prawa zastrzeżone.
          </p>
          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            <Link
              className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
              href="#"
            >
              O nas
            </Link>
            <Link
              className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
              href="#"
            >
              Warunki użytkowania
            </Link>
            <Link
              className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
              href="#"
            >
              Polityka prywatności
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
