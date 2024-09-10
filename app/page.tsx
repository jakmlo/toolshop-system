import Link from "next/link";
import { Button } from "@/components/ui/button";
import { JSX, SVGProps } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
export default async function Home() {
  const session = await auth();

  if (session) redirect("/workspaces");

  return (
    <div className="flex min-h-screen flex-col border-t bg-gray-50 dark:bg-gray-900">
      <header className="flex items-center justify-between bg-white p-6 shadow-md dark:bg-gray-800">
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
            className="rounded-md bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
          >
            Zarejestruj się
          </Link>
        </div>
      </header>
      <main className="flex-1">
        <section className="bg-gray-100 px-6 py-12 dark:bg-gray-800">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-4 text-4xl font-bold text-gray-800 dark:text-gray-200">
              Uprość swój proces wypożyczania
            </h1>
            <p className="mb-8 text-gray-600 dark:text-gray-400">
              Nasz system pozwala w łatwy sposób zarządzać wypożyczeniami
              sprzętu, śledź dostępność i usprawniaj swoje działania.
            </p>
            <Link href="/auth/register">
              <Button className="rounded-md bg-blue-600 px-6 py-2 text-white hover:bg-blue-700">
                Zacznij teraz
              </Button>
            </Link>
          </div>
        </section>
        <section className="px-6 py-12">
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="flex flex-col items-center text-center">
              <SettingsIcon className="mb-4 h-12 w-12 text-blue-600" />
              <h2 className="mb-2 text-2xl font-bold text-gray-800 dark:text-gray-200">
                Funkcjonalności
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Oferujemy szeroką gamę funkcji upraszczających Twoje procesy.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <CalendarCheckIcon className="mb-4 h-12 w-12 text-blue-600" />
              <h2 className="mb-2 text-2xl font-bold text-gray-800 dark:text-gray-200">
                Dostępność w czasie rzeczywistym
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Sprawdzaj dostępność sprzętu w czasie rzeczywistym.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <HelpCircleIcon className="mb-4 h-12 w-12 text-blue-600" />
              <h2 className="mb-2 text-2xl font-bold text-gray-800 dark:text-gray-200">
                Wsparcie 24/7
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Nasz zespół wsparcia jest dostępny 24 godziny na dobę, 7 dni w
                tygodniu, aby zapewnić Ci sprawne działanie.
              </p>
            </div>
          </div>
        </section>
      </main>
      <footer className="mt-auto bg-white px-6 py-6 dark:bg-gray-800">
        <div className="mx-auto flex max-w-4xl flex-col items-center justify-between sm:flex-row">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            © 2024 Toolshop System. Wszystkie prawa zastrzeżone.
          </p>
          <div className="mt-4 flex items-center space-x-4 sm:mt-0">
            <Link
              className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
              href="/about"
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

  function CalendarCheckIcon(
    props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>,
  ) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
        <line x1="16" x2="16" y1="2" y2="6" />
        <line x1="8" x2="8" y1="2" y2="6" />
        <line x1="3" x2="21" y1="10" y2="10" />
        <path d="m9 16 2 2 4-4" />
      </svg>
    );
  }
}

function HelpCircleIcon(
  props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>,
) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <path d="M12 17h.01" />
    </svg>
  );
}

function SettingsIcon(
  props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>,
) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
