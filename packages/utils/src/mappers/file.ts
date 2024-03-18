import type { DbSchema } from "@mbsm/db-layer";
import type { UserFacingFile } from "@mbsm/types";

export const toUserFacingFile = ({
  file,
}: {
  file: DbSchema<"file">;
}): UserFacingFile => ({
  id: file.id,
  url: file.url ?? null,
  sizeKB: file.sizeKB,
  createdAt: file.createdAt.toISOString(),
});
