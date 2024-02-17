import { z } from "zod";
import { EmailVerificationCodeFormSchema } from "../forms";
import { AuthenticatorSchema, InviteCodeSchema } from "../models";
import { generateActionResponse } from "./common";

// GET /api/user/me

// response schema
export const GetUserMeResponseSchema = generateActionResponse({
  email: z.string(),
  emailVerified: z.boolean(),
});

// response type
export type GetUserMeResponse = z.infer<typeof GetUserMeResponseSchema>;

// GET /api/user/settings

// response schema
export const GetUserSettingsResponseSchema = generateActionResponse({
  authenticators: AuthenticatorSchema.array(),
  inviteCodes: InviteCodeSchema.array(),
});

// response type
export type GetUserSettingsResponse = z.infer<
  typeof GetUserSettingsResponseSchema
>;

// POST /api/user/email/verify

// response schema
export const PostUserEmailVerifyBodySchema = EmailVerificationCodeFormSchema;

// response type
export type PostUserEmailVerifyBody = z.infer<
  typeof PostUserEmailVerifyBodySchema
>;
