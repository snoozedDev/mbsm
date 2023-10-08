import { validateInviteCode } from "@/server/inviteCodeUtils";
import { registerLimiter } from "@/server/rateLimit";
import { getWebAuthnRegistrationOptions } from "@/utils/webAuthnUtils";
import { db, getUserByEmail, schema } from "@mbsm/db-layer";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const limitRes = await registerLimiter.middleware(req);
  if (limitRes) return limitRes;

  const { email, inviteCode } = await req.json();

  if (!inviteCode || !email) {
    return new NextResponse("Bad Request", { status: 400 });
  }

  const inviteCodeResponse = await validateInviteCode(inviteCode);
  if (inviteCodeResponse) return inviteCodeResponse;

  const nanoId = nanoid(12);

  const existingUser = await getUserByEmail(email);

  if (existingUser && existingUser.protected) {
    return new NextResponse("Email already exists", { status: 409 });
  }

  const options = getWebAuthnRegistrationOptions({
    userID: nanoId,
    userName: email,
  });

  if (existingUser) {
    await db
      .update(schema.user)
      .set({
        currentRegChallenge: options.challenge,
      })
      .where(eq(schema.user.id, existingUser.id));
  } else {
    await db.insert(schema.user).values({
      email,
      nanoId,
      currentRegChallenge: options.challenge,
    });
  }

  return NextResponse.json({ options });
};
