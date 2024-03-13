import { db } from "../../db";

export const getAccountByHandle = async (handle: string) =>
  db.query.account.findFirst({
    where: (model, { eq, and, isNull }) =>
      and(eq(model.handle, handle), isNull(model.deletedAt)),
  });
