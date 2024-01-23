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
          photo: data?.photo,
        }),
      });
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
      <div className="w-1/4 h-3/4 flex flex-col justify-center  bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mt-16 md:p-6">
        <h1 className="text-center font-semibold p-2">Zarejestruj się</h1>
        <div className="flex flex-row gap-2 pt-4 pb-6 justify-center">
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
            <Button disabled={form.formState.isSubmitting} type="submit">
              Zarejestruj się
            </Button>
          </form>
        </Form>
      </div>
    </>
  );
}
