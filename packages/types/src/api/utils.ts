import { ZodRawShape, z } from "zod";

const SuccessResponse = z.object({
  success: z.literal(true),
});

const ErrorResponse = z.object({
  success: z.literal(false),
  error: z.string(),
});

export const generateActionResponse = <T extends ZodRawShape>(data: T) =>
  z.union([SuccessResponse.extend(data), ErrorResponse]);
