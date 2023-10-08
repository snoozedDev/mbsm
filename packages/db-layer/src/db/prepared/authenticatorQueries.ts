import { and, eq, isNull } from "drizzle-orm";
import { db } from "../db";
import { schema } from "../schemaModels";

export const getAuthenticatorsForUser = async (userId: bigint) =>
  db
    .select()
    .from(schema.authenticator)
    .where(
      and(
        eq(schema.authenticator.userId, userId),
        isNull(schema.authenticator.deletedAt)
      )
    );

export const getAuthenticatorByCredentialId = async (credentialId: string) =>
  db
    .select()
    .from(schema.authenticator)
    .where(
      and(
        eq(schema.authenticator.credentialId, credentialId),
        isNull(schema.authenticator.deletedAt)
      )
    );
