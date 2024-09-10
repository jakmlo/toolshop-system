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
import { useToast } from "../../ui/use-toast";
import { useSearchParams } from "next/navigation";
import { checkUserVerified, loginUser } from "@/lib/actions/login/actions";
import Link from "next/link";
import { useState } from "react";
import Spinner from "../Spinners/Spinner";
import { Eye, EyeOff } from "lucide-react";
import { useEdgeStore } from "@/lib/edgestore";
import { Social } from "../Social";

export default function LoginForm() {
  const { toast } = useToast();
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showTwoFactor, setShowTwoFactor] = useState(false);

  const { reset } = useEdgeStore();

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/workspaces";

  const form = useForm<LoginUserInput>({
    resolver: zodResolver(LoginUserSchema),
    defaultValues: {
      email: "",
      password: "",
      code: "",
    },
  });

  const onSubmit: SubmitHandler<LoginUserInput> = async (data) => {
    try {
      const userVerified = await checkUserVerified(data.email);
      if (!userVerified) {
        toast({
          title: "Zweryfikuj adres e-mail",
          description:
            "Na podany adres e-mail został wysłany link weryfikujący",
          variant: "default",
        });
        return null;
      }
      const res = await loginUser(data, callbackUrl);
      if (res?.twoFactor) {
        setShowTwoFactor(true);
        return null;
      }
      if (!res?.error) {
        toast({
          title: "Zalogowano",
          description: "",
          variant: "default",
        });
        setSuccess(true);
        await reset();
        return null;
      }
      if (res?.error === "Nieprawidłowe dane logowania.") {
        toast({
          title: res.error,
          description: "Spróbuj ponownie",
          variant: "destructive",
        });
      } else {
        toast({
          title: res?.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Coś poszło nie tak",
        description: "Skontaktuj się z administratorem",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <div className="mt-16 flex w-full flex-col justify-center rounded-lg p-4 dark:bg-gray-800 md:h-[512px] md:w-1/4 md:bg-white md:p-6 md:shadow-md">
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
            {showTwoFactor && (
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kod uwierzytelniania dwuskładnikowego</FormLabel>
                    <FormControl>
                      <Input placeholder="123456" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {!showTwoFactor && (
              <>
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
                        <div className="relative flex flex-row items-center">
                          <Input
                            className="pr-8"
                            placeholder="●●●●●●●●●●●●"
                            type={showPassword ? "text" : "password"}
                            {...field}
                          />
                          <span
                            aria-label="Show or hide password"
                            onClick={() =>
                              setShowPassword(
                                (prevShowPassword) => !prevShowPassword,
                              )
                            }
                            className="absolute bottom-0 right-0 top-0 flex cursor-pointer items-center justify-center pr-2"
                          >
                            {showPassword ? <Eye /> : <EyeOff />}
                          </span>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

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
                <p>{showTwoFactor ? "Potwierdź" : "Zaloguj się"} </p>
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
        <p className="items-center justify-center text-sm">
          lub zaloguj się z Google
        </p>
        <Social />
      </div>
    </>
  );
}
