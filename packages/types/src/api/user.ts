import { z } from "zod";
import { EmailVerificationCodeFormSchema } from "../forms";
import { AuthenticatorSchema, InviteCodeSchema } from "../models";
import { getZodTypeGuard } from "../zodUtils";
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

// GET /api/user/authenticator

// response schema
export const GetUserAuthenticatorResponseSchema = generateActionResponse({
  regOptions: z.any(),
});

// response type
export type GetUserAuthenticatorResponse = z.infer<
  typeof GetUserAuthenticatorResponseSchema
>;

// PUT /api/user/authenticator

// response schema
export const PutUserAuthenticatorResponseSchema = generateActionResponse({
  authenticator: AuthenticatorSchema,
});

// response type
export type PutUserAuthenticatorResponse = z.infer<
  typeof PutUserAuthenticatorResponseSchema
>;

// PATCH /api/user/authenticator/credentialId

// body schema
export const PatchUserAuthenticatorCredentialIdBodySchema = z.object({
  name: z.string(),
});

// body type
export type PatchUserAuthenticatorCredentialIdBody = z.infer<
  typeof PatchUserAuthenticatorCredentialIdBodySchema
>;

// body type guard
export const isPatchUserAuthenticatorCredentialIdBody = getZodTypeGuard(
  PatchUserAuthenticatorCredentialIdBodySchema
);
