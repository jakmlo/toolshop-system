import { z } from "zod";

export const ReturnInputSchema = z.object({
  rental: z
    .string({
      required_error: "Proszę wybrać wypożyczenie",
    })
    .min(1, "Proszę wybrać wypożyczenie"),
});

export type ReturnInput = z.infer<typeof ReturnInputSchema>;
