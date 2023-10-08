import { db, schema } from "@mbsm/db-layer";
import { getEnvAsStr } from "@mbsm/utils";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export const validateInviteCode = async (inviteCode: string) => {
  if (inviteCode !== getEnvAsStr("REUSABLE_INVITE_CODE")) {
    const [code] = await db
      .select()
      .from(schema.inviteCode)
      .where(eq(schema.inviteCode.code, inviteCode));

    if (!code) {
      return new NextResponse("Invalid invite code", { status: 400 });
    }
  }
};
