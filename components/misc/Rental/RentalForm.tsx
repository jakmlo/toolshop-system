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
import { format } from "date-fns";
import {
  Calendar as CalendarIcon,
  Check,
  ChevronsUpDown,
  Plus,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { Calendar } from "@/components/ui/calendar";
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
import {
  RentalInput,
  RentalInputSchema,
} from "@/lib/validations/rental.schema";
import { checkToolStore, createRental } from "@/lib/actions/rental/actions";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";
import { Contractor, Tool } from "@prisma/client";
import { useState } from "react";
import RentalList from "./RentalList";
import { useRouter } from "next/navigation";

type RentalProps = {
  contractors: Contractor[];
  tools: Tool[];
};

export function RentalForm({ contractors, tools }: RentalProps) {
  const [rentalList, setRentalList] = useState<RentalInput[]>([]);
  const [catalogNumberCount, setCatalogNumberCount] = useState<{
    [key: string]: number;
  }>({});
  const [contractorAdded, setContractorAdded] = useState(false);

  const router = useRouter();

  const transformedContractors = Object.keys(contractors).map((key) => ({
    value: contractors[~~key].contractorId,
    label: `${contractors[~~key].firstName} ${contractors[~~key].lastName}`,
  }));

  const transformedTools = Object.keys(tools).map((key) => ({
    value: tools[~~key].toolId,
    label: tools[~~key].name,
  }));

  const form = useForm<RentalInput>({
    resolver: zodResolver(RentalInputSchema),
    defaultValues: {
      contractor: "",
      tool: "",
      date: new Date(),
      quantity: 1,
    },
  });

  async function onSubmit(event: React.MouseEvent<HTMLButtonElement>) {
    try {
      event.preventDefault();
      const res = await createRental(rentalList);
      if (res?.status === 201) {
        router.push("/");
        toast({
          title: "Success",
          description: res.message,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: res?.message,
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

  async function addRentalItem(data: RentalInput) {
    try {
      const selectedTool = tools.find((t) => t.toolId === data.tool);

      if (selectedTool) {
        const catalogNumber = selectedTool.catalogNumber;

        const numberOfCatalog = {
          [catalogNumber]:
            (catalogNumberCount[catalogNumber] || 0) + data.quantity,
        };

        const count = await checkToolStore(catalogNumber);
        if (count >= numberOfCatalog[catalogNumber]) {
          setCatalogNumberCount((prevCount) => ({
            ...prevCount,
            [catalogNumber]: (prevCount[catalogNumber] || 0) + data.quantity,
          }));
          setRentalList((prevList) => [
            ...prevList,
            ...Array.from({ length: data.quantity }, () => ({ ...data })),
          ]);
          form.reset({ contractor: data.contractor });
        } else {
          toast({
            variant: "destructive",
            title: "Tool Not Available",
            description:
              "The selected tool is not available in sufficient quantity.",
          });
        }
      } else {
        toast({
          variant: "destructive",
          title: "Tool Not Found",
          description:
            "The selected tool was not found in the list of available tools.",
        });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  }
  return (
    <>
      <Form {...form}>
        <form className="space-y-6">
          <FormField
            control={form.control}
            name="contractor"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Contractor</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        disabled={contractorAdded}
                        className={cn(
                          "w-[240px] justify-between",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value
                          ? transformedContractors.find(
                              (contractor) => contractor.value === field.value
                            )?.label
                          : "Select contractor"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[240px] p-0">
                    <Command>
                      <CommandInput placeholder="Search contractor..." />
                      <CommandEmpty>No contractor found.</CommandEmpty>
                      <CommandGroup>
                        {transformedContractors.map((contractor) => (
                          <CommandItem
                            value={contractor.label}
                            key={contractor.value}
                            onSelect={() => {
                              form.setValue("contractor", contractor.value, {
                                shouldValidate: true,
                              });
                              setContractorAdded(true);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                contractor.value === field.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {contractor.label}
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
          {contractorAdded && (
            <>
              <FormField
                control={form.control}
                name="tool"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Tool</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "w-[240px] justify-between",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value
                              ? transformedTools.find(
                                  (tool) => tool.value === field.value
                                )?.label
                              : "Select tool"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-[240px] p-0">
                        <Command>
                          <CommandInput placeholder="Search tool..." />
                          <CommandEmpty>No tools found.</CommandEmpty>
                          <CommandGroup>
                            {transformedTools.map((tool) => (
                              <CommandItem
                                value={tool.label}
                                key={tool.value}
                                onSelect={() => {
                                  form.setValue("tool", tool.value, {
                                    shouldValidate: true,
                                  });
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    tool.value === field.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {tool.label}
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
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Return date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[240px] pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date <
                            new Date(
                              new Date().setDate(new Date().getDate() - 1)
                            )
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Quantity"
                        type="number"
                        min="1"
                        {...field}
                        {...form.register("quantity", { valueAsNumber: true })}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}

          <Button onClick={form.handleSubmit(addRentalItem)}>
            <Plus />
          </Button>
        </form>
      </Form>
      <Button onClick={onSubmit}>Zatwierdź wypożyczenie</Button>
      <RentalList tools={tools} catalogNumberCount={catalogNumberCount} />
    </>
  );
}
