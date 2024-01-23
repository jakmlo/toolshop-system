"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { createOrganization } from "@/lib/actions/workspaces/actions";
import {
  CreateOrganizationInput,
  CreateOrganizationSchema,
} from "@/lib/validations/organization.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";

export function CreateOrganizationDialog({
  children,
}: {
  children: React.ReactNode;
}) {
  const form = useForm<CreateOrganizationInput>({
    resolver: zodResolver(CreateOrganizationSchema),
  });

  const onSubmit: SubmitHandler<CreateOrganizationInput> = async (data) => {
    try {
      const res = await createOrganization(data);
      if (res?.status === 404) {
        toast({
          title: "Błąd",
          description: "Nie znaleziono takiego użytkownika",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Sukces",
          description: "Pomyślnie utworzono organizację",
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
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Stwórz obszar roboczy</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nazwa organizacji</FormLabel>
                  <FormControl>
                    <Input placeholder="Organizacja" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogClose asChild>
              <Button disabled={form.formState.isSubmitting} type="submit">
                Stwórz organizację
              </Button>
            </DialogClose>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
