"use client";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  ResetPasswordInput,
  ResetPasswordSchema,
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
import { useRouter } from "next/navigation";
import { resetPassword } from "@/lib/actions/forgotPassword/actions";

interface ResetPasswordFormProps {
  email: string;
}

export default function ResetPasswordForm({ email }: ResetPasswordFormProps) {
  const router = useRouter();
  const form = useForm<ResetPasswordInput>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      password: "",
      passwordConfirm: "",
    },
  });

  const onSubmit: SubmitHandler<ResetPasswordInput> = async (data) => {
    try {
      const res = await resetPassword(email, data);
      if (res?.status === 200) {
        toast({
          title: "Hasło zresetowane poprawnie",
          description: "Zaloguj się używając nowego hasła",
          variant: "default",
        });
        router.push("/auth/login");
      } else {
        toast({
          title: "Błąd",
          description: res?.message,
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
    <div className="flex h-[512px] w-1/4 flex-col justify-center rounded-lg bg-white p-4 shadow-md dark:bg-gray-800 md:p-6">
      <h1 className="py-8 text-center text-2xl">Resetowanie hasła</h1>
      <div className="flex flex-row justify-center gap-2 pb-6 pt-4">
        <Link className="text-sm text-blue-600" href="/auth/login">
          Powrót do strony logowania
        </Link>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nowe Hasło</FormLabel>
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
                <FormLabel>Potwierdź nowe hasło</FormLabel>
                <FormControl>
                  <Input placeholder="●●●●●●●●" type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button disabled={form.formState.isSubmitting} type="submit">
            Zresetuj hasło
          </Button>
        </form>
      </Form>
    </div>
  );
}
