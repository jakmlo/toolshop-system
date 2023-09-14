import { z } from "zod";

export const ContractorSchema = z.object({
  CustomerID: z.string(),
  FirstName: z.string({
    required_error: "First name is required",
  }),
  LastName: z.string({
    required_error: "Last name is required",
  }),
  Address: z.string(),
  PhoneNumber: z.string(),
});

export type Contractor = z.infer<typeof ContractorSchema>;
