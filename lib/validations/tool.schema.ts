import { z } from "zod";

export const ToolInputSchema = z.object({
  name: z
    .string({
      required_error: "Nazwa jest wymagana",
    })
    .min(1, { message: "Nazwa jest wymagana" }),
  catalogNumber: z
    .string({
      required_error: "Numer katalogowy jest wymagany",
    })
    .min(1, { message: "Numer katalogowy jest wymagany" }),
  description: z.string().optional(),
  categoryId: z.string({
    required_error: "Proszę wprowadzić kategorię",
  }),
  availability: z
    .boolean({
      required_error: "Wybierz dostępność",
    })
    .default(true),
});

export type ToolInput = z.infer<typeof ToolInputSchema>;
