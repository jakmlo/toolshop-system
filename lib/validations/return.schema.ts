import { z } from "zod";

export const ReturnInputSchema = z.object({
  rental: z
    .string({
      required_error: "Rental is required",
    })
    .min(1, "Rental is required"),
});

export type ReturnInput = z.infer<typeof ReturnInputSchema>;
