import { z } from "zod";

export const ContractorInputSchema = z.object({
  firstName: z
    .string({
      required_error: "Imię jest wymagane",
    })
    .min(1, { message: "Imię jest wymagane" }),
  lastName: z
    .string({
      required_error: "Nazwisko jest wymagane",
    })
    .min(1, { message: "Nazwisko jest wymagane" }),
  taxIdNumber: z
    .string({
      required_error: "Wprowadź NIP",
    })
    .min(1, { message: "Wprowadź NIP" }),
  address: z
    .string({
      required_error: "Proszę wprowadzić adres",
    })
    .min(1, { message: "Proszę wprowadzić adres" }),
  phoneNumber: z
    .string({
      required_error: "Proszę wprowadzić numer telefonu",
    })
    .min(1, { message: "Proszę wprowadzić numer telefonu" }),
});

export type ContractorInput = z.infer<typeof ContractorInputSchema>;
