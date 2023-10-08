import { z } from "zod";

export const getFormattedZodError = (error: z.ZodError) =>
  error.issues.map((i) => i.message).join(", ");
