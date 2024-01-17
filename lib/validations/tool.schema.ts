import { z } from "zod";

export const ToolSchema = z.object({
  toolId: z.string(),
  name: z.string(),
  description: z.string().optional(),
  categoryId: z.string(),
  availability: z.boolean(),
});

export type Tool = z.infer<typeof ToolSchema>;
