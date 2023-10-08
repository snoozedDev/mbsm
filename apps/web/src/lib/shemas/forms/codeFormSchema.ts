import { z } from "zod";

export const codeFormSchema = z.object({
  code: z.string().length(6, "Code must be 6 characters long"),
});
