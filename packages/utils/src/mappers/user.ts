import type { DbSchema } from "@mbsm/db-layer";
import type { UserFacingUser } from "@mbsm/types";

export const toUserFacingUser = ({
  user,
}: {
  user: DbSchema<"user">;
}): UserFacingUser => ({
  email: user.email,
  emailVerified: user.emailVerified,
  joinedAt: user.createdAt.toISOString(),
  storageLimitMB: user.storageLimitMB,
  role: user.role,
});
