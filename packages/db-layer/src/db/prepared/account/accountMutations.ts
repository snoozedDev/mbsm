import { eq } from "drizzle-orm";
import { PgInsertValue, PgUpdateSetSource } from "drizzle-orm/pg-core";
import { db } from "../../db";
import { schema } from "../../schemaModels";

export const insertAccount = async (
  values: PgInsertValue<typeof schema.account>
) => db.insert(schema.account).values(values);

export const updateAccount = async ({
  id,
  fields,
}: {
  id: string;
  fields: PgUpdateSetSource<typeof schema.account>;
}) => db.update(schema.account).set(fields).where(eq(schema.account.id, id));
