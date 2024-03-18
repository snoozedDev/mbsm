import { z } from "zod";

export const UserFacingAuthenticatorSchema = z.object({
  credentialId: z.string(),
  name: z.string(),
  addedAt: z.string(),
});

export type UserFacingAuthenticator = z.infer<
  typeof UserFacingAuthenticatorSchema
>;
