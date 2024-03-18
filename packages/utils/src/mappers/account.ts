import type { DbSchema } from "@mbsm/db-layer";
import type { UserFacingAccount } from "@mbsm/types";

export const toUserFacingAccount = ({
  account,
  avatar,
}: {
  account: DbSchema<"account">;
  avatar?: DbSchema<"file"> | null;
}): UserFacingAccount => ({
  id: account.id,
  handle: account.handle,
  avatarUrl: avatar?.url ?? undefined,
  profileData: account.profileData ?? undefined,
  joinedAt: account.createdAt.toISOString(),
});
