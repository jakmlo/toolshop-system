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
import { editEquipment } from "@/lib/actions/equipment/actions";
import { ToolInput, ToolInputSchema } from "@/lib/validations/tool.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Category, Tool } from "@prisma/client";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

type EditEquipmentDialogProps = {
  tool: Tool | null;
  categories: Category[];
};

export default function EditEquipmentDialog({
  tool,
}: EditEquipmentDialogProps) {
  const [open, setOpen] = useState(false);
  const form = useForm<ToolInput>({
    resolver: zodResolver(ToolInputSchema),
    defaultValues: {
      name: tool?.name,
      catalogNumber: tool?.catalogNumber,
      description: tool?.description as string,
      availability: tool?.availability,
      categoryId: tool?.categoryId,
    },
  });

  useEffect(() => {
    form.reset({
      name: tool?.name,
      catalogNumber: tool?.catalogNumber,
      description: tool?.description as string,
      availability: tool?.availability,
      categoryId: tool?.categoryId,
    });
  }, [tool, form.reset]);

  const onSubmit: SubmitHandler<ToolInput> = async (data) => {
    try {
      const res = await editEquipment(data, tool?.toolId as string);
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
          <Button className=" mr-auto">Edytuj dane sprzętu</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edycja sprzętu</DialogTitle>
            <DialogDescription>
              Wprowadź zmiany w danych sprzętu. Jeśli będziesz gotowy zapisz
              zmiany.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nazwa sprzętu</FormLabel>
                    <FormControl>
                      <Input placeholder="Wprowadź nazwę sprzętu" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="catalogNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Numer katalogowy</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Wprowadź numer katalogowy"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Opis</FormLabel>
                    <FormControl>
                      <Input placeholder="Wprowadź opis" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kategoria</FormLabel>
                    <FormControl>
                      <Input placeholder="Wprowadź kategorię" {...field} />
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
