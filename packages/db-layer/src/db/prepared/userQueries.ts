import { eq } from "drizzle-orm";
import { db } from "../db";
import { schema } from "../schemaModels";

export const selectUserByEmail = async (email: string) =>
  db.select().from(schema.user).where(eq(schema.user.email, email));

export const selectUserByNanoId = async (nanoId: string) =>
  db.query.user.findFirst({ where: (user, { eq }) => eq(user.nanoId, nanoId) });
