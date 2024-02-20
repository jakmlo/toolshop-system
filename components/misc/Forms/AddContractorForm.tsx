"use client";
import { Button } from "@/components/ui/button";
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
import { addContractor } from "@/lib/actions/contractors/actions";
import {
  ContractorInput,
  ContractorInputSchema,
} from "@/lib/validations/contractor.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";

export default function AddContractorForm() {
  const router = useRouter();

  const form = useForm<ContractorInput>({
    resolver: zodResolver(ContractorInputSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      taxIdNumber: "",
      address: "",
      phoneNumber: "",
    },
  });

  const onSubmit: SubmitHandler<ContractorInput> = async (data) => {
    try {
      const res = await addContractor(data);
      if (res?.status === 200) {
        toast({
          title: "Sukces",
          description: "Pomyślnie dodano nowego kontrahenta",
          variant: "default",
        });
        form.reset();
        router.push("/contractors");
      } else {
        toast({
          title: "Błąd",
          description: res?.message,
          variant: "destructive",
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
    <div className="w-1/3 rounded-lg bg-white p-4 shadow-md dark:bg-gray-800 md:p-6">
      <h1 className="p-2 text-left font-semibold">Dodawanie kontrahenta</h1>
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
            Dodaj kontrahenta
          </Button>
        </form>
      </Form>
    </div>
  );
}
