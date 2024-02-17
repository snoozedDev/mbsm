import { ZodRawShape, z } from "zod";

export const SuccessResponseSchema = z.object({
  success: z.literal(true),
});

export type SuccessResponse = z.infer<typeof SuccessResponseSchema>;

export const ErrorResponseSchema = z.object({
  success: z.literal(false),
  error: z.string(),
});

export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;

export const generateActionResponse = <T extends ZodRawShape>(data: T) =>
  z.union([SuccessResponseSchema.extend(data), ErrorResponseSchema]);

export const EmptyResponseSchema = generateActionResponse({});

export type EmptyResponse = z.infer<typeof EmptyResponseSchema>;
