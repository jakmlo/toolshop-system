"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Check, ChevronsUpDown } from "lucide-react";
import { useForm } from "react-hook-form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";
import { returnAction } from "@/lib/actions/return/actions";
import {
  ReturnInput,
  ReturnInputSchema,
} from "@/lib/validations/return.schema";
import { Rental } from "@prisma/client";

type ReturnProps = {
  rentals: Rental[];
};

export function ReturnForm({ rentals }: ReturnProps) {
  const transformedRentals = Object.keys(rentals).map((key) => ({
    value: rentals[~~key].rentalId,
    label: rentals[~~key].rentalId,
  }));

  const form = useForm<ReturnInput>({
    resolver: zodResolver(ReturnInputSchema),
    defaultValues: {
      rental: "",
    },
  });

  async function onSubmit(data: ReturnInput) {
    try {
      const res = await returnAction(data);
      if (res.status === 200) {
        toast({
          title: "Success",
          description: res.message,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: res.message,
        });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.messsage,
      });
    }
  }
  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="rental"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>rental</FormLabel>
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
                          ? transformedRentals.find(
                              (rental) => rental.value === field.value,
                            )?.label
                          : "Select rental"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[240px] p-0">
                    <Command>
                      <CommandInput placeholder="Search rental..." />
                      <CommandEmpty>No rentals found.</CommandEmpty>
                      <CommandGroup>
                        {transformedRentals.map((rental) => (
                          <CommandItem
                            value={rental.label}
                            key={rental.value}
                            onSelect={() => {
                              form.setValue("rental", rental.value, {
                                shouldValidate: true,
                              });
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                rental.value === field.value
                                  ? "opacity-100"
                                  : "opacity-0",
                              )}
                            />
                            {rental.label}
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
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </>
  );
}
