import { eq } from "drizzle-orm";
import { PgInsertValue, PgUpdateSetSource } from "drizzle-orm/pg-core";
import { db } from "../../db";
import { schema } from "../../schemaModels";

export const updateAuthenticator = async ({
  id,
  fields,
}: {
  id: number;
  fields: PgUpdateSetSource<typeof schema.authenticator>;
}) =>
  db
    .update(schema.authenticator)
    .set(fields)
    .where(eq(schema.authenticator.id, id));

export const insertAuthenticator = async (
  fields: PgInsertValue<typeof schema.authenticator>
) => db.insert(schema.authenticator).values(fields);
