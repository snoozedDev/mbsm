import { db } from "../../db";

export const getUserByEmail = async (email: string) =>
  db.query.user.findFirst({ where: (user, { eq }) => eq(user.email, email) });

export const getUserById = async (id: string) =>
  db.query.user.findFirst({ where: (user, { eq }) => eq(user.id, id) });
