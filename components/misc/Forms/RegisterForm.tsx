"use client";
import {
  RegisterUserInput,
  RegisterUserSchema,
} from "@/lib/validations/user.schema";
import { SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import Spinner from "../Spinners/Spinner";

export default function RegisterForm() {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<RegisterUserInput>({
    resolver: zodResolver(RegisterUserSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      passwordConfirm: "",
    },
  });
  const onSubmit: SubmitHandler<RegisterUserInput> = async (data) => {
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
          passwordConfirm: data.passwordConfirm,
        }),
      });
      console.log(res)
      if (res.status === 201) {
        router.push("/auth/login");
        toast({
          title: "Pomyślnie zarejestrowano",
          description: "Sprawdź skrzynkę pocztowę i zweryfikuj konto",
        });
      } else if (res.status === 409) {
        toast({
          variant: "destructive",
          title: "Użytkownik już istnieje",
          description: "Wprowadź inny adres e-mail",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Błąd",
          description: res.statusText,
        });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error?.message,
      });
    }
  };

  return (
    <>
      <div className="mt-16 flex w-full flex-col justify-center rounded-lg  p-4 dark:bg-gray-800 md:h-3/4 md:w-1/4 md:bg-white md:p-6 md:shadow-md">
        <h1 className="p-2 text-center font-semibold">Zarejestruj się</h1>
        <div className="flex flex-row justify-center gap-2 pb-6 pt-4">
          <p className="text-sm"> Masz już konto?</p>
          <Link className="text-sm text-blue-600" href="/auth/login">
            Zaloguj się
          </Link>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nazwa użytkownika</FormLabel>
                  <FormControl>
                    <Input placeholder="Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
            <FormField
              control={form.control}
              name="passwordConfirm"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Potwierdź hasło</FormLabel>
                  <FormControl>
                    <Input placeholder="●●●●●●●●" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              disabled={form.formState.isSubmitting}
              type="submit"
              className="w-full"
            >
              {form.formState.isSubmitting ? (
                <Spinner />
              ) : (
                <p>Zarejestruj się</p>
              )}
            </Button>
          </form>
        </Form>
      </div>
    </>
  );
}
