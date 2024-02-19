import { eq } from "drizzle-orm";
import { PgInsertValue, PgUpdateSetSource } from "drizzle-orm/pg-core";
import { db } from "../../db";
import { schema } from "../../schemaModels";

export const clearCurrentUserChallenge = async (userId: string) =>
  db
    .update(schema.user)
    .set({ currentRegChallenge: null })
    .where(eq(schema.user.id, userId));

export const updateUser = async ({
  id,
  fields,
}: {
  id: string;
  fields: PgUpdateSetSource<typeof schema.user>;
}) => db.update(schema.user).set(fields).where(eq(schema.user.id, id));

export const insertUser = async (fields: PgInsertValue<typeof schema.user>) =>
  db.insert(schema.user).values(fields);
