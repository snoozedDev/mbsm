import { db } from "../../db";

export const getAuthenticatorsForUser = async (userId: string) =>
  db.query.authenticator.findMany({
    where: (model, { eq, and, isNull }) =>
      and(eq(model.userId, userId), isNull(model.deletedAt)),
  });

export const getAuthenticatorByCredentialId = async (credentialId: string) =>
  db.query.authenticator.findFirst({
    where: (model, { eq, and, isNull }) =>
      and(eq(model.credentialId, credentialId), isNull(model.deletedAt)),
  });

export const getAuthenticatorAndUserByCredentialId = async (
  credentialId: string
) =>
  db.query.authenticator.findFirst({
    where: (model, { eq, and, isNull }) =>
      and(eq(model.credentialId, credentialId), isNull(model.deletedAt)),
    with: {
      user: true,
    },
  });
