import { validateInviteCode } from "@/server/inviteCodeUtils";
import { registerLimiter } from "@/server/rateLimit";
import { logAndReturnGenericError } from "@/server/serverUtils";
import { getWebAuthnRegistrationOptions } from "@/utils/webAuthnUtils";
import { db, getUserByEmail, schema } from "@mbsm/db-layer";
import { PostAuthSignupResponse, isPostAuthSignupBody } from "@mbsm/types";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (
  req: NextRequest
): Promise<NextResponse<PostAuthSignupResponse>> => {
  const limitRes = await registerLimiter.middleware(req);
  if (limitRes) return limitRes;

  const body = await req.json();
  if (!isPostAuthSignupBody(body)) {
    return new NextResponse("Bad Request", { status: 400 });
  }

  const { email, inviteCode } = body;

  const inviteCodeResponse = await validateInviteCode(inviteCode);
  if (inviteCodeResponse) return inviteCodeResponse;

  const id = nanoid();

  const existingUser = await getUserByEmail(email);

  if (existingUser && existingUser.protected) {
    return logAndReturnGenericError("User already registered", "unauthorized");
  }

  const options = await getWebAuthnRegistrationOptions({
    userID: id,
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
      role: "user",
      id,
      email,
      currentRegChallenge: options.challenge,
    });
  }

  return NextResponse.json({
    success: true,
    options,
  });
};
