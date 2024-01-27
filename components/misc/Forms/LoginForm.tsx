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

export default function LoginForm() {
  const { toast } = useToast();
  const router = useRouter();

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
        form.reset();
        return null;
      }
      const res = await signIn("credentials", {
        email: data.email.toLowerCase(),
        password: data.password,
        redirect: false,
        callbackUrl,
      });
      if (!res?.error) {
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
      <div className="w-1/4 h-[512px] flex flex-col  justify-center bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mt-16 md:p-6">
        <h1 className="text-center font-semibold p-2">Zaloguj się</h1>
        <div className="flex flex-row gap-2 pt-4 pb-6 justify-center">
          <p className="text-sm">Nie masz jeszcze konta?</p>
          <Link className="text-sm text-blue-600" href="/auth/register">
            Utwórz konto
          </Link>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                    <Input placeholder="●●●●●●●●" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={form.formState.isSubmitting} type="submit">
              Zaloguj się
            </Button>
            <Link
              className="text-sm text-blue-600 ml-16 w-fit"
              href="/password/reset"
            >
              Zapomniałem hasła
            </Link>
          </form>
        </Form>
      </div>
    </>
  );
}
