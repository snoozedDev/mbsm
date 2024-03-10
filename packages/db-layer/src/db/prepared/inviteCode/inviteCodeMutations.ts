import { eq } from "drizzle-orm";
import { PgInsertValue, PgUpdateSetSource } from "drizzle-orm/pg-core";
import { db } from "../../db";
import { schema } from "../../schemaModels";

export const insertInviteCodes = async ({
  inviteCodes,
  userId,
}: {
  inviteCodes: PgInsertValue<typeof schema.inviteCode>[];
  userId: string;
}) => db.insert(schema.inviteCode).values(inviteCodes);

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
