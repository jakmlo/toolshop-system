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

export default function LoginForm() {
  const { toast } = useToast();
  const router = useRouter();

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const form = useForm<LoginUserInput>({
    resolver: zodResolver(LoginUserSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<LoginUserInput> = async (data) => {
    try {
      const res = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
        callbackUrl,
      });
      if (!res?.error) {
        router.push(callbackUrl);
        router.refresh();
        toast({
          title: "Success",
          description: "Login successful",
          variant: "default",
        });
      } else if (res?.error === "CredentialsSignin") {
        toast({
          title: "Error",
          description: "Invalid credentials",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: res.error,
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  return (
    <>
      <div className=" w-1/4 h-[512px] flex flex-col justify-center ">
        <h1 className="text-center font-semibold p-2">Zaloguj się</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
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
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="●●●●●●●●" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </div>
    </>
  );
}
