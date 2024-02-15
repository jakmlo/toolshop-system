"use client";
import { EditUserInput, EditUserSchema } from "@/lib/validations/user.schema";
import { SubmitHandler, useForm } from "react-hook-form";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { editUser } from "@/lib/actions/profile/actions";
import UploadFile from "../UploadFile";

type UserFormProps = {
  user: {
    id: string;
    name: string;
    email: string;
    photo: string | null;
    accepted: boolean | null;
  } | null;
};

export default function UserForm({ user }: UserFormProps) {
  const { toast } = useToast();

  const form = useForm<EditUserInput>({
    resolver: zodResolver(EditUserSchema),
    defaultValues: {
      photo: user?.photo,
      name: user?.name,
      email: user?.email,
    },
  });
  const onSubmit: SubmitHandler<EditUserInput> = async (data) => {
    try {
      const id = user?.id as string;
      const res = await editUser(data, id);
      if (res?.status == 204) {
        toast({
          title: "Sukces",
          description: "Zmiany zostały zapisane",
          variant: "default",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: res?.status,
        });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Błąd",
        description: error?.message,
      });
    }
  };

  return (
    <>
      <div className="rounded-lg bg-white p-4 shadow-md dark:bg-gray-800 md:p-6">
        <h1 className="p-2 text-left font-semibold">
          Informacje o użytkowniku
        </h1>
        <UploadFile />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="photo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="my-4">Zdjęcie</FormLabel>
                  <FormControl>
                    <Avatar className="h-9 w-9">
                      <AvatarImage
                        alt="Avatar"
                        className="rounded-full border"
                        height="32"
                        src={user?.photo as string}
                        width="32"
                      />
                      <AvatarFallback>{user?.name.charAt(0)}</AvatarFallback>
                      <span className="sr-only">Zmień avatara</span>
                    </Avatar>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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

            <Button type="submit">Zapisz</Button>
          </form>
        </Form>
      </div>
    </>
  );
}
