import { InviteCode } from "@mbsm/types";
import { db } from "../db";
import { schema } from "../schemaModels";

export const insertInviteCodes = async ({
  inviteCodes,
  userId,
}: {
  inviteCodes: InviteCode[];
  userId: bigint;
}) =>
  db.insert(schema.inviteCode).values(
    inviteCodes.map((input) => ({
      code: input.code,
      redeemed: 0,
      userId,
    }))
  );
