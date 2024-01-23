import { z } from "zod";

export const RentalInputSchema = z.object({
  contractor: z
    .string({
      required_error: "Kontrahent jest wymagany",
    })
    .min(1, "Kontrahent jest wymagany"),
  date: z.coerce.date({ required_error: "Proszę wybrać datę" }),
  tool: z
    .string({
      required_error: "Proszę wybrać sprzęt",
    })
    .min(1, "Proszę wybrać sprzęt"),
  quantity: z
    .number({
      required_error: "Proszę wybrać ilość",
      invalid_type_error: "Niepoprawna wartość",
    })
    .positive({ message: "Proszę wpisać pozystywną wartość" }),
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
