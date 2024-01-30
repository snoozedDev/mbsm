import { InviteCode } from "@mbsm/types";
import { eq } from "drizzle-orm";
import { PgUpdateSetSource } from "drizzle-orm/pg-core";
import { db } from "../../db";
import { schema } from "../../schemaModels";

export const insertInviteCodes = async ({
  inviteCodes,
  userId,
}: {
  inviteCodes: InviteCode[];
  userId: number;
}) =>
  db.insert(schema.inviteCode).values(
    inviteCodes.map((input) => ({
      code: input.code,
      redeemed: false,
      userId,
    }))
  );

export const updateInviteCode = async ({
  code,
  fields,
}: {
  code: string;
  fields: PgUpdateSetSource<typeof schema.inviteCode>;
}) =>
  db
    .update(schema.inviteCode)
    .set(fields)
    .where(eq(schema.inviteCode.code, code));
