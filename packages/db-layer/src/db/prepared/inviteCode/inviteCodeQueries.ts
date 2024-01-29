import { eq } from "drizzle-orm";
import { db } from "../../db";
import { schema } from "../../schemaModels";

export const getUserInviteCodes = async (userId: number) =>
  db
    .select()
    .from(schema.inviteCode)
    .where(eq(schema.inviteCode.userId, userId));
