import { z } from "zod";

export const UserFacingInviteCodeSchema = z.object({
  code: z.string(),
  redeemed: z.boolean(),
});

export type UserFacingInviteCode = z.infer<typeof UserFacingInviteCodeSchema>;
