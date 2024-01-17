import { z } from "zod";

export const ContractorSchema = z.object({
  contractorId: z.string(),
  firstName: z.string({
    required_error: "First name is required",
  }),
  lastName: z.string({
    required_error: "Last name is required",
  }),
  address: z.string(),
  phoneNumber: z.string(),
});

export type Contractor = z.infer<typeof ContractorSchema>;
