"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
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
import { editContractor } from "@/lib/actions/contractors/actions";
import {
  ContractorInput,
  ContractorInputSchema,
} from "@/lib/validations/contractor.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Contractor } from "@prisma/client";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

type EditContractorDialogProps = {
  contractor: Contractor | null;
};

export default function EditContractorDialog({
  contractor,
}: EditContractorDialogProps) {
  const [open, setOpen] = useState(false);
  const form = useForm<ContractorInput>({
    resolver: zodResolver(ContractorInputSchema),
    defaultValues: {
      firstName: contractor?.firstName,
      lastName: contractor?.lastName,
      taxIdNumber: contractor?.taxIdNumber,
      address: contractor?.address,
      phoneNumber: contractor?.phoneNumber,
    },
  });

  useEffect(() => {
    form.reset({
      firstName: contractor?.firstName,
      lastName: contractor?.lastName,
      taxIdNumber: contractor?.taxIdNumber,
      address: contractor?.address,
      phoneNumber: contractor?.phoneNumber,
    });
  }, [contractor, form.formState.isSubmitSuccessful]);

  const onSubmit: SubmitHandler<ContractorInput> = async (data) => {
    try {
      const res = await editContractor(
        data,
        contractor?.contractorId as string,
      );
      if (res?.status === 204) {
        toast({
          title: "Zapisano zmiany",
          description: "",
          variant: "default",
        });
        setOpen(false);
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
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className=" mr-auto">Edytuj dane kontrahenta</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edycja kontrahenta</DialogTitle>
            <DialogDescription>
              Wprowadź zmiany w danych kontrahenta. Jeśli będziesz gotowy zapisz
              zmiany.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Imię</FormLabel>
                    <FormControl>
                      <Input placeholder="Wprowadź imię" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nazwisko</FormLabel>
                    <FormControl>
                      <Input placeholder="Wprowadź nazwisko" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="taxIdNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>NIP</FormLabel>
                    <FormControl>
                      <Input placeholder="Wprowadź NIP" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Adres</FormLabel>
                    <FormControl>
                      <Input placeholder="Wprowadź adres" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Numer telefonu</FormLabel>
                    <FormControl>
                      <Input placeholder="Wprowadź numer telefonu" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button disabled={form.formState.isSubmitting} type="submit">
                Zapisz zmiany
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
