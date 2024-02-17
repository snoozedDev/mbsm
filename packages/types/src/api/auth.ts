import { z } from "zod";
import { getZodTypeGuard } from "../zodUtils";
import { generateActionResponse } from "./common";

// GET /api/auth/login

// response schema
export const GetAuthLoginResponseSchema = generateActionResponse({
  options: z.any(),
});

// response type
export type GetAuthLoginResponse = z.infer<typeof GetAuthLoginResponseSchema>;

// POST /api/auth/login/verify

// body schema
export const PostAuthLoginVerifyBodySchema = z.object({
  attRes: z.any(),
});

// body type
export type PostAuthLoginVerifyBody = z.infer<
  typeof PostAuthLoginVerifyBodySchema
>;

// body type guard
export const isPostAuthLoginVerifyBody = getZodTypeGuard(
  PostAuthLoginVerifyBodySchema
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
