import type { DbSchema } from "@mbsm/db-layer";
import type { UserFacingInviteCode } from "@mbsm/types";

export const toUserFacingInviteCode = ({
  inviteCode,
}: {
  inviteCode: DbSchema<"inviteCode">;
}): UserFacingInviteCode => ({
  code: inviteCode.code,
  redeemed: inviteCode.redeemed,
});
