import { schema } from "@mbsm/db-layer";
import { nanoid } from "nanoid";

export const generateInviteCodesForUser = (
  userId: string
): Required<typeof schema.inviteCode.$inferInsert>[] =>
  Array.from({ length: 5 }, () => nanoid(16)).map((code) => ({
    code,
    userId,
    redeemed: false,
  }));
