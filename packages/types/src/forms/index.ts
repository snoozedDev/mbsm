import { z } from "zod";

export const EmailVerificationCodeFormSchema = z.object({
  code: z.string().length(6, "Code must be 6 characters long"),
});

export type EmailVerificationCodeForm = z.infer<
  typeof EmailVerificationCodeFormSchema
>;

export const AccountCreationFormSchema = z.object({
  handle: z
    .string()
    .min(3, "Handle must be at least 3 characters long")
    .max(16, "Handle must be at most 16 characters long")
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      "Handle must only contain letters, numbers, underscores, and hyphens"
    ),
});

export type AccountCreationForm = z.infer<typeof AccountCreationFormSchema>;
