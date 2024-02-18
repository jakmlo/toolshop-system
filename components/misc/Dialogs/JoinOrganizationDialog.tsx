"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
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
import { joinOrganization } from "@/lib/actions/workspaces/actions";
import {
  JoinOrganizationInput,
  JoinOrganizationSchema,
} from "@/lib/validations/organization.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

export function JoinOrganizationDialog() {
  const { data: session, update } = useSession();
  const [open, setOpen] = useState(false);
  const form = useForm<JoinOrganizationInput>({
    resolver: zodResolver(JoinOrganizationSchema),
  });

  useEffect(() => {
    form.reset();
  }, [form.formState.isSubmitSuccessful]);

  const onSubmit: SubmitHandler<JoinOrganizationInput> = async (data) => {
    try {
      const res = await joinOrganization(data);
      if (res?.status === 404) {
        toast({
          title: "Błąd",
          description: res.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Sukces",
          description: "Pomyślnie wysłano prośbę o dołączenie do organizacji",
          variant: "default",
        });
        update({
          ...session,
          user: { ...session?.user, organizationId: res?.organizationId },
        });
        setOpen(false);
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Dołącz do organizacji</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Dołącz do organizacji</DialogTitle>
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
            <Button disabled={form.formState.isSubmitting} type="submit">
              Dołącz do organizacji
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
