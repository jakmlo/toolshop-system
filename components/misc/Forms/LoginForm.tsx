"use client";
import { LoginUserInput, LoginUserSchema } from "@/lib/validations/user.schema";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useToast } from "../../ui/use-toast";
import { useSearchParams } from "next/navigation";
import { checkUserVerified } from "@/lib/actions/login/actions";
import Link from "next/link";
import { useState } from "react";
import Spinner from "../Spinners/Spinner";

export default function LoginForm() {
  const { toast } = useToast();
  const router = useRouter();
  const [success, setSuccess] = useState(false);

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/workspaces";

  const form = useForm<LoginUserInput>({
    resolver: zodResolver(LoginUserSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<LoginUserInput> = async (data) => {
    try {
      const userVerified = await checkUserVerified(data.email);

      if (userVerified === false) {
        toast({
          title: "Zweryfikuj adres e-mail",
          description:
            "Na podany adres e-mail został wysłany link weryfikujący",
          variant: "default",
        });
        return null;
      }
      const res = await signIn("credentials", {
        email: data.email.toLowerCase(),
        password: data.password,
        redirect: false,
        callbackUrl,
      });
      if (!res?.error) {
        setSuccess(true);
        router.push(callbackUrl);
        router.refresh();
        toast({
          title: "Zalogowano",
          description: "",
          variant: "default",
        });
      } else if (res?.error === "CredentialsSignin") {
        toast({
          title: "Nieprawidłowy login i/lub hasło",
          description: "Wprowadź poprawne dane",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Błąd",
          description: res.error,
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Błąd",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <div className="mt-16 flex w-full flex-col justify-center  rounded-lg p-4 dark:bg-gray-800 md:h-[512px] md:w-1/4 md:bg-white md:p-6 md:shadow-md">
        <h1 className="p-2 text-center font-semibold">Zaloguj się</h1>
        <div className="flex flex-row justify-center gap-2 pb-6 pt-4">
          <p className="text-sm">Nie masz jeszcze konta?</p>
          <Link className="text-sm text-blue-600" href="/auth/register">
            Utwórz konto
          </Link>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 px-4 md:px-0"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Adres e-mail</FormLabel>
                  <FormControl>
                    <Input placeholder="admin@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hasło</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="●●●●●●●●●●●●"
                      type="password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              disabled={form.formState.isSubmitting || success}
              type="submit"
              className="w-full gap-4"
            >
              {form.formState.isSubmitting || success ? (
                <>
                  <Spinner />
                </>
              ) : (
                <p>Zaloguj się</p>
              )}
            </Button>
          </form>
        </Form>
        <Link
          className="w-fit p-4 text-sm text-blue-600 md:px-0 md:py-4"
          href="/password/reset"
        >
          Zapomniałem hasła
        </Link>
      </div>
    </>
  );
}
