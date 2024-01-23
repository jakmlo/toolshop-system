import { z } from "zod";

export const CreateOrganizationSchema = z.object({
  name: z
    .string({ required_error: "Proszę wprowadzić nazwę organizacji" })
    .min(1, { message: "Proszę wprowadzić nazwę organizacji" }),
});
export const JoinOrganizationSchema = z.object({
  name: z
    .string({ required_error: "Proszę wprowadzić nazwę organizacji" })
    .min(1, { message: "Proszę wprowadzić nazwę organizacji" }),
});

export type CreateOrganizationInput = z.infer<typeof CreateOrganizationSchema>;
export type JoinOrganizationInput = z.infer<typeof JoinOrganizationSchema>;
