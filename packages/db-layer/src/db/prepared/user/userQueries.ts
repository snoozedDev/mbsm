import { db } from "../../db";

export const getUserByEmail = async (email: string) =>
  db.query.user.findFirst({ where: (user, { eq }) => eq(user.email, email) });

export const getUserByNanoId = async (nanoId: string) =>
  db.query.user.findFirst({ where: (user, { eq }) => eq(user.nanoId, nanoId) });
