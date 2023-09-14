import { z } from "zod";

export const ToolSchema = z.object({
  ToolID: z.string(),
  Name: z.string(),
  Description: z.string(),
  CategoryID: z.string(),
  Availability: z.boolean(),
});

export type Tool = z.infer<typeof ToolSchema>;
