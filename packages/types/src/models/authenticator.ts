import { z } from "zod";
import { getZodTypeGuard } from "../zodUtils";

// SCHEMAS

export const AuthenticatorSchema = z.object({
  credentialId: z.string(),
  name: z.string(),
  addedAt: z.string(),
});

// TYPES
export type Authenticator = z.infer<typeof AuthenticatorSchema>;

// TYPE GUARDS
export const isAuthenticator = getZodTypeGuard(AuthenticatorSchema);
