import { PgInsertValue } from "drizzle-orm/pg-core";
import { db } from "../../db";
import { schema } from "../../schemaModels";

export const insertAccount = async (
  values: PgInsertValue<typeof schema.account>
) => db.insert(schema.account).values(values);
