import { z } from "zod";
import { getZodTypeGuard } from "../zodUtils";
import { generateActionResponse } from "./common";

// GET /api/auth/signin

// response schema
export const GetAuthSignInResponseSchema = generateActionResponse({
  options: z.any(),
});

// response type
export type GetAuthSignInResponse = z.infer<typeof GetAuthSignInResponseSchema>;

// POST /api/auth/signin/verify

// body schema
export const PostAuthSignInVerifyBodySchema = z.object({
  attRes: z.any(),
});

// body type
export type PostAuthSignInVerifyBody = z.infer<
  typeof PostAuthSignInVerifyBodySchema
>;

// body type guard
export const isPostAuthSignInVerifyBody = getZodTypeGuard(
  PostAuthSignInVerifyBodySchema
);

// POST /api/auth/signup

// response schema
export const PostAuthSignupResponseSchema = generateActionResponse({
  options: z.any(),
});

// response type
export type PostAuthSignupResponse = z.infer<
  typeof PostAuthSignupResponseSchema
>;

// body schema
export const PostAuthSignupBodySchema = z.object({
  email: z.string(),
  inviteCode: z.string(),
});

// body typeguard
export const isPostAuthSignupBody = getZodTypeGuard(PostAuthSignupBodySchema);

// body type
export type PostAuthSignupBody = z.infer<typeof PostAuthSignupBodySchema>;

// POST /api/auth/signup/verify

// response schema
export const PostAuthSignupVerifyBodySchema = z.object({
  attRes: z.any(),
  email: z.string(),
  inviteCode: z.string(),
});

// response type
export type PostAuthSignupVerifyBody = z.infer<
  typeof PostAuthSignupVerifyBodySchema
>;

// body typeguard
export const isPostAuthSignupVerifyBody = getZodTypeGuard(
  PostAuthSignupVerifyBodySchema
);
