import { eq } from "drizzle-orm";
import { db } from "../../db";
import { schema } from "../../schemaModels";

export const updateAuthenticatorName = async ({
  name,
  id,
}: {
  name: string;
  id: bigint;
}) =>
  db
    .update(schema.authenticator)
    .set({
      name,
    })
    .where(eq(schema.authenticator.id, id));
