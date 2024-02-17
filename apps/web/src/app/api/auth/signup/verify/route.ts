import { validateInviteCode } from "@/server/inviteCodeUtils";
import { registerLimiter } from "@/server/rateLimit";
import {
  generateEmailVerificationCodeAndSend,
  logAndReturnGenericError,
} from "@/server/serverUtils";
import { createAndSetAuthTokens } from "@/utils/tokenUtils";
import { getWebAuthnResponseForRegistration } from "@/utils/webAuthnUtils";
import { db, schema } from "@mbsm/db-layer";
import { EmptyResponse } from "@mbsm/types";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (
  req: NextRequest
): Promise<NextResponse<EmptyResponse>> => {
  const limitRes = await registerLimiter.middleware(req);
  if (limitRes) return limitRes;
  const userAgent = req.headers.get("user-agent");
  if (!userAgent)
    return logAndReturnGenericError("No user agent found", "unauthorized");
  const { attRes, email, inviteCode } = await req.json();

  const inviteCodeResponse = await validateInviteCode(inviteCode);
  if (inviteCodeResponse) return inviteCodeResponse;

  const [user] = await db
    .select()
    .from(schema.user)
    .where(eq(schema.user.email, email));

  if (!user?.currentRegChallenge) {
    return logAndReturnGenericError("No challenge found", "unauthorized");
  }

  if (user.protected) {
    return logAndReturnGenericError("User already registered", "unauthorized");
  }

  let verification;
  try {
    verification = await getWebAuthnResponseForRegistration({
      attRes,
      expectedChallenge: user.currentRegChallenge,
    });
  } catch (e) {
    return logAndReturnGenericError(e, "unauthorized");
  }

  const { verified, registrationInfo } = verification;

  if (!verified) {
    return logAndReturnGenericError("Verification failed", "unauthorized");
  }

  const {
    credentialPublicKey,
    credentialID,
    counter,
    credentialBackedUp,
    credentialDeviceType,
  } = registrationInfo!;

  const res = NextResponse.json({ success: true as const });

  await Promise.all([
    createAndSetAuthTokens(req, res, user),
    generateEmailVerificationCodeAndSend({
      email,
      userId: user.id,
    }),
    db.insert(schema.authenticator).values({
      credentialId: Buffer.from(credentialID).toString("base64url"),
      credentialPublicKey:
        Buffer.from(credentialPublicKey).toString("base64url"),
      credentialBackedUp,
      credentialDeviceType,
      counter,
      userId: user.id,
      transports: [].join(","),
      name: nanoid(16),
    }),
    db
      .update(schema.user)
      .set({ currentRegChallenge: null, protected: true })
      .where(eq(schema.user.id, user.id)),
    db
      .update(schema.inviteCode)
      .set({ redeemed: true })
      .where(eq(schema.inviteCode.code, inviteCode)),
  ]);

  return res;
};
