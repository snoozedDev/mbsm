import { ZodSchema, z } from "zod";

export const getZodTypeGuard =
  <T extends ZodSchema>(schema: T) =>
  (value: unknown): value is z.infer<T> => {
    try {
      schema.parse(value);
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

export const getFormattedZodError = (error: z.ZodError) =>
  error.issues.map((i) => i.message).join(", ");
