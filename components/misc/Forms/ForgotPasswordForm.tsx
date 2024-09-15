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
    defaultValues: {
      email: "",
    },
  });

  const onSubmit: SubmitHandler<ForgotPasswordInput> = async (data) => {
    try {
      const res = await forgotPassword(data);
      toast({
        title: "Prośba o zmianę hasła",
        description:
          "Jeśli konto istnieje, wiadomość z linkiem do zmiany hasła zostanie wysłana na twój adres e-mail",
        variant: "default",
      });
      form.reset();
    } catch (error: any) {
      toast({
        title: "Błąd",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex w-full flex-col justify-center rounded-lg p-4 dark:bg-gray-800 md:h-[512px] md:w-1/4 md:bg-white md:p-6 md:shadow-md">
      <h1 className="py-8 text-center text-2xl">Zapomniałem hasła</h1>
      <div className="flex flex-row justify-center gap-2 pb-6 pt-4">
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
          <Button
            disabled={form.formState.isSubmitting}
            type="submit"
            className="w-full"
          >
            Wyślij prośbę o zmianę hasła
          </Button>
        </form>
      </Form>
    </div>
  );
}
