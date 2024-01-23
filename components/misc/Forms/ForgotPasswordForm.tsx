"use client";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  ForgotPasswordInput,
  ForgotPasswordSchema,
} from "@/lib/validations/user.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import Link from "next/link";
import { forgotPassword } from "@/lib/actions/forgotPassword/actions";

export default function ForgotPasswordForm() {
  const form = useForm<ForgotPasswordInput>({
    resolver: zodResolver(ForgotPasswordSchema),
  });

  const onSubmit: SubmitHandler<ForgotPasswordInput> = async (data) => {
    try {
      const res = await forgotPassword(data);
      if (res?.status === 404) {
        toast({
          title: "Użytkownik nie istnieje",
          description: "Wprowadź swój adres e-mail",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Zmiana hasła",
          description:
            "Wiadomość z linkiem do zmiany hasła została wysłana na twój adres e-mail",
          variant: "default",
        });
        form.reset();
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
    <div className="w-1/4 h-[512px] flex flex-col justify-center bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 md:p-6">
      <h1 className="text-2xl py-8 text-center">Zapomniałem hasła</h1>
      <div className="flex flex-row gap-2 pt-4 pb-6 justify-center">
        <Link className="text-sm text-blue-600" href="/auth/login">
          Powrót do strony logowania
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
                  <Input placeholder="Adres e-mail" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button disabled={form.formState.isSubmitting} type="submit">
            Wyślij prośbę o zmianę hasła
          </Button>
        </form>
      </Form>
    </div>
  );
}
