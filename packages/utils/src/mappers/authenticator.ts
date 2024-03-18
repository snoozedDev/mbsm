import type { DbSchema } from "@mbsm/db-layer";
import type { UserFacingAuthenticator } from "@mbsm/types";

export const toUserFacingAuthenticator = ({
  authenticator,
}: {
  authenticator: DbSchema<"authenticator">;
}): UserFacingAuthenticator => ({
  credentialId: authenticator.credentialId,
  name: authenticator.name,
  addedAt: authenticator.createdAt.toISOString(),
});
