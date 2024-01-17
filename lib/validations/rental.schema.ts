import { z } from "zod";

export const RentalInputSchema = z.object({
  contractor: z
    .string({
      required_error: "Contractor is required",
    })
    .min(1, "Contractor is required"),
  date: z.coerce.date({ required_error: "Please select a date" }),
  tool: z
    .string({
      required_error: "Tool is required",
    })
    .min(1, "Tool is required"),
  quantity: z
    .number({
      required_error: "Quantity is required",
      invalid_type_error: "Quantity is required",
    })
    .positive({ message: "Please input positive number" }),
});

export type RentalInput = z.infer<typeof RentalInputSchema>;

export const RentalSchema = z.object({
  rentalId: z.string(),
  toolId: z.string(),
  contractorId: z.string(),
  rentalDate: z.date(),
  returnDate: z.date(),
  status: z.string(),
});

export type Rental = z.infer<typeof RentalSchema>;
