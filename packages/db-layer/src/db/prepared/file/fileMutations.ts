import { eq } from "drizzle-orm";
import { PgUpdateSetSource } from "drizzle-orm/pg-core";
import { db } from "../../db";
import { schema } from "../../schemaModels";

export const updateFile = async ({
  id,
  fields,
}: {
  id: string;
  fields: PgUpdateSetSource<typeof schema.file>;
}) => db.update(schema.file).set(fields).where(eq(schema.file.id, id));
