"use client";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "@/components/ui/use-toast";
import { SingleImageDropzone } from "@/components/utils/single-image-dropzone";
import { addEquipment } from "@/lib/actions/equipment/actions";
import { useEdgeStore } from "@/lib/edgestore";
import { cn } from "@/lib/utils";
import { ToolInput, ToolInputSchema } from "@/lib/validations/tool.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Category } from "@prisma/client";
import { Check, ChevronsUpDown } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";

type AddEquipmentFormProps = {
  categories: Category[];
};

export default function AddEquipmentForm({
  categories,
}: AddEquipmentFormProps) {
  const transformedCategories = Object.keys(categories).map((key) => ({
    value: categories[~~key].categoryId,
    label: categories[~~key].name,
  }));

  const [file, setFile] = React.useState<File>();
  const { edgestore } = useEdgeStore();

  const router = useRouter();

  const form = useForm<ToolInput>({
    resolver: zodResolver(ToolInputSchema),
    defaultValues: {
      name: "",
      catalogNumber: "",
      description: "",
      categoryId: "",
      availability: true,
    },
  });

  const onSubmit: SubmitHandler<ToolInput> = async (data) => {
    try {
      let url: string | undefined;
      if (file) {
        const res = await edgestore.publicFiles.upload({
          file,
        });
        url = res.url;
      }
      const res = await addEquipment(data, url);

      if (res?.status === 200) {
        toast({
          title: "Sukces",
          description: "Pomyślnie dodano nowy sprzęt",
          variant: "default",
        });
        form.reset();
        router.push("/equipment");
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
      <h1 className="p-2 text-left font-semibold">Dodawanie sprzętu</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nazwa sprzętu</FormLabel>
                <FormControl>
                  <Input placeholder="Wprowadź nazwę" {...field} />
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
                  <Input placeholder="Wprowadź numer katalogowy" {...field} />
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
              <FormItem className="flex flex-col">
                <FormLabel className="pb-1">Kategoria</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "w-[240px] justify-between",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        {field.value
                          ? transformedCategories.find(
                              (category) => category.value === field.value,
                            )?.label
                          : "Wybierz kategorię"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[240px] p-0">
                    <Command>
                      <CommandInput placeholder="Szukaj kategorii..." />
                      <CommandEmpty>Nie znaleziono kategorii</CommandEmpty>
                      <CommandGroup>
                        {transformedCategories.map((category) => (
                          <CommandItem
                            value={category.label}
                            key={category.value}
                            onSelect={() => {
                              form.setValue("categoryId", category.value, {
                                shouldValidate: true,
                              });
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                category.value === field.value
                                  ? "opacity-100"
                                  : "opacity-0",
                              )}
                            />
                            {category.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormItem>
            <FormLabel>Obraz</FormLabel>
            <SingleImageDropzone
              width={200}
              height={200}
              value={file}
              onChange={(file) => {
                setFile(file);
              }}
            />
          </FormItem>
          <Button disabled={form.formState.isSubmitting} type="submit">
            Dodaj sprzęt
          </Button>
        </form>
      </Form>
    </div>
  );
}
