import { z } from "zod";
import { getZodTypeGuard } from "../zodUtils";

// SCHEMAS

export const InviteCodeSchema = z.object({
  code: z.string(),
  redeemed: z.boolean(),
});

// TYPES
export type InviteCode = z.infer<typeof InviteCodeSchema>;

// TYPE GUARDS
export const isInviteCode = getZodTypeGuard(InviteCodeSchema);
